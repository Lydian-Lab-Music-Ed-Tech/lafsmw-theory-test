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

    // Find the closest glyph to the click position
    let closestGlyphIndex = -1;
    let minDistance = Number.MAX_VALUE;
    
    updatedGlyphs.forEach((glyph, index) => {
      const isRightAccidentalType = glyph.glyph === accidentalType;
      const isNearSameVerticalPosition = Math.abs(glyph.yPosition - yClick) < 20;
      
      if (isRightAccidentalType && isNearSameVerticalPosition) {
        const distance = Math.abs(glyph.yPosition - yClick);
        if (distance < minDistance) {
          minDistance = distance;
          closestGlyphIndex = index;
        }
      }
    });

    // Only remove the closest glyph if found
    if (closestGlyphIndex !== -1) {
      updatedGlyphs.splice(closestGlyphIndex, 1);
      setGlyphState(updatedGlyphs);
      
      // Only remove the note from keySig if there are no more glyphs of this type and vertical position
      const remainingGlyphsOfSameNote = updatedGlyphs.filter(glyph => {
        const isRightAccidentalType = glyph.glyph === accidentalType;
        const isNearSameVerticalPosition = Math.abs(glyph.yPosition - yClick) < 20;
        return isRightAccidentalType && isNearSameVerticalPosition;
      });
      
      if (remainingGlyphsOfSameNote.length === 0) {
        // Only remove from keySig if no more glyphs of this note remain
        const updatedKeySig = keySig.filter(
          (note) => note.charAt(0) !== foundNoteData.note.charAt(0)
        );
        setKeySigState(updatedKeySig);
        
        notesAndCoordinates = removeAccidentalFromNotesAndCoords(
          notesAndCoordinates,
          foundNoteData
        );
      }
    }
  }

  return {
    notesAndCoordinates,
    updatedGlyphs,
  };
};
