import {
  NoteInteractionState,
  KeySigState,
  NotesAndCoordinatesData,
} from "./typesAndInterfaces";

export const parseNote = (note: string) => {
  const noteBase = note.split("/")[0];
  const octave = note.split("/")[1];
  return { noteBase, octave };
};

export const appendAccidentalToNote = (accidental: string, note: string) => {
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
  if (noteBase.length > 3) {
    console.log("Cannot add more than 2 accidentals to a note.");
  }
  return `${noteBase}/${octave}`;
};

export const updateNotesAndCoordsWithAccidental = (
  state: NoteInteractionState | KeySigState,
  foundNoteData: NotesAndCoordinatesData,
  notesAndCoordinates: NotesAndCoordinatesData[]
) => {
  const accidental = state.isSharpActive ? "#" : "b";
  const newNotesAndCoords = notesAndCoordinates.map((noteData) =>
    noteData.note === foundNoteData.note
      ? {
          ...noteData,
          note: appendAccidentalToNote(accidental, foundNoteData.note),
        }
      : noteData
  );
  return newNotesAndCoords;
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

export const getAccidentalType = (noteBase: string) => {
  if (noteBase.endsWith("##")) return "##";
  if (noteBase.endsWith("bb") && noteBase.length > 2) return "bb";
  if (noteBase.endsWith("#")) return "#";
  if (noteBase.endsWith("b") && noteBase.length > 1) return "b";
  return null;
};

export const removeAccidentalFromNotesAndCoords = (
  notesAndCoordinates: NotesAndCoordinatesData[],
  foundNoteData: NotesAndCoordinatesData
) => {
  return notesAndCoordinates.map((noteData) => {
    return noteData.note === foundNoteData.note
      ? { ...noteData, note: noteData.originalNote }
      : noteData;
  });
};
