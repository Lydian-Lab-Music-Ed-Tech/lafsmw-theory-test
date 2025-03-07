import {
  removeAccidentalFromNotesAndCoords,
  updateNotesAndCoordsWithAccidental,
} from "../lib/modifyNotesAndCoordinates";
import {
  addGlyphs,
  deleteAccidentalFromKeySigArray,
  deleteGlyphFromStave,
  updateKeySigArrayForGrading,
} from "./modifyKeySignature";
import {
  GlyphProps,
  StateInteraction,
  NotesAndCoordinatesData,
} from "./typesAndInterfaces";

export const handleKeySigInteraction = (
  notesAndCoordinates: NotesAndCoordinatesData[],
  state: StateInteraction,
  foundNoteData: NotesAndCoordinatesData,
  xClick: number,
  yClick: number,
  setGlyphState: (newState: React.SetStateAction<GlyphProps[]>) => void,
  glyphState: GlyphProps[],
  setKeySigState: (newState: React.SetStateAction<string[]>) => void,
  keySig: string[]
) => {
  if (state.isSharpActive || state.isFlatActive) {
    notesAndCoordinates = updateNotesAndCoordsWithAccidental(
      state,
      foundNoteData,
      notesAndCoordinates
    );

    const glyphAdded = addGlyphs(
      xClick,
      yClick,
      state,
      glyphState,
      setGlyphState
    );

    // Only update the key signature array if a glyph was successfully added
    if (glyphAdded) {
      updateKeySigArrayForGrading(foundNoteData, state, setKeySigState);
    } else {
      console.log("Not updating key signature array since glyph was not added");
    }
  } else if (state.isEraseAccidentalActive) {
    const glyphWasDeleted = deleteGlyphFromStave(
      setGlyphState,
      glyphState,
      xClick,
      yClick
    );

    if (glyphWasDeleted) {
      deleteAccidentalFromKeySigArray(foundNoteData, keySig, setKeySigState);
      notesAndCoordinates = removeAccidentalFromNotesAndCoords(
        notesAndCoordinates,
        foundNoteData
      );
    }
  }

  return {
    notesAndCoordinates,
  };
};
