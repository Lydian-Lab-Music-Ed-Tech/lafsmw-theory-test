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

// Define alias for cleaner code
type StaveType = ScaleData;

const { StaveNote } = VexFlow.Flow;

// Helper function to create a stave note with an accidental
const createStaveNoteWithAccidental = (
  originalNote: ScaleData,
  originalKey: string,
  newKey: string,
  accidental: string,
  chosenClef: string
): ScaleData => {
  // Create a new StaveNote with the updated key
  const newNote = new StaveNote({
    clef: chosenClef,
    keys: [newKey],
    duration: originalNote.duration || '4'
  });
  
  // Add the accidental modifier if needed
  if (accidental && (accidental === '#' || accidental === 'b')) {
    console.log(`Adding ${accidental} accidental to note`);
    // Create the accidental modifier and add it with the CORRECT parameter order
    // VexFlow docs show: addModifier(modifier, index)
    const accidentalModifier = new VexFlow.Flow.Accidental(accidental);
    newNote.addModifier(accidentalModifier, 0); // First param is the modifier object, second is the index
  }
  
  // Create proper ScaleData object to match the expected type
  const resultNote: ScaleData = {
    ...originalNote,
    keys: [newKey],
    staveNote: newNote,
    exactX: originalNote.exactX // Preserve the X position
  };
  
  return resultNote;
};

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
  // CRITICAL FIX: Double-check button states at point of interaction
  // Log the actual button states we're receiving to help with debugging
  console.log('🕵️‍♂️ HandleScaleInteraction received button states:', {
    isSharpActive: buttonStates.isSharpActive,
    isFlatActive: buttonStates.isFlatActive,
    isEnterNoteActive: buttonStates.isEnterNoteActive,
    isEraseNoteActive: buttonStates.isEraseNoteActive
  });
  
  // Create defensive copies to avoid any state mutation issues
  const stateCopy = { ...buttonStates };

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
      console.log('\n\n⚠️ No scale data available for note detection');
      return -1;
    }
    
    console.log('\n\n🔍 SEARCHING FOR EXISTING NOTES');
    console.log(`Click position x=${userClickX}`);
    console.log(`Total notes in this bar: ${barOfScaleData.length}`);
    
    // Find the note closest to the click position
    let closestIndex = -1;
    let closestDistance = Number.MAX_VALUE;

    // Loop through notes to find the closest one
    barOfScaleData.forEach((note, index) => {
      // Only process notes that have a position
      if (note.exactX !== undefined) {
        const distance = Math.abs(note.exactX - userClickX);
        const noteKey = note.keys && note.keys[0] ? note.keys[0] : 'unknown';
        
        console.log(`Note ${index}: key=${noteKey}, x=${note.exactX}, distance=${distance}px`);
        
        // CRITICAL FIX: Use a much larger threshold of 150px
        // This ensures we detect notes even with less precise clicks
        if (distance < closestDistance && distance < 150) {
          console.log(`🎯 FOUND NOTE: ${noteKey} at index ${index} with distance ${distance}px`);
          closestDistance = distance;
          closestIndex = index;
        }
      } else {
        console.log(`Note ${index} has no exactX coordinate - skipping`);
      }
    });
    
    // Report the results of our search
    if (closestIndex !== -1) {
      const matchedNote = barOfScaleData[closestIndex];
      console.log(`✅ Found existing note at index ${closestIndex}:`);
      console.log(`  - Key: ${matchedNote.keys?.[0]}`);
      console.log(`  - Position: ${matchedNote.exactX}px`);
      console.log(`  - Distance from click: ${Math.abs(matchedNote.exactX - userClickX)}px`);
    } else {
      console.log('❌ No existing note found near click position');
    }
    
    return closestIndex;
  };

  const scaleLength = scaleDataMatrix[0].length;
  const existingNoteIndex = findExistingNoteIndex();
  const existingNoteFound = existingNoteIndex !== -1;
  
  console.log('Existing note found:', existingNoteFound, existingNoteIndex, existingNoteFound ? `key=${barOfScaleData[existingNoteIndex]?.keys?.[0] || 'unknown'}` : '')
  
  // Enable a debug mode for detailed logging
  const DEBUG = true;
  
  // CRITICAL FIX: This branch handles all accidental operations
  // This version fixes both duplicate notes and ensures sharps/flats persist for all notes
  if (stateCopy.isSharpActive || stateCopy.isFlatActive) {
    console.log('🚨 ACCIDENTAL MODE ACTIVE - Fixing both duplicate notes and persistence issues');
    
    // Check if we have ANY notes at all before proceeding
    if (barOfScaleData.length === 0) {
      console.log('⛔ No notes exist in this bar - cannot add accidentals to nothing');
      return { scaleDataMatrix, notesAndCoordinates };
    }
    
    // Progressive note detection strategy
    let targetNoteIndex = existingNoteIndex;
    let progressiveDetectionUsed = false;
    
    // If standard detection failed, try with a much more aggressive approach
    if (targetNoteIndex === -1) {
      console.log('🔍 Using aggressive detection to find any suitable note');
      
      let closestDistance = Number.MAX_VALUE;
      
      barOfScaleData.forEach((note, index) => {
        if (note.exactX !== undefined) {
          const distance = Math.abs(note.exactX - userClickX);
          
          // Extreme threshold of 350px to catch notes anywhere on screen
          if (distance < closestDistance && distance < 350) {
            console.log(`📡 Found note at index ${index} with distance ${distance}px`);
            closestDistance = distance;
            targetNoteIndex = index;
            progressiveDetectionUsed = true;
          }
        }
      });
    }
    
    // Last resort: take the first note if we still couldn't find one
    if (targetNoteIndex === -1 && barOfScaleData.length > 0) {
      console.log('🧩 Last resort - using first available note');
      targetNoteIndex = 0;
      progressiveDetectionUsed = true;
    }
    
    // Now we should have a note to modify
    if (targetNoteIndex !== -1) {
      console.log(`🎯 Modifying note at index ${targetNoteIndex}${progressiveDetectionUsed ? ' (using progressive detection)' : ''}`);
      
      try {
        // IMPORTANT: Create a deep copy of the entire matrix to ensure we don't lose any state
        const matrixCopy = [...scaleDataMatrix];
        
        // Get a fresh copy of the current bar with all existing accidentals preserved
        if (!matrixCopy[barIndex]) {
          matrixCopy[barIndex] = [];
        }
        const freshBarData = [...matrixCopy[barIndex]];
        
        // Get the note we want to modify
        const noteToModify = freshBarData[targetNoteIndex];
        if (!noteToModify || !noteToModify.keys || !noteToModify.keys[0]) {
          console.error('❌ Invalid note to modify:', noteToModify);
          return { scaleDataMatrix, notesAndCoordinates };
        }
        
        // Get the original note information
        const key = noteToModify.keys[0];
        console.log(`Working with note: ${key} at position ${noteToModify.exactX}px`);
        
        // Extract the note components
        const keyParts = key.split('/');
        let noteName = keyParts[0];
        const octave = keyParts[1];
        
        // Determine which accidental to apply and clean the note name
        const newAccidental = stateCopy.isSharpActive ? '#' : 'b';
        noteName = noteName.replace(/[#b]/g, ''); // Remove any existing accidentals
        const newKey = `${noteName}${newAccidental}/${octave}`;
        
        console.log(`Transforming note from ${key} to ${newKey}`);
        
        // Create a completely new StaveNote with the accidental
        const newStaveNote = new VexFlow.Flow.StaveNote({
          keys: [newKey],
          duration: noteToModify.duration || 'q',
          clef: chosenClef
        });
        
        // Add the accidental modifier with the correct parameter ordering
        const accidentalModifier = new VexFlow.Flow.Accidental(newAccidental);
        newStaveNote.addModifier(accidentalModifier, 0); // First arg is modifier, second is index
        
        // Save original position information
        const exactXPosition = noteToModify.exactX;
        const userY = noteToModify.userClickY;
        
        // Create a complete replacement object
        const updatedNote = {
          keys: [newKey],
          duration: noteToModify.duration || 'q',
          staveNote: newStaveNote,
          exactX: exactXPosition,
          userClickY: userY
        };
        
        // CRITICAL FIX: Add the updated note to our array at the SAME index
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
          .map(entry => entry[1]);  // Extract just the note data
        
        console.log(`Bar originally had ${freshBarData.length} notes, now has ${uniqueNotes.length} after deduplication`);
        
        // When updating a note with an accidental, ensure we're keeping track of ALL notes properly
        // CRITICAL FIX: We need to debug what's happening with the state matrix between clicks
        console.log('STATE DEBUG: Complete scale data matrix BEFORE update:', JSON.stringify(
          scaleDataMatrix.map(bar => bar.map(note => note.keys?.[0] || 'unknown')), null, 2)
        );
        
        // CRITICAL FIX: We must update the ENTIRE matrix, not just one bar
        // This ensures we don't lose state between operations
        matrixCopy[barIndex] = uniqueNotes;
        
        // Log the complete state AFTER modification to track changes
        console.log('STATE DEBUG: Complete scale data matrix AFTER update:', JSON.stringify(
          matrixCopy.map(bar => bar.map(note => note.keys?.[0] || 'unknown')), null, 2)
        );
        
        // Update coordinates for display
        const updatedCoords = updateNotesAndCoordsWithAccidental(
          buttonStates,
          foundNoteData,
          notesAndCoordinates
        );
        
        // Return the complete updated state
        return { 
          scaleDataMatrix: matrixCopy, 
          notesAndCoordinates: updatedCoords 
        };
      } catch (error) {
        console.error('❌ Error applying accidental:', error);
        return { scaleDataMatrix, notesAndCoordinates };
      }
    } else {
      console.log('❌ Failed to find any note to modify');
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
