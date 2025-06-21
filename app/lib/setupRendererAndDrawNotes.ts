import { Flow } from "vexflow";
import createBlankStaves from "./createBlankStaves";
import { BlankStaves, RenderStavesAndNotesParams } from "./types";

export const setupRendererAndDrawNotes = (
  params: RenderStavesAndNotesParams
): BlankStaves => {
  const {
    rendererRef,
    font,
    fontSize,
    numStaves,
    rendererWidth,
    rendererHeight,
    yPositionOfStaves,
    xPositionOfStaves,
    chosenClef,
    firstStaveWidth,
    keySig,
    setStaves,
    scaleDataMatrix,
    staves,
  } = params;

  const renderer = rendererRef?.current;
  renderer?.resize(rendererWidth, rendererHeight);

  const context = renderer && renderer.getContext();
  context?.setFont(font, fontSize * 1.5);
  context?.clear();

  let newStaves: BlankStaves = [];

  if (context && rendererRef) {
    newStaves = createBlankStaves({
      numStaves,
      context,
      firstStaveWidth,
      x: xPositionOfStaves,
      y: yPositionOfStaves,
      regularStaveWidth: 300,
      chosenClef,
      keySig,
    });
    setStaves(newStaves);
  }

  if (!scaleDataMatrix) return newStaves;

  // Draw each stave
  if (newStaves && context) {
    newStaves.forEach((stave) => {
      stave.setContext(context).draw();
    });
  }

  // Draw notes at their exact positions instead of using the formatter
  scaleDataMatrix.forEach((barOfNoteObjects, index) => {
    if (barOfNoteObjects && barOfNoteObjects.length > 0 && context) {
      const currentStave = staves[index] || newStaves[index];

      barOfNoteObjects.forEach((noteObj) => {
        if (noteObj.keys && noteObj.keys[0] && context) {
          // Create a new StaveNote instance for each note data object
          const newStaveNote = new Flow.StaveNote({
            keys: noteObj.keys,
            duration: noteObj.duration || "q",
            clef: chosenClef,
          });

          // Add accidentals based on the note key string, similar to toChordWithVexFlow
          const noteKey = noteObj.keys[0];
          const noteBase = noteKey.split("/")[0];

          if (noteBase.length === 2 && noteBase.slice(-1) === "#") {
            newStaveNote.addModifier(new Flow.Accidental("#"), 0);
          } else if (noteBase.length === 2 && noteBase.slice(-1) === "b") {
            newStaveNote.addModifier(new Flow.Accidental("b"), 0);
          } else if (noteBase.length === 3 && noteBase.slice(-2) === "bb") {
            newStaveNote.addModifier(new Flow.Accidental("bb"), 0);
          } else if (noteBase.length === 3 && noteBase.slice(-2) === "##") {
            newStaveNote.addModifier(new Flow.Accidental("##"), 0);
          }

          // Assign the newly created and configured StaveNote back to the object
          noteObj.staveNote = newStaveNote;

          // Set stave and context for the new StaveNote
          noteObj.staveNote.setStave(currentStave);
          noteObj.staveNote.setContext(context);

          // Position and draw the note
          if (typeof noteObj.exactX === "number") {
            const tickContext = new Flow.TickContext();
            tickContext.addTickable(noteObj.staveNote);
            tickContext.preFormat();
            tickContext.setPadding(0);
            const offsetCorrection = -60; // This offset might need review or be made more dynamic
            tickContext.setX(noteObj.exactX + offsetCorrection);
            noteObj.staveNote.draw();
          } else {
            // Fallback for notes without exact positions (should ideally not happen for user-placed notes)
            Flow.Formatter.FormatAndDraw(context, currentStave, [
              noteObj.staveNote,
            ]);
          }
        }
      });
    }
  });

  return newStaves;
};
