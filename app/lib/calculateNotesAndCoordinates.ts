import React from "react";
import generateYMinAndYMaxForKeySig from "./generateYMinAndMaxForKeySig";
import { NotesAndCoordinatesData, StaveType } from "./types";

const TOLERANCE: number = 2.5;
const helperFunction = (
  newStaves: StaveType[],
  index: number,
  clefLineNumber: number,
  spacingBetweenLines?: number
) => {
  if (spacingBetweenLines) {
    spacingBetweenLines = spacingBetweenLines / 2;
    const topLineCoordinate = newStaves[index].getYForLine(clefLineNumber);
    return topLineCoordinate - spacingBetweenLines - TOLERANCE;
  }
  const topLineCoordinate = newStaves[index].getYForLine(clefLineNumber);
  return topLineCoordinate - 2.5;
};

const calculateNotesAndCoordinates = (
  clef: string,
  setNotesAndCoordinates: React.Dispatch<
    React.SetStateAction<NotesAndCoordinatesData[]>
  >,
  newStaves: StaveType[],
  notesArray: string[],
  index: number,
  bassClefLineNumber: number,
  trebleClefLineNumber: number,
  isLine?: boolean
): void => {
  if (newStaves && newStaves.length > 0) {
    if (!isLine) {
      let minimumYCoordinate: number;
      const spacingBetweenLines = newStaves[index].getSpacingBetweenLines();
      if (clef === "bass") {
        minimumYCoordinate = helperFunction(
          newStaves,
          index,
          bassClefLineNumber,
          spacingBetweenLines
        );
      } else if (clef === "treble") {
        minimumYCoordinate = helperFunction(
          newStaves,
          index,
          trebleClefLineNumber,
          spacingBetweenLines
        );
      }
      setNotesAndCoordinates(() =>
        generateYMinAndYMaxForKeySig(minimumYCoordinate, notesArray)
      );
    } else {
      let minimumYCoordinate: number;
      if (clef === "bass") {
        minimumYCoordinate = helperFunction(
          newStaves,
          index,
          bassClefLineNumber
        );
      } else if (clef === "treble") {
        minimumYCoordinate = helperFunction(
          newStaves,
          index,
          trebleClefLineNumber
        );
      }
      setNotesAndCoordinates(() =>
        generateYMinAndYMaxForKeySig(minimumYCoordinate, notesArray)
      );
    }
  }
};

export default calculateNotesAndCoordinates;
