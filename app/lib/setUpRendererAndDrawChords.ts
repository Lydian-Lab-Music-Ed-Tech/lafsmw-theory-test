import { Flow } from "vexflow";
import createBlankStaves from "./createBlankStaves";
import { BlankStaves, RenderStavesAndChordParams } from "./types";

const { Formatter } = Flow;

export const setupRendererAndDrawChords = (
  params: RenderStavesAndChordParams
): BlankStaves | undefined => {
  const {
    rendererRef,
    font,
    fontSize,
    numStaves,
    rendererWidth,
    rendererHeight,
    yPositionOfStaves,
    xPositionOfStaves,
    chosenClef: clef,
    firstStaveWidth,
    keySig,
    setStaves,
    chordData,
    staves,
    barIndex,
  } = params;

  const renderer = rendererRef?.current;
  renderer?.resize(rendererWidth, rendererHeight);

  const context = renderer && renderer.getContext();
  context?.setFont(font, fontSize * 1.5);
  context?.clear();

  let newStaves;

  if (context && rendererRef) {
    newStaves = createBlankStaves({
      numStaves,
      context,
      firstStaveWidth,
      x: xPositionOfStaves,
      y: yPositionOfStaves,
      regularStaveWidth: 300,
      chosenClef: clef,
      keySig,
    });
    setStaves(newStaves);
  }
  // Only draw if we have valid staves and chord data
  if (!chordData?.staveNotes || !chordData?.keys?.length) return newStaves;

  // Make sure all required objects exist before drawing
  if (
    renderer &&
    context &&
    staves &&
    staves.length > 0 &&
    staves[barIndex] &&
    chordData.staveNotes
  ) {
    try {
      Formatter.FormatAndDraw(context, staves[barIndex], [
        chordData.staveNotes,
      ]);
    } catch (error) {
      console.error("Error formatting and drawing chord:", error);
    }
  }
  return newStaves;
};
