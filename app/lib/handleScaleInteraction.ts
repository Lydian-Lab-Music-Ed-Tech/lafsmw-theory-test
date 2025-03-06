import VexFlow from "vexflow";

import {
  removeAccidentalFromNotesAndCoords,
  updateNotesAndCoordsWithAccidental,
} from "./modifyNotesAndCoordinates";
import {
  addAccidentalToStaveNoteAndKeys,
  changeNotePosition,
  removeAccidentalFromStaveNote,
  removeNoteFromScale,
} from "./modifyScales";
import {
  StateInteraction,
  NotesAndCoordinatesData,
  ScaleData,
  StaveNoteType,
  errorMessages,
} from "./typesAndInterfaces";
const { StaveNote } = VexFlow.Flow;

export const HandleScaleInteraction = (
  foundNoteData: NotesAndCoordinatesData,
  notesAndCoordinates: NotesAndCoordinatesData[],
  barOfScaleData: ScaleData[],
  scaleDataMatrix: ScaleData[][],
  scaleInteractionState: StateInteraction,
  userClickX: number,
  userClickY: number,
  barIndex: number,
  chosenClef: string,
  setMessage: (newState: React.SetStateAction<string>) => void,
  setOpen: (newState: React.SetStateAction<boolean>) => void,
  errorMessages: errorMessages
) => {
  const scaleLength = scaleDataMatrix[0].length;
  if (
    scaleInteractionState.isSharpActive ||
    scaleInteractionState.isFlatActive
  ) {
    notesAndCoordinates = updateNotesAndCoordsWithAccidental(
      scaleInteractionState,
      foundNoteData,
      notesAndCoordinates
    );
    const { updatedNoteObject, noteIndex } = addAccidentalToStaveNoteAndKeys(
      scaleInteractionState,
      barOfScaleData,
      userClickX,
      chosenClef
    );
    barOfScaleData[noteIndex] = updatedNoteObject;
    scaleDataMatrix[barIndex] = barOfScaleData;
  } else if (scaleInteractionState.isEraseAccidentalActive) {
    notesAndCoordinates = removeAccidentalFromNotesAndCoords(
      notesAndCoordinates,
      foundNoteData
    );
    const { updatedNoteObject, noteIndex } = removeAccidentalFromStaveNote(
      barOfScaleData,
      userClickX,
      chosenClef
    );
    barOfScaleData[noteIndex] = updatedNoteObject;
    scaleDataMatrix[barIndex] = barOfScaleData;
  } else if (scaleInteractionState.isEraseNoteActive) {
    notesAndCoordinates = removeAccidentalFromNotesAndCoords(
      notesAndCoordinates,
      foundNoteData
    );
    removeNoteFromScale(barOfScaleData, userClickX);
    scaleDataMatrix[barIndex] = barOfScaleData;
  } else if (scaleInteractionState.isChangeNoteActive) {
    notesAndCoordinates = removeAccidentalFromNotesAndCoords(
      notesAndCoordinates,
      foundNoteData
    );
    changeNotePosition(
      barOfScaleData,
      userClickX,
      foundNoteData,
      userClickY,
      chosenClef
    );
    scaleDataMatrix[barIndex] = barOfScaleData;
  } else if (scaleLength >= 7) {
    setOpen(true);
    setMessage(errorMessages.tooManyNotesInMeasure);
  } else {
    const newStaveNote: StaveNoteType = new StaveNote({
      keys: [foundNoteData.note],
      duration: "q",
      clef: chosenClef,
    });

    // Store the exact click position with the note
    let newNoteObject = [
      ...barOfScaleData,
      {
        keys: [foundNoteData.note],
        duration: "q",
        staveNote: newStaveNote,
        exactX: userClickX, // Use exactX for positioning
        userClickY,
      },
    ];

    scaleDataMatrix[barIndex] = newNoteObject;
  }
  return {
    scaleDataMatrix,
    notesAndCoordinates,
  };
};
