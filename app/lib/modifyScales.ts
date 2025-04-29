import { Flow } from "vexflow";
import { indexOfNoteToModify as indexOfNote } from "./indexOfNoteToModify";
import {
  getAccidentalType,
  parseNote,
  removeAccidentals,
} from "./modifyNotesAndCoordinates";
import { ModifyScaleData, ScaleData, StaveNoteType } from "./types";

const { Accidental, StaveNote } = Flow;

const createStaveNoteFromScaleData = (
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

const getNoteData = (
  barOfScaleData: ScaleData[],
  userClickX: number
): ModifyScaleData => {
  // First try to find the exact note using the regular index function
  let noteIndex = indexOfNote(barOfScaleData, userClickX);

  // If that fails, use a more generous approach with a larger threshold
  if (noteIndex === -1 && barOfScaleData.length > 0) {
    // Find the closest note within 50px
    let closestDistance = Number.MAX_VALUE;
    let closestIndex = -1;

    barOfScaleData.forEach((note, index) => {
      if (note.exactX !== undefined) {
        const distance = Math.abs(note.exactX - userClickX);
        if (distance < closestDistance && distance < 50) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });

    if (closestIndex !== -1) {
      noteIndex = closestIndex;
    }
  }

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
