import VexFlow from "vexflow";
import createBlankStaves from "./createBlankStaves";
import { RenderStavesAndChordParams, BlankStaves } from "./types";
const { Formatter } = VexFlow.Flow;

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
  if (!chordData.staveNotes || chordData.keys.length === 0) return newStaves;
  if (renderer && context) {
    Formatter.FormatAndDraw(context, staves[barIndex], [chordData.staveNotes]);
  }
  return newStaves;
};
