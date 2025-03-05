import VexFlow from "vexflow";
import createBlankStaves from "./createBlankStaves";
import { RenderStavesAndNotesParams } from "./typesAndInterfaces";
const { Formatter } = VexFlow.Flow;
import type { StaveNote } from "vexflow";

export const setupRendererAndDrawNotes = (
  params: RenderStavesAndNotesParams
): any => {
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
  } = params;
  
  // Early return if renderer is not available
  if (!rendererRef?.current) {
    console.error("Renderer reference is not available in setupRendererAndDrawNotes");
    return undefined;
  }
  
  const renderer = rendererRef.current;
  
  try {
    // Resize the renderer
    renderer.resize(rendererWidth, rendererHeight);
    
    // Get the context
    const context = renderer.getContext();
    
    if (!context) {
      console.error("Failed to get context from renderer in setupRendererAndDrawNotes");
      return undefined;
    }
    
    // Set font and clear
    context.setFont(font, fontSize * 1.5);
    context.clear();
    
    let newStaves;
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
      if (setStaves) {
        setStaves(newStaves);
      }
    }
    
    // If there's no scale data, just return the staves
    if (!scaleDataMatrix) {
      return newStaves;
    }
    
    // Format and draw the notes for each bar
    scaleDataMatrix.forEach((barOfNoteObjects, index) => {
      if (barOfNoteObjects) {
        const staveNotes = barOfNoteObjects
          .map(({ staveNote }) => staveNote)
          .filter(Boolean) as StaveNote[];
          
        if (staveNotes.length > 0 && context && newStaves && newStaves.length > index) {
          Formatter.FormatAndDraw(context, newStaves[index], staveNotes);
        }
      }
    });
    
    return newStaves;
  } catch (error) {
    console.error("Error in setupRendererAndDrawNotes:", error);
    return undefined;
  }
};
