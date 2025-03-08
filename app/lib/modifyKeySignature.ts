import { parseNote } from "./modifyNotesAndCoordinates";
import { roundToNearest5 } from "./roundToNearest5";
import {
  GlyphProps,
  NotesAndCoordinatesData,
  StateInteraction,
} from "./typesAndInterfaces";

const tolerance = 5;

export const deleteGlyphFromStave = (
  setGlyphState: (newState: React.SetStateAction<GlyphProps[]>) => void,
  glyphState: GlyphProps[],
  xClick: number,
  yClick: number
) => {
  const newState = glyphState.filter(
    (glyph) =>
      !(
        Math.abs(glyph.xPosition + 5 - xClick) <= tolerance &&
        Math.abs(glyph.yPosition - yClick) <= tolerance
      )
  );
  setGlyphState(newState);
  //this line returns true if any glyphs were deleted or false if no glyphs were deleted
  return newState.length < glyphState.length;
};

export const addGlyphs = (
  userClickX: number,
  userClickY: number,
  keySigState: StateInteraction,
  glyphs: GlyphProps[],
  setGlyphState: (newState: React.SetStateAction<GlyphProps[]>) => void
) => {
  const newState = {
    xPosition: roundToNearest5(userClickX),
    yPosition: roundToNearest5(userClickY),
    glyph: keySigState.isSharpActive
      ? "accidentalSharp"
      : keySigState.isFlatActive
        ? "accidentalFlat"
        : "",
  };

  // Check if there's already a glyph at this y-position
  const existingGlyphIndex = glyphs.findIndex(
    (glyph) => glyph.yPosition === newState.yPosition
  );

  if (existingGlyphIndex !== -1) {
    console.log("Glyph already exists at this position, not adding");
    return false;
  }

  console.log("Adding new glyph:", newState);
  setGlyphState((prevState) => {
    // Double-check that the glyph doesn't already exist in the state
    // This handles race conditions where the state might have been updated but not yet reflected in glyphs
    if (prevState.some((glyph) => glyph.yPosition === newState.yPosition)) {
      console.log("Glyph already exists in state, not adding");
      return prevState;
    }

    const updatedState = [...prevState, newState];
    return updatedState;
  });

  return true;
};

export const updateKeySigArrayForGrading = (
  foundNoteData: NotesAndCoordinatesData,
  keySigState: StateInteraction,
  setKeySigState: (newState: React.SetStateAction<string[]>) => void
) => {
  const noteBase = parseNote(foundNoteData.note).noteBase;

  if (noteBase.length > 1) {
    console.log("Note base length > 1, returning early:", noteBase);
    return;
  }

  const noteWithAccidental = keySigState.isSharpActive
    ? `${noteBase}` + "#"
    : `${noteBase}` + "b";

  // Use a callback function to ensure we're working with the latest state
  setKeySigState((prevState) => {
    // Check if this note (with this accidental) is already in the key signature
    if (prevState.includes(noteWithAccidental)) {
      console.log("Note already in key sig, not adding:", noteWithAccidental);
      return prevState;
    }

    // Check if this note (with a different accidental) is already in the key signature
    const baseNoteExists = prevState.some(
      (note) =>
        note.charAt(0) === noteBase.charAt(0) && note !== noteWithAccidental
    );

    if (baseNoteExists) {
      // Remove the existing note with a different accidental
      const filteredState = prevState.filter(
        (note) => note.charAt(0) !== noteBase.charAt(0)
      );
      // Add the new note with the current accidental
      const newState = [...filteredState, noteWithAccidental];
      return newState;
    }

    // Add the new note to the key signature
    const newState = [...prevState, noteWithAccidental];
    return newState;
  });
};

export const deleteAccidentalFromKeySigArray = (
  foundNoteData: NotesAndCoordinatesData,
  keySigArray: string[],
  setKeySigState: (newState: React.SetStateAction<string[]>) => void
) => {
  // Extract the note base and determine if it has an accidental
  const { noteBase } = parseNote(foundNoteData.note);

  // Use a callback function to ensure we're working with the latest state
  setKeySigState((prevState) => {
    // Find notes in the key signature that match the base note (with any accidental)
    const matchingNotes = prevState.filter(
      (note) => note.charAt(0) === noteBase.charAt(0)
    );

    if (matchingNotes.length > 0) {
      // Remove the matching notes from the array
      const newState = prevState.filter(
        (note) => !matchingNotes.includes(note)
      );
      return newState;
    }

    // If no matching notes were found, return the original state
    return prevState;
  });
};
