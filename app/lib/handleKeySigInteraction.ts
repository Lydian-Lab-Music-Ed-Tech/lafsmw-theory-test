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

// Correct order of accidentals in key signatures with their proper positions in the staff notation
const SHARP_ORDER = ["F#", "C#", "G#", "D#", "A#", "E#", "B#"];
const FLAT_ORDER = ["Bb", "Eb", "Ab", "Db", "Gb", "Cb", "Fb"];

// Map accidentals to their correct octave notation in keySigArray
// This ensures correct staff positioning following musical conventions
const ACCIDENTAL_TO_NOTE_MAP = {
  // Sharps
  "F#": "f/5", // 5th line (treble)
  "C#": "c/5", // 3rd space
  "G#": "g/5", // 2nd line
  "D#": "d/5", // 4th line
  "A#": "a/4", // 3rd line
  "E#": "e/5", // 4th space
  "B#": "b/4", // Top space

  // Flats
  "Bb": "b/4", // 3rd line
  "Eb": "e/5", // 3rd space  
  "Ab": "a/4", // 2nd space
  "Db": "d/5", // 4th space
  "Gb": "g/4", // 2nd line (lower G, not g/5)
  "Cb": "c/5", // 3rd line
  "Fb": "f/4"  // Bottom space
};

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

export const handleKeySigInteraction = (
  notesAndCoordinates: NotesAndCoordinatesData[],
  buttonState: ButtonStates,
  foundNoteData: NotesAndCoordinatesData,
  yClick: number,
  setGlyphState: (newState: React.SetStateAction<GlyphProps[]>) => void,
  glyphState: GlyphProps[],
  setKeySigState: (newState: React.SetStateAction<string[]>) => void,
  keySig: string[],
  stave: StaveType // Add stave parameter to calculate quantized positions
) => {
  // Create a copy of the current glyphState that we'll modify and return
  let updatedGlyphs = [...glyphState];

  let currentKeySig = [...keySig];
  let currentGlyphs = [...glyphState];

  if (buttonState.isSharpActive || buttonState.isFlatActive) {
    const noteBase = foundNoteData.note.charAt(0).toUpperCase();
    const accidentalSymbol = buttonState.isSharpActive ? "#" : "b";
    const noteWithAccidental = `${noteBase}${accidentalSymbol}`;
    const orderArray = buttonState.isSharpActive ? SHARP_ORDER : FLAT_ORDER;

    // Update keySig: remove if same base note exists, add new, then sort
    currentKeySig = currentKeySig.filter(
      (n) => n.charAt(0).toUpperCase() !== noteBase
    );
    currentKeySig.push(noteWithAccidental);
    currentKeySig.sort((a, b) => {
      const aOrderIndex = orderArray.findIndex((orderedNote) =>
        orderedNote.toUpperCase().startsWith(a.charAt(0).toUpperCase())
      );
      const bOrderIndex = orderArray.findIndex((orderedNote) =>
        orderedNote.toUpperCase().startsWith(b.charAt(0).toUpperCase())
      );
      return aOrderIndex - bOrderIndex;
    });

    // Rebuild glyphs based on sorted keySig
    currentGlyphs = [];
    for (const sigNote of currentKeySig) {
      const glyphType = sigNote.includes("#")
        ? "accidentalSharp"
        : "accidentalFlat";
      // Find Y position for this specific note using the precise note-to-position mapping
      // Use type safety by checking if sigNote exists in the mapping
      const noteFullKey = Object.prototype.hasOwnProperty.call(ACCIDENTAL_TO_NOTE_MAP, sigNote)
        ? ACCIDENTAL_TO_NOTE_MAP[sigNote as keyof typeof ACCIDENTAL_TO_NOTE_MAP]
        : sigNote; // Fallback to the original note if not found in the map
      
      const noteInfo = notesAndCoordinates.find((nc) =>
        nc.originalNote.toLowerCase() === noteFullKey.toLowerCase()
      );
      const yPos = noteInfo?.userClickY !== undefined ? noteInfo.userClickY : yClick; // Fallback to original click Y if specific note Y not found

      currentGlyphs.push({
        xPosition: getQuantizedXPosition(stave, currentGlyphs),
        yPosition: yPos,
        glyph: glyphType,
      });
    }

    notesAndCoordinates = updateNotesAndCoordsWithAccidental(
      buttonState,
      foundNoteData, // This is the clicked note data
      notesAndCoordinates
    );
  } else if (buttonState.isEraseAccidentalActive) {
    const noteBaseToErase = foundNoteData.note.charAt(0).toUpperCase();

    // Update keySig: filter out the erased note
    currentKeySig = currentKeySig.filter(
      (n) => n.charAt(0).toUpperCase() !== noteBaseToErase
    );
    // KeySig remains sorted as removal preserves relative order

    // Rebuild glyphs based on the modified keySig
    currentGlyphs = [];
    const orderArray = currentKeySig.some(n => n.includes('#')) ? SHARP_ORDER : FLAT_ORDER; // Determine order for sorting if needed, though not strictly for erase
    
    // Ensure currentKeySig is sorted before rebuilding glyphs (it should be, but as a safeguard)
    currentKeySig.sort((a, b) => {
      const aOrderIndex = orderArray.findIndex((orderedNote) =>
        orderedNote.toUpperCase().startsWith(a.charAt(0).toUpperCase())
      );
      const bOrderIndex = orderArray.findIndex((orderedNote) =>
        orderedNote.toUpperCase().startsWith(b.charAt(0).toUpperCase())
      );
      return aOrderIndex - bOrderIndex;
    });

    for (const sigNote of currentKeySig) {
      const glyphType = sigNote.includes("#")
        ? "accidentalSharp"
        : "accidentalFlat";
      const noteInfo = notesAndCoordinates.find((nc) =>
        nc.originalNote.toUpperCase().startsWith(sigNote.charAt(0).toUpperCase())
      );
      const yPos = noteInfo?.userClickY !== undefined ? noteInfo.userClickY : yClick;

      currentGlyphs.push({
        xPosition: getQuantizedXPosition(stave, currentGlyphs),
        yPosition: yPos,
        glyph: glyphType,
      });
    }

    notesAndCoordinates = removeAccidentalFromNotesAndCoords(
      notesAndCoordinates,
      foundNoteData
    );
  }

  setGlyphState(currentGlyphs);
  setKeySigState(currentKeySig);

  // The return object uses the latest state
  return {
    notesAndCoordinates,
    updatedGlyphs: currentGlyphs, // Return the rebuilt glyphs
    updatedKeySig: currentKeySig, // Return the sorted and updated key signature
  };
};
