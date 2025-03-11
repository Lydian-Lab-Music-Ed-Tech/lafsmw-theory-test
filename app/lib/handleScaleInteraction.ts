import VexFlow from "vexflow";

import {
  removeAccidentalFromNotesAndCoords,
  updateNotesAndCoordsWithAccidental,
} from "./modifyNotesAndCoordinates";
import {
  addAccidentalToStaveNoteAndKeys,
  changeNotePosition,
  removeAccidentalFromStaveNote,
  removeNoteFromScale,
} from "./modifyScales";
import {
  StateInteraction,
  NotesAndCoordinatesData,
  ScaleData,
  StaveNoteType,
  errorMessages,
} from "./types";
const { StaveNote } = VexFlow.Flow;

export const HandleScaleInteraction = (
  foundNoteData: NotesAndCoordinatesData,
  notesAndCoordinates: NotesAndCoordinatesData[],
  barOfScaleData: ScaleData[],
  scaleDataMatrix: ScaleData[][],
  buttonStates: {
    isEnterNoteActive: boolean;
    isEraseNoteActive: boolean;
    isChangeNoteActive: boolean;
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
  console.log('HandleScaleInteraction called with:', {
    buttonStates,
    userClickX,
    userClickY,
    scaleLength: barOfScaleData.length,
    noteKeys: barOfScaleData.map(note => note.keys?.[0])
  });
  
  // Enhanced approach for finding existing notes
  const findExistingNoteIndex = () => {
    if (!barOfScaleData || barOfScaleData.length === 0) {
      console.log('No scale data available for note detection');
      return -1;
    }
    
    // Find the note closest to the click position
    let closestIndex = -1;
    let closestDistance = Number.MAX_VALUE;
    
    // Safely log notes information
    console.log('Existing notes:', barOfScaleData.map(note => ({
      exactX: note.exactX,
      keys: note.keys ? [...note.keys] : [] // Create a new array to avoid circular refs
    })));
    
    barOfScaleData.forEach((note, index) => {
      if (note.exactX !== undefined) { // Make sure exactX exists
        const distance = Math.abs(note.exactX - userClickX);
        
        // Safely log note information without circular refs
        const noteKey = note.keys && note.keys[0] ? note.keys[0] : 'unknown';
        console.log(`Note ${index}, key=${noteKey}, exactX=${note.exactX}, distance=${distance}`);
        
        // Use a more generous threshold of 50px
        if (distance < closestDistance && distance < 50) {
          closestDistance = distance;
          closestIndex = index;
        }
      } else {
        console.log(`Note ${index} has no exactX coordinate`);
      }
    });
    
    console.log(`Closest note index: ${closestIndex}, distance: ${closestIndex !== -1 && barOfScaleData[closestIndex] && barOfScaleData[closestIndex].exactX !== undefined ? Math.abs(barOfScaleData[closestIndex].exactX - userClickX) : 'N/A'}`);
    return closestIndex;
  };

  const scaleLength = scaleDataMatrix[0].length;
  const existingNoteIndex = findExistingNoteIndex();
  const existingNoteFound = existingNoteIndex !== -1;
  
  console.log('Existing note found:', existingNoteFound, existingNoteIndex, existingNoteFound ? `key=${barOfScaleData[existingNoteIndex]?.keys?.[0] || 'unknown'}` : '')
  
  // If we have sharp or flat active and we found an existing note nearby
  if ((buttonStates.isSharpActive || buttonStates.isFlatActive) && existingNoteFound) {
    // First update the note coordinates for display
    notesAndCoordinates = updateNotesAndCoordsWithAccidental(
      buttonStates,
      foundNoteData,
      notesAndCoordinates
    );
    
    console.log('ACCIDENTAL MODE: Applying accidental to note at index', existingNoteIndex);
    
    try {
      // Get the note we want to modify
      const noteToModify = barOfScaleData[existingNoteIndex];
      
      if (!noteToModify || !noteToModify.keys || !noteToModify.keys[0]) {
        console.error('Invalid note object:', noteToModify);
        return { scaleDataMatrix, notesAndCoordinates };
      }
      
      // Safely log without circular references
      console.log('Note before modification:', {
        keys: noteToModify.keys ? [...noteToModify.keys] : [],
        exactX: noteToModify.exactX
      });
      
      // Save the exact position so it doesn't move
      const exactXPosition = noteToModify.exactX;
      
      // Determine which accidental to add
      const accidental = buttonStates.isSharpActive ? "#" : "b";
      
      // Remove any existing accidentals first, then add the new one
      const baseNote = noteToModify.keys[0].replace(/[#b]/g, '');
      const updatedKey = baseNote + accidental;
      
      console.log(`Modifying note from ${noteToModify.keys[0]} to ${updatedKey}`);
      
      // Create a new stave note with the updated key
      const newStaveNote = new VexFlow.Flow.StaveNote({
        keys: [updatedKey],
        duration: "q",
        clef: chosenClef
      });
      
      // Add the accidental modifier to make it visible
      const mod = new VexFlow.Flow.Accidental(accidental);
      newStaveNote.addModifier(mod);
      
      // Create a completely fresh object to avoid any state issues
      const updatedNoteObject = {
        keys: [updatedKey],
        duration: "q",
        staveNote: newStaveNote,
        exactX: exactXPosition,  // Crucial: maintain the exact position
        userClickY: noteToModify.userClickY // Maintain Y position if present
      };
      
      console.log('New note object created:', {
        keys: updatedNoteObject.keys ? [...updatedNoteObject.keys] : [],
        exactX: updatedNoteObject.exactX
      });
      
      // IMPORTANT: Make a completely fresh array to avoid React state issues
      const freshBarData = [...barOfScaleData];
      
      // Replace the original note with our updated version
      freshBarData[existingNoteIndex] = updatedNoteObject;
      
      // Update the data matrix with the fresh array at the right index
      scaleDataMatrix[barIndex] = freshBarData;
      
      console.log('Updated scale data matrix with accidental');
    } catch (error) {
      console.error('Error adding accidental:', error);
    }
  } 
  // If sharp/flat is active but no existing note, don't do anything (prevent adding new notes when accidental mode is on)
  else if ((buttonStates.isSharpActive || buttonStates.isFlatActive) && !existingNoteFound) {
    // Do nothing - we want to prevent adding new notes when in sharp/flat mode
    // This prevents the bug where clicking with sharp active tries to add a new note
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
    removeNoteFromScale(barOfScaleData, barOfScaleData[existingNoteIndex].exactX as number);
    scaleDataMatrix[barIndex] = barOfScaleData;
  }
  // Changing note position
  else if (buttonStates.isChangeNoteActive && existingNoteFound) {
    notesAndCoordinates = removeAccidentalFromNotesAndCoords(
      notesAndCoordinates,
      foundNoteData
    );
    
    changeNotePosition(
      barOfScaleData,
      barOfScaleData[existingNoteIndex].exactX as number,
      foundNoteData,
      userClickY,
      chosenClef
    );
    
    scaleDataMatrix[barIndex] = barOfScaleData;
  } else if (scaleLength >= 7) {
    setOpen(true);
    setMessage(errorMessages.tooManyNotesInMeasure);
  } 
  // Only add a new note if we're not in any modification mode (sharp, flat, erase, etc.)
  else if (!buttonStates.isSharpActive && 
           !buttonStates.isFlatActive && 
           !buttonStates.isEraseAccidentalActive && 
           !buttonStates.isEraseNoteActive && 
           !buttonStates.isChangeNoteActive) {
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
