import {
  addAccidentalToChordKeys,
  addNewNoteToChord,
  removeAccidentalFromNotesAndCoords,
  reconstructChord,
  removeAccidentalFromChord,
  removeNoteFromChord,
  updateNoteWithAccidental,
} from "@/app/lib/modifyChords";
import { Chord, StateInteraction, NotesAndCoordinatesData } from "./types";

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
      updatedChordData = reconstructChord(chordData, chosenClef);
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
      updatedChordData = reconstructChord(chordData, chosenClef);
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
