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
} from "./types";

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
  console.log('getNoteData called with:', {
    userClickX,
    barOfScaleData: barOfScaleData.map(note => ({
      exactX: note.exactX,
      keys: note.keys
    }))
  });
  
  // First try to find the exact note using the regular index function
  let noteIndex = indexOfNote(barOfScaleData, userClickX);
  
  // If that fails, use a more generous approach with a larger threshold
  if (noteIndex === -1 && barOfScaleData.length > 0) {
    console.log('Note not found with standard indexOfNote, trying with larger threshold');
    
    // Find the closest note within 50px
    let closestDistance = Number.MAX_VALUE;
    let closestIndex = -1;
    
    barOfScaleData.forEach((note, index) => {
      if (note.exactX !== undefined) {
        const distance = Math.abs(note.exactX - userClickX);
        console.log(`Note ${index} distance: ${distance}`);
        if (distance < closestDistance && distance < 50) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });
    
    if (closestIndex !== -1) {
      console.log(`Found note with larger threshold at index ${closestIndex}`);
      noteIndex = closestIndex;
    }
  }
  
  console.log(`Final note index selected: ${noteIndex}`);
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
  // Get the note to modify
  let { noteDataObject, noteIndex } = getNoteData(scaleData, userClickX);
  
  // Log which note we found
  console.log('addAccidentalToStaveNoteAndKeys working with:', {
    noteIndex,
    noteData: noteDataObject ? {
      keys: noteDataObject.keys,
      exactX: noteDataObject.exactX
    } : 'undefined'
  });
  
  // If no note was found or noteIndex is -1, we can't add an accidental
  if (noteIndex === -1 || !noteDataObject) {
    console.error('No note found to add accidental to');
    // Return a default object that won't modify anything
    return { updatedNoteObject: scaleData[0], noteIndex: 0 };
  }
  
  // Determine the accidental based on which button is active
  const accidental = noteInteractionState.isSharpActive ? "#" : "b";
  
  // Apply the accidental to the note
  const updatedKey = appendAccidentalToNote(
    accidental,
    noteDataObject.keys[0]
  );
  
  console.log(`Adding ${accidental} to ${noteDataObject.keys[0]} -> ${updatedKey}`);
  
  // Create a new stave note with the updated key
  const newKeys = [updatedKey];
  const newStaveNote = createStaveNoteFromScaleData(noteDataObject, chosenClef, newKeys);
  
  // Add the accidental visual to the stave note
  addAccidentalsToStaveNotes(newKeys, newStaveNote);
  
  // Create the updated note object with the new keys and stave note
  const updatedNoteObject = {
    ...noteDataObject,
    staveNote: newStaveNote,
    keys: newKeys,
    // Make sure we preserve the exactX position
    exactX: noteDataObject.exactX
  };
  
  console.log('Updated note object:', {
    keys: updatedNoteObject.keys,
    exactX: updatedNoteObject.exactX
  });
  
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
