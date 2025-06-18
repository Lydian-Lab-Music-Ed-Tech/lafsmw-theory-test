import {
  removeAccidentalFromNotesAndCoords,
  updateNotesAndCoordsWithAccidental,
} from "../lib/modifyNotesAndCoordinates";
import {
  ButtonStates,
  GlyphProps,
  NotesAndCoordinatesData,
  StaveType,
} from "./types";

// Correct order of accidentals in key signatures
const SHARP_ORDER = ["F#", "C#", "G#", "D#", "A#", "E#", "B#"];
const FLAT_ORDER = ["Bb", "Eb", "Ab", "Db", "Gb", "Cb", "Fb"];

// Calculate a quantized x-position for an accidental based on how many accidentals are already present
const getQuantizedXPosition = (
  stave: StaveType,
  existingGlyphs: GlyphProps[],
  accidentalSpacing: number = 15 // approx 1/8th inch in pixels
): number => {
  // Start from the left edge of the staff plus some initial padding
  const baseX = stave.getNoteStartX() + 10;

  // Calculate position based on the number of existing accidentals
  const accidentalCount = existingGlyphs.length;

  // Return the position based on how many accidentals are already there
  return baseX + accidentalCount * accidentalSpacing;
};

// Helper function to get the correct position of a note in the key signature order
const getAccidentalIndex = (note: string, isSharp: boolean): number => {
  const order = isSharp ? SHARP_ORDER : FLAT_ORDER;
  const noteName = note.length > 1 ? note.slice(0, 2) : note + (isSharp ? '#' : 'b');
  return order.findIndex(n => n === noteName);
};

export const handleKeySigInteraction = (
  notesAndCoordinates: NotesAndCoordinatesData[],
  buttonState: ButtonStates,
  foundNoteData: NotesAndCoordinatesData,
  yClick: number,
  setGlyphState: (newState: React.SetStateAction<GlyphProps[]>) => void,
  glyphState: GlyphProps[],
  setKeySigState: (newState: React.SetStateAction<string[]>) => void,
  keySig: string[],
  stave: StaveType
) => {
  let updatedGlyphs = [...glyphState];
  let updatedKeySig = [...keySig];
  const noteBase = foundNoteData.note.charAt(0);
  const isSharp = buttonState.isSharpActive;
  const isFlat = buttonState.isFlatActive;
  const isErase = buttonState.isEraseAccidentalActive;

  if (isSharp || isFlat) {
    // Update notes and coordinates with the new accidental
    notesAndCoordinates = updateNotesAndCoordsWithAccidental(
      buttonState,
      foundNoteData,
      notesAndCoordinates
    );

    // Remove any existing accidental for this note
    updatedKeySig = keySig.filter(note => note.charAt(0) !== noteBase);
    updatedGlyphs = updatedGlyphs.filter(glyph => {
      const glyphNote = notesAndCoordinates.find(n => n.yCoordinateMin === glyph.yPosition)?.note;
      return !glyphNote || glyphNote.charAt(0) !== noteBase;
    });

    // Add the new accidental
    const accidental = isSharp ? '#' : 'b';
    const noteWithAccidental = `${noteBase}${accidental}`;
    updatedKeySig.push(noteWithAccidental);

    // Sort the key signature according to the correct order
    const order = isSharp ? SHARP_ORDER : FLAT_ORDER;
    updatedKeySig.sort((a, b) => {
      const aIndex = order.findIndex(n => n.startsWith(a[0]));
      const bIndex = order.findIndex(n => n.startsWith(b[0]));
      return aIndex - bIndex;
    });

    // Rebuild the glyphs array in the correct order
    const newGlyphs: GlyphProps[] = [];
    updatedKeySig.forEach((note, index) => {
      const noteBase = note.charAt(0);
      const noteData = notesAndCoordinates.find(n => n.note.startsWith(noteBase));
      if (noteData) {
        const xPos = stave.getNoteStartX() + 10 + index * 15; // 15px spacing between accidentals
        newGlyphs.push({
          xPosition: xPos,
          yPosition: noteData.yCoordinateMin,
          glyph: note.endsWith('#') ? 'accidentalSharp' : 'accidentalFlat'
        });
      }
    });

    updatedGlyphs = newGlyphs;
    setGlyphState(updatedGlyphs);
    setKeySigState(updatedKeySig);
  } else if (isErase) {
    // Handle erasing an accidental
    updatedKeySig = keySig.filter(note => note.charAt(0) !== noteBase);
    updatedGlyphs = updatedGlyphs.filter(glyph => {
      const glyphNote = notesAndCoordinates.find(n => n.yCoordinateMin === glyph.yPosition)?.note;
      return !glyphNote || glyphNote.charAt(0) !== noteBase;
    });

    // Rebuild the remaining glyphs with correct x-positions
    const newGlyphs: GlyphProps[] = [];
    updatedKeySig.forEach((note, index) => {
      const noteBase = note.charAt(0);
      const noteData = notesAndCoordinates.find(n => n.note.startsWith(noteBase));
      if (noteData) {
        const xPos = stave.getNoteStartX() + 10 + index * 15;
        newGlyphs.push({
          xPosition: xPos,
          yPosition: noteData.yCoordinateMin,
          glyph: note.endsWith('#') ? 'accidentalSharp' : 'accidentalFlat'
        });
      }
    });

    updatedGlyphs = newGlyphs;
    setGlyphState(updatedGlyphs);
    setKeySigState(updatedKeySig);
    
    notesAndCoordinates = removeAccidentalFromNotesAndCoords(
      notesAndCoordinates,
      foundNoteData
    );
  }

  return {
    notesAndCoordinates,
    updatedGlyphs,
    updatedKeySig,
  };
};
