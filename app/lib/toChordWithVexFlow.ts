import { Flow } from "vexflow";
import type { StaveNote } from "vexflow";
import { Chord, SimpleChordData } from "./types";

// This is an important function that converts a SimpleChordData object to a Chord object with VexFlow objects
// It is used in NotateChord.tsx and NotateScale.tsx
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

    try {
      // Make a defensive copy of the keys array
      const keysCopy = [...simpleData.keys].filter(
        (key) => key && typeof key === "string"
      );

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
          if (noteBase.length === 2 && noteBase.slice(-1) === "#") {
            staveNote?.addModifier(new Flow.Accidental("#"), index);
          } else if (noteBase.length === 2 && noteBase.slice(-1) === "b") {
            staveNote?.addModifier(new Flow.Accidental("b"), index);
          } else if (noteBase.length === 3 && noteBase.slice(-2) === "bb") {
            staveNote?.addModifier(new Flow.Accidental("bb"), index);
          } else if (noteBase.length === 3 && noteBase.slice(-2) === "##") {
            staveNote?.addModifier(new Flow.Accidental("##"), index);
          }
        });
      }
    } catch (error) {
      console.error("Error creating stave note for chord:", error);
      staveNote = null;
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
