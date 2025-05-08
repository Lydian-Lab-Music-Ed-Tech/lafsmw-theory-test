import { Flow } from "vexflow";
import { ScaleData, SimpleScaleData } from "./types";

// Converts a 2D ScaleData array to a flat SimpleScaleData array for storage
// Removes VexFlow objects to avoid circular references
export const toFlatScaleData = (data: ScaleData[][]): SimpleScaleData[] => {
  try {
    const flatData: SimpleScaleData[] = [];

    // Process each bar
    for (let barIndex = 0; barIndex < data.length; barIndex++) {
      const bar = data[barIndex];
      if (!Array.isArray(bar)) {
        continue;
      }

      // For each note in the bar, create a SimpleScaleData object
      for (let noteIndex = 0; noteIndex < bar.length; noteIndex++) {
        const note = bar[noteIndex];
        if (
          !note ||
          typeof note !== "object" ||
          !note.keys ||
          note.keys.length === 0
        ) {
          continue;
        }

        flatData.push({
          keys: note.keys,
          duration: note.duration || "q",
          exactX: note.exactX !== undefined ? note.exactX : 0,
          userClickY: note.userClickY !== undefined ? note.userClickY : 0,
          barIndex,
          noteIndex,
        });
      }
    }

    return flatData;
  } catch (error) {
    console.error("Error converting scale data to flat format:", error);
    return [];
  }
};

// Converts a flat SimpleScaleData array to a 2D ScaleData array with VexFlow objects
export const toNestedScaleData = (
  flatData: SimpleScaleData[],
  chosenClef: string
): ScaleData[][] => {
  if (!flatData || !flatData.length) {
    return [[]];
  }

  // Find the maximum barIndex to determine array size
  const maxBarIndex = Math.max(...flatData.map((note) => note.barIndex || 0));

  // Create array of arrays
  const result: ScaleData[][] = Array(maxBarIndex + 1)
    .fill(null)
    .map(() => []);

  // Place each note in the correct position
  for (let i = 0; i < flatData.length; i++) {
    const note = flatData[i];
    if ((note.barIndex || 0) >= 0 && note.keys && note.keys.length > 0) {
      // Create VexFlow StaveNote for UI rendering
      let staveNote = null;
      try {
        staveNote = new Flow.StaveNote({
          keys: [...note.keys],
          duration: note.duration || "q",
          clef: chosenClef,
        });

        // Add accidentals if needed
        const keyToCheck = note.keys[0];
        if (keyToCheck && keyToCheck.includes("#")) {
          staveNote.addModifier(new Flow.Accidental("#"), 0);
        } else if (keyToCheck && keyToCheck.includes("b")) {
          staveNote.addModifier(new Flow.Accidental("b"), 0);
        }
      } catch (error) {
        console.error("Error creating stave note in reconstruction:", error);
      }

      // Create the full ScaleData object with staveNote
      const scaleData: ScaleData = {
        keys: note.keys,
        duration: note.duration,
        exactX: note.exactX,
        userClickY: note.userClickY,
        staveNote: staveNote,
      };

      // Ensure we have indexes for the proper position
      while (result[note.barIndex || 0].length <= (note.noteIndex || 0)) {
        result[note.barIndex || 0].push({
          keys: [],
          duration: "q",
          exactX: 0,
          userClickY: 0,
          staveNote: null,
        });
      }

      result[note.barIndex || 0][note.noteIndex || 0] = scaleData;
    }
  }

  return result;
};
