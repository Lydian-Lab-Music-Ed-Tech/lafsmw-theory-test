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
  
  console.log("Attempting to add glyph at position:", newState.yPosition);
  console.log("Current glyphs:", glyphs.map(g => ({ y: g.yPosition, glyph: g.glyph })));
  
  // Check if there's already a glyph at this y-position
  const existingGlyphIndex = glyphs.findIndex(glyph => glyph.yPosition === newState.yPosition);
  
  if (existingGlyphIndex !== -1) {
    console.log("Glyph already exists at this position, not adding");
    return false;
  }
  
  console.log("Adding new glyph:", newState);
  setGlyphState(prevState => {
    // Double-check that the glyph doesn't already exist in the state
    // This handles race conditions where the state might have been updated but not yet reflected in glyphs
    if (prevState.some(glyph => glyph.yPosition === newState.yPosition)) {
      console.log("Glyph already exists in state, not adding");
      return prevState;
    }
    
    const updatedState = [...prevState, newState];
    console.log("Updated glyph state:", updatedState.map(g => ({ y: g.yPosition, glyph: g.glyph })));
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
  console.log("updateKeySigArrayForGrading called with note:", foundNoteData.note, "parsed base:", noteBase);
  
  if (noteBase.length > 1) {
    console.log("Note base length > 1, returning early:", noteBase);
    return;
  }
  
  const noteWithAccidental = keySigState.isSharpActive
    ? `${noteBase}` + "#"
    : `${noteBase}` + "b";
  
  console.log("Adding to key sig:", noteWithAccidental);
  
  // Use a callback function to ensure we're working with the latest state
  setKeySigState(prevState => {
    console.log("Previous key sig state:", prevState);
    
    // Check if this note (with this accidental) is already in the key signature
    if (prevState.includes(noteWithAccidental)) {
      console.log("Note already in key sig, not adding:", noteWithAccidental);
      return prevState;
    }
    
    // Check if this note (with a different accidental) is already in the key signature
    const baseNoteExists = prevState.some(note => 
      note.charAt(0) === noteBase.charAt(0) && note !== noteWithAccidental
    );
    
    if (baseNoteExists) {
      console.log("Note with different accidental exists, replacing");
      // Remove the existing note with a different accidental
      const filteredState = prevState.filter(note => 
        note.charAt(0) !== noteBase.charAt(0)
      );
      // Add the new note with the current accidental
      const newState = [...filteredState, noteWithAccidental];
      console.log("New key sig state after replacement:", newState);
      return newState;
    }
    
    // Add the new note to the key signature
    const newState = [...prevState, noteWithAccidental];
    console.log("New key sig state after addition:", newState);
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
  console.log("deleteAccidentalFromKeySigArray called with note:", foundNoteData.note, "parsed base:", noteBase);
  
  // Use a callback function to ensure we're working with the latest state
  setKeySigState(prevState => {
    console.log("Previous key sig state before deletion:", prevState);
    
    // Find notes in the key signature that match the base note (with any accidental)
    const matchingNotes = prevState.filter(note => 
      note.charAt(0) === noteBase.charAt(0)
    );
    
    console.log("Matching notes to delete:", matchingNotes);
    
    if (matchingNotes.length > 0) {
      // Remove the matching notes from the array
      const newState = prevState.filter(note => !matchingNotes.includes(note));
      console.log("New key sig state after deletion:", newState);
      return newState;
    }
    
    // If no matching notes were found, return the original state
    console.log("No matching notes found, not changing state");
    return prevState;
  });
};
