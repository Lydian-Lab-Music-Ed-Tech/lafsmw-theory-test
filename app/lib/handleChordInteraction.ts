import {
  addAccidentalToChordKeys,
  addNewNoteToChord,
  reconstructChord,
  removeAccidentalFromChord,
  removeAccidentalFromNotesAndCoords,
  removeNoteFromChord,
  updateNoteWithAccidental,
} from "@/app/lib/modifyChords";
import { Chord, NotesAndCoordinatesData, StateInteraction } from "./types";

// Helper function to normalize notes for comparison (e.g., C/4, C#/4)
const normalizeNoteForComparison = (note: string): string => {
  // Extract the base note without accidentals
  const parts = note.split("/");
  if (parts.length !== 2) return note; // Invalid format

  // Get the note letter (A-G) without accidentals
  const noteLetter = parts[0].charAt(0);
  const octave = parts[1];

  // Return just the letter and octave for comparison
  return `${noteLetter}/${octave}`;
};

export const handleChordInteraction = (
  notesAndCoordinates: NotesAndCoordinatesData[],
  chordInteractionState: StateInteraction,
  foundNoteData: NotesAndCoordinatesData,
  chordData: Chord,
  foundNoteIndex: number,
  chosenClef: string
) => {
  let updatedChordData = { ...chordData };
  let updatedNotesAndCoordinates = [...notesAndCoordinates];

  // If foundNoteIndex is -1 but we're modifying accidentals, try to find the note by normalizing
  if (
    foundNoteIndex === -1 &&
    (chordInteractionState.isSharpActive ||
      chordInteractionState.isFlatActive ||
      chordInteractionState.isEraseAccidentalActive)
  ) {
    // Try to find the note by just comparing the note letter and octave
    const normalizedFoundNote = normalizeNoteForComparison(foundNoteData.note);
    foundNoteIndex = chordData.keys.findIndex(
      (note) => normalizeNoteForComparison(note) === normalizedFoundNote
    );
  }

  if (
    chordInteractionState.isSharpActive ||
    chordInteractionState.isFlatActive
  ) {
    if (foundNoteIndex !== -1) {
      updatedNotesAndCoordinates = updateNoteWithAccidental(
        chordInteractionState,
        foundNoteData,
        notesAndCoordinates
      );
      updatedChordData = addAccidentalToChordKeys(
        chordInteractionState,
        chordData,
        foundNoteIndex,
        chosenClef
      );
    }
  } else if (chordInteractionState.isEraseAccidentalActive) {
    if (foundNoteIndex !== -1) {
      updatedNotesAndCoordinates = removeAccidentalFromNotesAndCoords(
        notesAndCoordinates,
        foundNoteData
      );
      updatedChordData = removeAccidentalFromChord(
        chordData,
        foundNoteIndex,
        chosenClef
      );
      updatedChordData = reconstructChord(updatedChordData, chosenClef);
    }
  } else if (chordInteractionState.isEraseNoteActive) {
    if (foundNoteIndex !== -1) {
      updatedChordData = removeNoteFromChord(
        chordData,
        foundNoteIndex,
        chosenClef
      );
      updatedNotesAndCoordinates = removeAccidentalFromNotesAndCoords(
        notesAndCoordinates,
        foundNoteData
      );
      updatedChordData = reconstructChord(updatedChordData, chosenClef);
    }
  } else {
    if (updatedChordData.keys.length >= 4)
      return { chordData, notesAndCoordinates };

    updatedChordData = addNewNoteToChord(chordData, foundNoteData, chosenClef);
  }
  return {
    chordData: updatedChordData,
    notesAndCoordinates: updatedNotesAndCoordinates,
  };
};
