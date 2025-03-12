import { ScaleData, StaveNoteData } from "./types";

export const indexOfNoteToModify = (
  scaleData: ScaleData[] | StaveNoteData[],
  userClickX: number
): number => {
  // Increased threshold to 30px for better note detection
  const index: number = scaleData?.findIndex(
    (note) => Math.abs(note.exactX - userClickX) <= 30
  );
  return index;
};
