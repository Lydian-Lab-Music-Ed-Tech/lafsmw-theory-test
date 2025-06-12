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

  if (buttonState.isSharpActive || buttonState.isFlatActive) {
    notesAndCoordinates = updateNotesAndCoordsWithAccidental(
      buttonState,
      foundNoteData,
      notesAndCoordinates
    );

    const noteBase = foundNoteData.note.charAt(0);

    const quantizedX = getQuantizedXPosition(
      stave,
      glyphState // Pass existing glyphs to determine the next position
    );

    const newGlyph: GlyphProps = {
      xPosition: quantizedX,
      yPosition: yClick, // Keep the y-position as is - based on where the user clicked
      glyph: buttonState.isSharpActive ? "accidentalSharp" : "accidentalFlat",
    };

    updatedGlyphs.push(newGlyph);

    // Update the state with our new glyphs
    setGlyphState(updatedGlyphs);

    const accidental = buttonState.isSharpActive ? "#" : "b";
    const noteWithAccidental = `${noteBase}${accidental}`;

    // Update the key signature array with the new note
    // Create a new array with the updated key signature to ensure immediate update
    const updatedKeySig = keySig.filter((note) => note.charAt(0) !== noteBase);
    updatedKeySig.push(noteWithAccidental);

    // Set the state with the new array
    setKeySigState(updatedKeySig);
  } else if (buttonState.isEraseAccidentalActive) {
    // Get the note being erased (using foundNoteData which already has the note)

    // Find the accidental type (sharp or flat) from the existing key signature
    const accidentalType = keySig
      .find((note) => note.charAt(0) === foundNoteData.note.charAt(0))
      ?.includes("#")
      ? "accidentalSharp"
      : "accidentalFlat";

    // Remove the glyph associated with this note
    updatedGlyphs = updatedGlyphs.filter((glyph) => {
      // Instead of checking click distance, check if this glyph matches the note being erased
      // We need to find glyphs that are roughly on the same vertical position AND are of the right type
      const isRightAccidentalType = glyph.glyph === accidentalType;
      const isNearSameVerticalPosition =
        Math.abs(glyph.yPosition - yClick) < 20;

      // Keep all glyphs except the one we want to erase
      return !(isRightAccidentalType && isNearSameVerticalPosition);
    });

    setGlyphState(updatedGlyphs);

    // Update other state values
    // Create a new array with the note removed to ensure immediate update
    const updatedKeySig = keySig.filter(
      (note) => note.charAt(0) !== foundNoteData.note.charAt(0)
    );

    setKeySigState(updatedKeySig);

    notesAndCoordinates = removeAccidentalFromNotesAndCoords(
      notesAndCoordinates,
      foundNoteData
    );
  }

  return {
    notesAndCoordinates,
    updatedGlyphs,
  };
};
