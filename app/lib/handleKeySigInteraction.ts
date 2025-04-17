import {
  removeAccidentalFromNotesAndCoords,
  updateNotesAndCoordsWithAccidental,
} from "../lib/modifyNotesAndCoordinates";
import {
  deleteAccidentalFromKeySigArray,
  updateKeySigArrayForGrading,
} from "./modifyKeySignature";
import { ButtonStates, GlyphProps, NotesAndCoordinatesData } from "./types";

export const handleKeySigInteraction = (
  notesAndCoordinates: NotesAndCoordinatesData[],
  buttonState: ButtonStates,
  foundNoteData: NotesAndCoordinatesData,
  xClick: number,
  yClick: number,
  setGlyphState: (newState: React.SetStateAction<GlyphProps[]>) => void,
  glyphState: GlyphProps[],
  setKeySigState: (newState: React.SetStateAction<string[]>) => void,
  keySig: string[]
) => {
  // Create a copy of the current glyphState that we'll modify and return
  let updatedGlyphs = [...glyphState];

  if (buttonState.isSharpActive || buttonState.isFlatActive) {
    notesAndCoordinates = updateNotesAndCoordsWithAccidental(
      buttonState,
      foundNoteData,
      notesAndCoordinates
    );

    // Add the new glyph
    if (buttonState.isSharpActive) {
      const newGlyph: GlyphProps = {
        xPosition: xClick - 5,
        yPosition: yClick,
        glyph: "accidentalSharp",
      };
      updatedGlyphs.push(newGlyph);
    } else if (buttonState.isFlatActive) {
      const newGlyph: GlyphProps = {
        xPosition: xClick - 5,
        yPosition: yClick,
        glyph: "accidentalFlat",
      };
      updatedGlyphs.push(newGlyph);
    }

    // Update the state with our new glyphs
    setGlyphState(updatedGlyphs);

    // Only update the key signature array if we added a glyph
    updateKeySigArrayForGrading(foundNoteData, buttonState, setKeySigState);
  } else if (buttonState.isEraseAccidentalActive) {
    // Remove the glyph at the click position
    updatedGlyphs = updatedGlyphs.filter((glyph) => {
      const distance = Math.sqrt(
        Math.pow(glyph.xPosition - xClick, 2) +
          Math.pow(glyph.yPosition - yClick, 2)
      );
      return distance > 20; // Filter out glyphs within 20px radius of click
    });

    setGlyphState(updatedGlyphs);

    // Update other state values
    deleteAccidentalFromKeySigArray(foundNoteData, keySig, setKeySigState);
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
