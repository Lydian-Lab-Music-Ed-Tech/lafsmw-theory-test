import { ScaleData, StaveNoteData } from "./types";

export const indexOfNoteToModify = (
  scaleData: ScaleData[] | StaveNoteData[],
  userClickX: number
): number => {
  const index: number = scaleData?.findIndex(
    (note) => Math.abs(note.exactX - userClickX) <= 10
  );
  return index;
};
