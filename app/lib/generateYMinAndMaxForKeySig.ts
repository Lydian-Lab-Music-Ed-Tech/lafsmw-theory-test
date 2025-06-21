import { NotesAndCoordinatesData } from "./types";

const tolerance = 5;
const generateYMinAndYMaxForKeySig = (
  topNoteYCoordinate: number,
  notes: string[]
): NotesAndCoordinatesData[] => {
  return notes.map((note, index) => {
    const originalNote = note;
    const yCoordinateMin = topNoteYCoordinate + index * 5;
    const yCoordinateMax = yCoordinateMin + tolerance;
    const userClickY = yCoordinateMin + tolerance / 2; // Calculate the center Y for the note
    return { originalNote, note, yCoordinateMin, yCoordinateMax, userClickY }; // Include userClickY
  });
};

export default generateYMinAndYMaxForKeySig;
