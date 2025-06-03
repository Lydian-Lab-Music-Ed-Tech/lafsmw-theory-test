import { Flow } from "vexflow";
import {
  removeAccidentalFromNotesAndCoords,
  updateNotesAndCoordsWithAccidental,
} from "./modifyNotesAndCoordinates";
import {
  removeAccidentalFromStaveNote,
  removeNoteFromScale,
} from "./modifyScales";
import {
  NotesAndCoordinatesData,
  ScaleData,
  StaveNoteType,
  errorMessages,
} from "./types";

const { StaveNote } = Flow;

export const handleScaleInteraction = (
  foundNoteData: NotesAndCoordinatesData,
  notesAndCoordinates: NotesAndCoordinatesData[],
  barOfScaleData: ScaleData[],
  scaleDataMatrix: ScaleData[][],
  buttonStates: {
    isEnterNoteActive: boolean;
    isEraseNoteActive: boolean;
    isSharpActive: boolean;
    isFlatActive: boolean;
    isEraseAccidentalActive: boolean;
  },
  userClickX: number,
  userClickY: number,
  barIndex: number,
  chosenClef: string,
  setMessage: (newState: React.SetStateAction<string>) => void,
  setOpen: (newState: React.SetStateAction<boolean>) => void,
  errorMessages: errorMessages
) => {
  // Create defensive copies to avoid any state mutation issues
  const stateCopy = { ...buttonStates };

  const findExistingNoteIndex = () => {
    if (!barOfScaleData || barOfScaleData.length === 0) {
      return -1;
    }
    let closestIndex = -1;
    let closestDistance = Number.MAX_VALUE;
    // Loop through notes to find the closest one
    for (let i = 0; i < barOfScaleData.length; i++) {
      const note = barOfScaleData[i];
      if (note.exactX !== undefined) {
        const distance = Math.abs(note.exactX - userClickX);
        if (distance < closestDistance && distance < 150) {
          closestDistance = distance;
          closestIndex = i;
        }
      }
    }
    return closestIndex;
  };

  const scaleLength = scaleDataMatrix[0].length;
  const existingNoteIndex = findExistingNoteIndex();
  const existingNoteFound = existingNoteIndex !== -1;

  // This branch handles all accidental operations
  if (stateCopy.isSharpActive || stateCopy.isFlatActive) {
    if (barOfScaleData.length === 0) {
      return { scaleDataMatrix, notesAndCoordinates };
    }

    // Progressive note detection strategy
    let targetNoteIndex = existingNoteIndex;
    let progressiveDetectionUsed = false;

    // If standard detection failed, try with a much more aggressive approach
    if (targetNoteIndex === -1) {
      let closestDistance = Number.MAX_VALUE;

      for (let i = 0; i < barOfScaleData.length; i++) {
        const note = barOfScaleData[i];
        if (note.exactX !== undefined) {
          const distance = Math.abs(note.exactX - userClickX);

          // Extreme threshold of 350px to catch notes anywhere on screen
          if (distance < closestDistance && distance < 350) {
            closestDistance = distance;
            targetNoteIndex = i;
            progressiveDetectionUsed = true;
          }
        }
      }
    }

    // Last resort: take the first note if we still couldn't find one
    if (targetNoteIndex === -1 && barOfScaleData.length > 0) {
      targetNoteIndex = 0;
      progressiveDetectionUsed = true;
    }

    // Now we should have a note to modify
    if (targetNoteIndex !== -1) {
      try {
        // IMPORTANT: Create a deep copy of the entire matrix to ensure we don't lose any state
        const matrixCopy = [...scaleDataMatrix];

        // Get a fresh copy of the current bar with all existing accidentals preserved
        if (!matrixCopy[barIndex]) {
          matrixCopy[barIndex] = [];
        }
        const freshBarData = [...matrixCopy[barIndex]];

        const noteToModify = freshBarData[targetNoteIndex];
        if (!noteToModify || !noteToModify.keys || !noteToModify.keys[0]) {
          return { scaleDataMatrix, notesAndCoordinates };
        }

        const key = noteToModify.keys[0];
        const keyParts = key.split("/");
        const noteBase = keyParts[0]; // Current note name with accidentals
        const octave = keyParts[1];
        const cleanNoteName = noteBase.replace(/[#b]/g, "");

        // Determine the new key based on the button state
        let newKey;
        
        // Handle special case for B notes to avoid confusion with flat notation
        const isB = cleanNoteName === "b";

        // Direct accidental application using length and slice pattern
        if (stateCopy.isSharpActive) {
          // Sharp button active
          if (noteBase.length >= 3 && noteBase.slice(-2) === "##") {
            // Already double sharp - do nothing
            newKey = noteBase + "/" + octave;
          } else if (noteBase.length >= 2 && noteBase.slice(-1) === "#") {
            // Single sharp - make it double sharp
            newKey = `${cleanNoteName}##/${octave}`;
          } else if ((noteBase.length >= 3 && noteBase.slice(-2) === "bb") || 
                     (noteBase.length >= 2 && noteBase.slice(-1) === "b" && !isB)) {
            // If flat or double flat - make it sharp instead
            newKey = `${cleanNoteName}#/${octave}`;
          } else {
            // Natural - make it sharp
            newKey = `${cleanNoteName}#/${octave}`;
          }
        } else {
          // Flat button active
          if (noteBase.length >= 3 && noteBase.slice(-2) === "bb") {
            // Already double flat - do nothing
            newKey = noteBase + "/" + octave;
          } else if (noteBase.length >= 2 && noteBase.slice(-1) === "b" && !isB) {
            // Single flat - make it double flat
            newKey = `${cleanNoteName}bb/${octave}`;
          } else if ((noteBase.length >= 3 && noteBase.slice(-2) === "##") ||
                     (noteBase.length >= 2 && noteBase.slice(-1) === "#")) {
            // If sharp or double sharp - make it flat instead
            newKey = `${cleanNoteName}b/${octave}`;
          } else {
            // Natural - make it flat
            newKey = `${cleanNoteName}b/${octave}`;
          }
        }

        // Save original position information
        const exactXPosition = noteToModify.exactX;
        const userClickYPosition = noteToModify.userClickY;

        // Update the note in the bar data with the new key
        freshBarData[targetNoteIndex] = {
          ...noteToModify, // Preserve other properties like duration, exactX, userClickY
          keys: [newKey], // The new key with the correct accidental
          staveNote: null, // StaveNote will be recreated by the rendering function
        };
        
        // Deduplicate notes based on exact positions to remove any overlaps
        // Build a map of positions to notes, keeping only unique positions
        const positionMap = new Map<number, ScaleData>();
        for (let i = 0; i < freshBarData.length; i++) {
          const currentNoteInLoop = freshBarData[i];
          if (currentNoteInLoop && typeof currentNoteInLoop.exactX === 'number') {
            positionMap.set(currentNoteInLoop.exactX, currentNoteInLoop);
          }
        }
        // Convert the map back to an array sorted by x position
        const uniqueNotesSorted: ScaleData[] = Array.from(positionMap.values())
          .sort((noteA: ScaleData, noteB: ScaleData) => (noteA.exactX ?? 0) - (noteB.exactX ?? 0));

        // Update the bar in the matrix copy with the deduplicated and sorted notes
        matrixCopy[barIndex] = uniqueNotesSorted;

        // Update notesAndCoordinates if necessary
        let updatedNotesAndCoordinates = notesAndCoordinates;
        if (progressiveDetectionUsed) {
          updatedNotesAndCoordinates = updateNotesAndCoordsWithAccidental(
            buttonStates,
            foundNoteData, 
            notesAndCoordinates
          );
        }

        return {
          scaleDataMatrix: matrixCopy,
          notesAndCoordinates: updatedNotesAndCoordinates,
        };
      } catch (error) {
        console.error("Error applying accidental:", error);
        return { scaleDataMatrix, notesAndCoordinates };
      }
    } else {
      console.log("Failed to find any note to modify");
      return { scaleDataMatrix, notesAndCoordinates };
    }
  }
  // Erasing accidentals from existing notes
  else if (buttonStates.isEraseAccidentalActive && existingNoteFound) {
    notesAndCoordinates = removeAccidentalFromNotesAndCoords(
      notesAndCoordinates,
      foundNoteData
    );

    // Use the exact position of the found note
    const { updatedNoteObject, noteIndex } = removeAccidentalFromStaveNote(
      barOfScaleData,
      barOfScaleData[existingNoteIndex].exactX as number,
      chosenClef
    );

    barOfScaleData[noteIndex] = updatedNoteObject;
    scaleDataMatrix[barIndex] = barOfScaleData;
  }
  // Erasing notes
  else if (buttonStates.isEraseNoteActive && existingNoteFound) {
    notesAndCoordinates = removeAccidentalFromNotesAndCoords(
      notesAndCoordinates,
      foundNoteData
    );

    // Use the exact position of the found note
    removeNoteFromScale(
      barOfScaleData,
      barOfScaleData[existingNoteIndex].exactX as number
    );
    scaleDataMatrix[barIndex] = barOfScaleData;
  }
  // Check if there are too many notes in the measure
  else if (scaleLength >= 7) {
    setOpen(true);
    setMessage(errorMessages.tooManyNotesInMeasure);
  }
  // Only add a new note if we're not in any modification mode (sharp, flat, erase, etc.)
  else if (
    !buttonStates.isSharpActive &&
    !buttonStates.isFlatActive &&
    !buttonStates.isEraseAccidentalActive &&
    !buttonStates.isEraseNoteActive
  ) {
    // We're in enter note mode (default) or no mode selected

    // Handle note names and ensure correct representation
    // In VexFlow, lowercase 'b' can mean both the note 'B' and the flat accidental
    // We need to ensure B natural is represented properly
    let noteKey = foundNoteData.note;
    let keyParts = noteKey.split("/");
    let noteName = keyParts[0];
    let octave = keyParts[1];

    // Fix for B natural - use uppercase B to avoid confusion with flat sign
    // This ensures it's interpreted as B natural, not B-flat
    if (noteName === "b") {
      // Replace with uppercase B, which VexFlow will treat as B natural
      noteKey = `B/${octave}`;
      // Update foundNoteData as well to ensure consistency
      foundNoteData.note = noteKey;
    }

    const newStaveNote: StaveNoteType = new StaveNote({
      keys: [noteKey],
      duration: "q",
      clef: chosenClef,
    });

    // Store the exact click position with the note
    let newNoteObject = [
      ...barOfScaleData,
      {
        keys: [noteKey], // Use the possibly modified note key
        duration: "q",
        staveNote: newStaveNote,
        exactX: userClickX, // Use exactX for positioning
        userClickY,
      },
    ];

    scaleDataMatrix[barIndex] = newNoteObject;
  }
  // If we got here, it means we're in a modification mode (sharp, flat, etc.) but didn't find a note to modify
  else {
    // Do nothing - we need a valid note to modify
    // This prevents adding notes when in modification mode
  }
  return {
    scaleDataMatrix,
    notesAndCoordinates,
  };
};
