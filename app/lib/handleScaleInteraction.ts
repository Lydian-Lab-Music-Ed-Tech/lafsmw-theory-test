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

// Define alias for cleaner code
type StaveType = ScaleData;

const { StaveNote } = Flow;

export const HandleScaleInteraction = (
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
    barOfScaleData.forEach((note, index) => {
      if (note.exactX !== undefined) {
        const distance = Math.abs(note.exactX - userClickX);
        const noteKey = note.keys && note.keys[0] ? note.keys[0] : "unknown";

        if (distance < closestDistance && distance < 150) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });

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

      barOfScaleData.forEach((note, index) => {
        if (note.exactX !== undefined) {
          const distance = Math.abs(note.exactX - userClickX);

          // Extreme threshold of 350px to catch notes anywhere on screen
          if (distance < closestDistance && distance < 350) {
            closestDistance = distance;
            targetNoteIndex = index;
            progressiveDetectionUsed = true;
          }
        }
      });
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
        let noteName = keyParts[0];
        const octave = keyParts[1];

        const newAccidental = stateCopy.isSharpActive ? "#" : "b";

        let newKey;

        // Special handling for B and B-flat:
        if (noteName.startsWith("b")) {
          if (noteName === "b") {
            // This is a B natural, so just add the accidental
            if (stateCopy.isSharpActive) {
              newKey = `b${newAccidental}/${octave}`;
            } else {
              newKey = `bb/${octave}`;
            }
          } else if (noteName === "bb") {
            // This is already a B-flat, don't replace the first 'b'
            if (stateCopy.isSharpActive) {
              // If adding sharp to Bb, we get back to B natural
              newKey = `b/${octave}`;
            } else {
              // If adding another flat, we get Bbb (B double-flat)
              newKey = `bbb/${octave}`;
            }
          } else {
            // Some other note with 'b' in it (like 'ab')
            // Remove any existing accidentals and add the new one
            const cleanNoteName = noteName.replace(/[#b]/g, "");
            newKey = `${cleanNoteName}${newAccidental}/${octave}`;
          }
        } else {
          // For all other notes, remove any existing accidentals and add the new one
          const cleanNoteName = noteName.replace(/[#b]/g, "");
          newKey = `${cleanNoteName}${newAccidental}/${octave}`;
        }

        // Create a completely new StaveNote with the accidental
        const newStaveNote = new Flow.StaveNote({
          keys: [newKey],
          duration: noteToModify.duration || "q",
          clef: chosenClef,
        });

        const accidentalModifier = new Flow.Accidental(newAccidental);
        newStaveNote.addModifier(accidentalModifier, 0);

        // Save original position information
        const exactXPosition = noteToModify.exactX;
        const userY = noteToModify.userClickY;

        // Create a complete replacement object
        const updatedNote = {
          keys: [newKey],
          duration: noteToModify.duration || "q",
          staveNote: newStaveNote,
          exactX: exactXPosition,
          userClickY: userY,
        };

        // Add the updated note to our array at the SAME index
        // This preserves the positioning and prevents duplicates
        freshBarData[targetNoteIndex] = updatedNote;

        // Deduplicate notes based on exact positions to remove any overlaps
        // Build a map of positions to notes, keeping only unique positions
        const positionMap = new Map<number, ScaleData>();

        for (let i = 0; i < freshBarData.length; i++) {
          const note = freshBarData[i];
          if (note && note.exactX !== undefined) {
            // When two notes have the same position, the later one wins
            // This ensures our modified note takes precedence if there's a conflict
            positionMap.set(note.exactX, note);
          }
        }

        // Convert the map back to an array sorted by x position
        const uniqueNotes: StaveType[] = Array.from(positionMap.entries())
          .sort((a, b) => a[0] - b[0]) // Sort by x position
          .map((entry) => entry[1]); // Extract just the note data

        // We must update the ENTIRE matrix, not just one bar
        // This ensures we don't lose state between operations
        matrixCopy[barIndex] = uniqueNotes;

        // Update coordinates for display
        const updatedCoords = updateNotesAndCoordsWithAccidental(
          buttonStates,
          foundNoteData,
          notesAndCoordinates
        );

        // Return the complete updated state
        return {
          scaleDataMatrix: matrixCopy,
          notesAndCoordinates: updatedCoords,
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

    const newStaveNote: StaveNoteType = new StaveNote({
      keys: [foundNoteData.note],
      duration: "q",
      clef: chosenClef,
    });

    // Store the exact click position with the note
    let newNoteObject = [
      ...barOfScaleData,
      {
        keys: [foundNoteData.note],
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
