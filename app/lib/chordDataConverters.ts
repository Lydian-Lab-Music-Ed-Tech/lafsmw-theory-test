import { Flow } from "vexflow";
import { Chord, SimpleChordData } from "./types";

/**
 * Converts a Chord object to a SimpleChordData object for storage
 * Removes VexFlow objects to avoid circular references
 *
 * @param chordData Chord object with potential VexFlow objects
 * @returns SimpleChordData object without VexFlow objects
 */
export const toSimpleChordData = (chordData: Chord): SimpleChordData => {
  try {
    // Extract only the serializable properties
    const simpleData: SimpleChordData = {
      keys: [...chordData.keys],
      duration: chordData.duration,
      userClickY: chordData.userClickY || 0,
      // Omit staveNotes to avoid circular references
    };

    return simpleData;
  } catch (error) {
    console.error("Error converting chord data to simple format:", error);
    return {
      keys: [],
      duration: "w",
      userClickY: 0,
    };
  }
};

/**
 * Converts a SimpleChordData object to a Chord object with VexFlow objects
 *
 * @param simpleData SimpleChordData object without VexFlow objects
 * @param chosenClef Current clef for creating VexFlow objects
 * @returns Chord object with VexFlow StaveNote objects
 */
export const toChordWithVexFlow = (
  simpleData: SimpleChordData,
  chosenClef: string
): Chord => {
  if (!simpleData || !simpleData.keys || simpleData.keys.length === 0) {
    return {
      keys: [],
      duration: "w",
      staveNotes: null,
      userClickY: 0,
    };
  }

  try {
    // Create VexFlow StaveNote for UI rendering
    let staveNote = null;

    // Only attempt to create a StaveNote if we have valid keys
    if (simpleData.keys && simpleData.keys.length > 0) {
      try {
        // Make a defensive copy of the keys array
        const keysCopy = [...simpleData.keys].filter(
          (key) => key && typeof key === "string"
        );

        // Only proceed if we have valid keys
        if (keysCopy.length > 0) {
          staveNote = new Flow.StaveNote({
            keys: keysCopy,
            duration: simpleData.duration || "w",
            clef: chosenClef,
          });

          // Add accidentals if needed
          keysCopy.forEach((key, index) => {
            if (!key) return;

            const noteBase = key.split("/")[0];

            // Check for accidentals and add them
            if (noteBase.includes("#")) {
              staveNote.addModifier(new Flow.Accidental("#"), index);
            } else if (noteBase.includes("b") && noteBase.length > 1) {
              staveNote.addModifier(new Flow.Accidental("b"), index);
            }
          });
        }
      } catch (error) {
        console.error("Error creating stave note for chord:", error);
        staveNote = null;
      }
    }

    // Create the full Chord object with staveNote
    const chordData: Chord = {
      keys: simpleData.keys,
      duration: simpleData.duration || "w",
      staveNotes: staveNote,
      userClickY: simpleData.userClickY || 0,
    };

    return chordData;
  } catch (error) {
    console.error("Error converting simple data to chord:", error);
    return {
      keys: [],
      duration: "w",
      staveNotes: null,
      userClickY: 0,
    };
  }
};

/**
 * Helper function to extract chord strings from SimpleChordData
 * Used for display purposes
 *
 * @param simpleData SimpleChordData object
 * @returns Array of note strings
 */
export const extractChordStrings = (simpleData: SimpleChordData): string[] => {
  return simpleData.keys || [];
};
