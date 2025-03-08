import { NotesAndCoordinatesData } from "./types";

const tolerance = 5;
const generateYMinAndYMaxForNotes = (
  topNoteYCoordinate: number,
  notes: string[]
): NotesAndCoordinatesData[] => {
  return notes.map((note, index) => {
    const originalNote = note;
    const yCoordinateMin = topNoteYCoordinate + index * 5;
    const yCoordinateMax = yCoordinateMin + tolerance;

    return { originalNote, note, yCoordinateMin, yCoordinateMax };
  });
};

export default generateYMinAndYMaxForNotes;
