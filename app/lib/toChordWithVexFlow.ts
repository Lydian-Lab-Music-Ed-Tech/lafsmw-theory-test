import { Flow } from "vexflow";
import type { StaveNote } from "vexflow";
import { Chord, SimpleChordData } from "./types";

// Converts a SimpleChordData object to a Chord object with VexFlow objects
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
    let staveNote: StaveNote | null = null;

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

            const [noteBase] = key.split("/");
            const accidentalMatch = noteBase.match(/([#b]+)/);

            if (accidentalMatch) {
              const accidental = accidentalMatch[0];
              // Handle double accidentals
              if (accidental === "##" || accidental === "bb") {
                staveNote?.addModifier(new Flow.Accidental(accidental), index);
              }
              // Handle single accidentals
              else if (accidental === "#" || accidental === "b") {
                staveNote?.addModifier(new Flow.Accidental(accidental), index);
              }
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
