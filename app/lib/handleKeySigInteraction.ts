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
  // console.log("handleKeySigInteraction called with state:", {
  //   isSharpActive: state.isSharpActive,
  //   isFlatActive: state.isFlatActive,
  //   isEraseAccidentalActive: state.isEraseAccidentalActive
  // });
  // console.log("Current keySig:", keySig);

  if (state.isSharpActive || state.isFlatActive) {
    // console.log("Adding accidental to note:", foundNoteData.note);
    notesAndCoordinates = updateNotesAndCoordsWithAccidental(
      state,
      foundNoteData,
      notesAndCoordinates
    );

    // console.log("Attempting to add glyph");
    const glyphAdded = addGlyphs(
      xClick,
      yClick,
      state,
      glyphState,
      setGlyphState
    );
    // console.log("Glyph added:", glyphAdded);

    // Only update the key signature array if a glyph was successfully added
    if (glyphAdded) {
      // console.log("Updating key signature array with note:", foundNoteData.note);
      updateKeySigArrayForGrading(foundNoteData, state, setKeySigState);
    } else {
      console.log("Not updating key signature array since glyph was not added");
    }
  } else if (state.isEraseAccidentalActive) {
    // console.log("Attempting to erase accidental");
    const glyphWasDeleted = deleteGlyphFromStave(
      setGlyphState,
      glyphState,
      xClick,
      yClick
    );
    // console.log("Glyph was deleted:", glyphWasDeleted);

    if (glyphWasDeleted) {
      // console.log("Deleting accidental from key signature array");
      deleteAccidentalFromKeySigArray(foundNoteData, keySig, setKeySigState);
      notesAndCoordinates = removeAccidentalFromNotesAndCoords(
        notesAndCoordinates,
        foundNoteData
      );
    }
  }

  // console.log("Returning updated notesAndCoordinates");
  return {
    notesAndCoordinates,
  };
};
