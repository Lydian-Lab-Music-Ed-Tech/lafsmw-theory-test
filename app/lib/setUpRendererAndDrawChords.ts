import VexFlow from "vexflow";
import createBlankStaves from "./createBlankStaves";
import { RenderStavesAndChordParams, BlankStaves } from "./typesAndInterfaces";
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
    barIndex,
  } = params;
  
  // Early return if renderer is not available
  if (!rendererRef?.current) {
    console.error("Renderer reference is not available in setupRendererAndDrawChords");
    return undefined;
  }
  
  const renderer = rendererRef.current;
  
  try {
    // Resize the renderer
    renderer.resize(rendererWidth, rendererHeight);
    
    // Get the context
    const context = renderer.getContext();
    
    if (!context) {
      console.error("Failed to get context from renderer in setupRendererAndDrawChords");
      return undefined;
    }
    
    // Set font and clear
    context.setFont(font, fontSize * 1.5);
    context.clear();
    
    let newStaves = createBlankStaves({
      numStaves,
      context,
      firstStaveWidth,
      x: xPositionOfStaves,
      y: yPositionOfStaves,
      regularStaveWidth: 300,
      chosenClef: clef,
      keySig,
    });
    
    if (setStaves) {
      setStaves(newStaves);
    }
    
    // If there are no chord data or keys, just return the staves
    if (!chordData.staveNotes || chordData.keys.length === 0) {
      return newStaves;
    }
    
    // Format and draw the chord notes
    if (newStaves && newStaves.length > barIndex) {
      Formatter.FormatAndDraw(context, newStaves[barIndex], [chordData.staveNotes]);
    } else {
      console.warn("Invalid barIndex or staves not created properly");
    }
    
    return newStaves;
  } catch (error) {
    console.error("Error in setupRendererAndDrawChords:", error);
    return undefined;
  }
};
