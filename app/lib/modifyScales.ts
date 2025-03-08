import VexFlow from "vexflow";
import { indexOfNoteToModify as indexOfNote } from "./indexOfNoteToModify";
import {
  appendAccidentalToNote,
  getAccidentalType,
  parseNote,
  removeAccidentals,
} from "./modifyNotesAndCoordinates";
import {
  ModifyScaleData,
  NotesAndCoordinatesData,
  ScaleData,
  StateInteraction,
  StaveNoteType,
} from "./typesAndInterfaces";

const { Accidental, StaveNote } = VexFlow.Flow;

export const createStaveNoteFromScaleData = (
  noteObject: ScaleData,
  chosenClef: string,
  updatedKeys?: string[]
) => {
  const newStaveNote = new StaveNote({
    keys: updatedKeys ? updatedKeys : noteObject.keys,
    duration: "q",
    clef: chosenClef,
  });

  return newStaveNote;
};

export const getNoteData = (
  barOfScaleData: ScaleData[],
  userClickX: number
): ModifyScaleData => {
  const noteIndex = indexOfNote(barOfScaleData, userClickX);
  return { noteDataObject: barOfScaleData[noteIndex], noteIndex };
};

export const addAccidentalsToStaveNotes = (
  keys: string[],
  newStaveNote: StaveNoteType
) => {
  keys.forEach((key) => {
    const { noteBase } = parseNote(key);
    const accidentalType = getAccidentalType(noteBase);

    if (accidentalType) {
      newStaveNote.addModifier(new Accidental(accidentalType));
    }
  });
};

export const reconstructScale = (
  noteObject: ScaleData,
  foundNoteData: NotesAndCoordinatesData,
  chosenClef: string
) => {
  const newStaveNote = createStaveNoteFromScaleData(noteObject, chosenClef);
  addAccidentalsToStaveNotes([foundNoteData.note], newStaveNote);
  const newScale = {
    ...noteObject,
    staveNote: newStaveNote,
  };
  return newScale;
};

export const addAccidentalToStaveNoteAndKeys = (
  noteInteractionState: StateInteraction,
  scaleData: ScaleData[],
  userClickX: number,
  chosenClef: string
) => {
  let { noteDataObject, noteIndex } = getNoteData(scaleData, userClickX);
  const accidental = noteInteractionState.isSharpActive ? "#" : "b";
  noteDataObject.keys[0] = appendAccidentalToNote(
    accidental,
    noteDataObject.keys[0]
  );
  const newStaveNote = createStaveNoteFromScaleData(noteDataObject, chosenClef);
  addAccidentalsToStaveNotes(noteDataObject.keys, newStaveNote);
  const updatedNoteObject = {
    ...noteDataObject,
    staveNote: newStaveNote,
    keys: noteDataObject.keys,
  };
  return { updatedNoteObject, noteIndex };
};

export const removeAccidentalFromStaveNote = (
  scaleData: ScaleData[],
  userClickX: number,
  chosenClef: string
) => {
  const { noteDataObject, noteIndex } = getNoteData(scaleData, userClickX);

  let { keys } = noteDataObject;

  const updatedNoteObject = {
    ...noteDataObject,
    keys: [removeAccidentals(keys[0])],
    staveNote: createStaveNoteFromScaleData(noteDataObject, chosenClef),
  };
  return { updatedNoteObject, noteIndex };
};

export const addNewNoteToScale = (
  scaleData: ScaleData[],
  foundNoteData: NotesAndCoordinatesData,
  userClickX: number,
  userClickY: number,
  chosenClef: string
) => {
  let { noteDataObject } = getNoteData(scaleData, userClickX);
  const newNote = createStaveNoteFromScaleData(noteDataObject, chosenClef, [
    foundNoteData.note,
  ]);
  addAccidentalsToStaveNotes(noteDataObject.keys, newNote);
  const newNoteObject = {
    keys: [foundNoteData.note],
    duration: "q",
    staveNote: newNote,
    exactX: userClickX,
    userClickY,
  };
  return newNoteObject;
};

export const changeNotePosition = (
  scaleData: ScaleData[],
  userClickX: number,
  foundNoteData: NotesAndCoordinatesData,
  userClickY: number,
  chosenClef: string
) => {
  const { noteDataObject, noteIndex } = getNoteData(scaleData, userClickX);
  if (noteDataObject && noteDataObject.staveNote) {
    const exactX = noteDataObject.staveNote.getAbsoluteX();

    scaleData.splice(noteIndex, 1, {
      staveNote: new StaveNote({
        keys: [foundNoteData.note],
        duration: "q",
        clef: chosenClef,
      }),
      keys: [foundNoteData.note],
      duration: "q",
      exactX,
      userClickY,
    });
  }
};

export const removeNoteFromScale = (
  scaleData: ScaleData[],
  userClickX: number
) => {
  const { noteIndex } = getNoteData(scaleData, userClickX);
  //!= checks for both null and undefined
  if (noteIndex != null) {
    scaleData.splice(noteIndex, 1);
  }
};
