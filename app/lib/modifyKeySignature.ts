import { parseNote } from "./modifyNotesAndCoordinates";
import {
  StateInteraction,
  GlyphProps,
  NotesAndCoordinatesData,
} from "./typesAndInterfaces";
import { roundToNearest5 } from "./roundToNearest5";

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
  for (const glyph of glyphs) {
    if (glyph.yPosition === newState.yPosition) return;
  }
  setGlyphState((prevState: GlyphProps[]) => [...prevState, newState]);
};

export const updateKeySigArrayForGrading = (
  foundNoteData: NotesAndCoordinatesData,
  keySigState: StateInteraction,
  setKeySigState: (newState: React.SetStateAction<string[]>) => void
) => {
  const noteBase = parseNote(foundNoteData.note).noteBase;
  if (noteBase.length > 1) {
    return;
  }
  const noteWithAccidental = keySigState.isSharpActive
    ? `${noteBase}` + "#"
    : `${noteBase}` + "b";
  setKeySigState((prevState: string[]) => {
    const newKeySig = [...prevState];
    if (!newKeySig.includes(noteWithAccidental)) {
      newKeySig.push(noteWithAccidental);
    }
    return newKeySig;
  });
};

export const deleteAccidentalFromKeySigArray = (
  foundNoteData: NotesAndCoordinatesData,
  keySigArray: string[],
  setKeySigState: (newState: React.SetStateAction<string[]>) => void
) => {
  // console.log("foundNoteData: ", foundNoteData.note);
  const noteBase = parseNote(foundNoteData.note).noteBase;
  const newKeySig = [...keySigArray];
  if (newKeySig.includes(noteBase)) {
    const index = newKeySig.findIndex((note) => note === noteBase);
    newKeySig.splice(index, 1);
  }
  setKeySigState(() => newKeySig);
};
