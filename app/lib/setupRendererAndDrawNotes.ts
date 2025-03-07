import VexFlow from "vexflow";
import createBlankStaves from "./createBlankStaves";
import { RenderStavesAndNotesParams, BlankStaves } from "./typesAndInterfaces";
const { Formatter, TickContext } = VexFlow.Flow;

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
        console.log("noteObj from forEach:", noteObj);
        if (noteObj.staveNote) {
          noteObj.staveNote.setStave(currentStave);
          noteObj.staveNote.setContext(context);

          // Position and draw the note at the exact click position
          if (noteObj.exactX) {
            // Create a separate tick context for each note to prevent them from affecting each other
            const tickContext = new TickContext();
            tickContext.addTickable(noteObj.staveNote);

            // Prevent the tick context from doing any formatting that might move notes
            tickContext.preFormat();
            tickContext.setPadding(0); // Set padding to 0 to prevent spacing adjustments

            // Offset correction to align the note with the click position
            const offsetCorrection = -60;

            // Set the x position of the tick context to the exact stored position with offset correction
            tickContext.setX(noteObj.exactX + offsetCorrection);

            noteObj.staveNote.draw();
          } else {
            // If all else fails, use the formatter for notes without exact positions
            Formatter.FormatAndDraw(context, currentStave, [noteObj.staveNote]);
          }
        }
      });
    }
  });

  return newStaves;
};
