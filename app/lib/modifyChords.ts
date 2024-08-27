import VexFlow from "vexflow";
import {
  Chord,
  NoteStringData,
  NotesAndCoordinatesData,
  StateInteraction,
  StaveNoteType,
} from "./typesAndInterfaces";
const { Accidental, StaveNote } = VexFlow.Flow;

const parseNote = (note: string) => {
  const noteBase = note.split("/")[0];
  const octave = note.split("/")[1];
  return { noteBase, octave };
};

export const createStaveNoteFromChordData = (
  chordData: Chord,
  chosenClef: string,
  updatedKeys?: string[]
) => {
  return new StaveNote({
    keys: updatedKeys ? updatedKeys : chordData.keys,
    duration: chordData.duration,
    clef: chosenClef,
  });
};

const getAccidentalType = (noteBase: string) => {
  if (noteBase.endsWith("##")) return "##";
  if (noteBase.endsWith("bb") && noteBase.length > 2) return "bb";
  if (noteBase.endsWith("#")) return "#";
  if (noteBase.endsWith("b") && noteBase.length > 1) return "b";
  return null;
};

const addAccidentalsToStaveNotes = (
  keys: string[],
  newChord: StaveNoteType
) => {
  keys.forEach((key, index) => {
    const { noteBase } = parseNote(key);
    const accidentalType = getAccidentalType(noteBase);

    if (accidentalType) {
      newChord.addModifier(new Accidental(accidentalType), index);
    }
  });
};

const appendAccidentalToNote = (accidental: string, note: string) => {
  const { noteBase, octave } = parseNote(note);
  if (
    (accidental === "#" && noteBase.length > 1 && noteBase.endsWith("b")) ||
    (accidental === "b" && noteBase.endsWith("#"))
  ) {
    console.log("Cannot add contradictory accidentals to the same note.");
    return note;
  }
  if (noteBase.length < 3) {
    return `${noteBase}${accidental}/${octave}`;
  }
  return `${noteBase}/${octave}`;
};

export const updateNoteWithAccidental = (
  state: StateInteraction,
  foundNoteData: NoteStringData,
  notesAndCoordinates: NotesAndCoordinatesData[]
) => {
  const accidental = state.isSharpActive ? "#" : "b";
  console.log("accidental: ", accidental);
  const updatedNote = appendAccidentalToNote(accidental, foundNoteData.note);
  console.log("updated note: ", updatedNote);
  const newNotesAndCoords = notesAndCoordinates.map((noteData) =>
    noteData.note === foundNoteData.note
      ? { ...noteData, note: updatedNote }
      : noteData
  );
  console.log("new notes and coords: ", newNotesAndCoords);
  return newNotesAndCoords;
};

export const addAccidentalToChordKeys = (
  state: StateInteraction,
  chordData: Chord,
  foundNoteIndex: number,
  chosenClef: string
) => {
  const accidental = state.isSharpActive ? "#" : "b";
  chordData.keys[foundNoteIndex] = appendAccidentalToNote(
    accidental,
    chordData.keys[foundNoteIndex]
  );

  const newChord = createStaveNoteFromChordData(chordData, chosenClef);
  addAccidentalsToStaveNotes(chordData.keys, newChord);
  return {
    ...chordData,
    staveNotes: newChord,
  };
};

export const removeAccidentals = (note: string) => {
  let { noteBase, octave } = parseNote(note);
  if (noteBase.length > 2) {
    if (noteBase.endsWith("##")) {
      noteBase = noteBase.replace("##", "");
    } else if (noteBase.endsWith("bb")) {
      noteBase = noteBase.replace("bb", "");
    }
  } else if (noteBase.length > 1) {
    if (noteBase.endsWith("b")) {
      noteBase = noteBase.replace("b", "");
    } else if (noteBase.endsWith("#")) {
      noteBase = noteBase.replace("#", "");
    }
  }

  return `${noteBase}/${octave}`;
};

export const removeAccidentalFromChord = (
  chordData: Chord,
  foundNoteIndex: number,
  chosenClef: string
) => {
  chordData.keys[foundNoteIndex] = removeAccidentals(
    chordData.keys[foundNoteIndex]
  );
  return {
    ...chordData,
    staveNotes: createStaveNoteFromChordData(chordData, chosenClef),
  };
};

export const removeAccidentalFromNotesAndCoords = (
  notesAndCoordinates: NotesAndCoordinatesData[],
  foundNoteData: NotesAndCoordinatesData
) => {
  foundNoteData.note = removeAccidentals(foundNoteData.note);
  return notesAndCoordinates.map((noteData) =>
    noteData === foundNoteData
      ? { ...noteData, note: foundNoteData.note }
      : noteData
  );
};

export const addNewNoteToChord = (
  chordData: Chord,
  foundNoteData: NoteStringData,
  chosenClef: string
) => {
  const updatedKeys = [...chordData.keys, foundNoteData.note];
  const newChord = createStaveNoteFromChordData(
    chordData,
    chosenClef,
    updatedKeys
  );

  addAccidentalsToStaveNotes(updatedKeys, newChord);

  return {
    ...chordData,
    keys: updatedKeys,
    staveNotes: newChord,
  };
};

export const reconstructChord = (chordData: Chord, chosenClef: string) => {
  const newChord = createStaveNoteFromChordData(chordData, chosenClef);
  addAccidentalsToStaveNotes(chordData.keys, newChord);

  return {
    ...chordData,
    staveNotes: newChord,
  };
};

export const removeNoteFromChord = (
  chordData: Chord,
  foundNoteIndex: number,
  chosenClef: string
) => {
  if (chordData.keys[foundNoteIndex]) {
    chordData.keys.splice(foundNoteIndex, 1);
    const newChord = createStaveNoteFromChordData(chordData, chosenClef);
    return {
      ...chordData,
      staveNotes: newChord,
    };
  }
  return chordData;
};
