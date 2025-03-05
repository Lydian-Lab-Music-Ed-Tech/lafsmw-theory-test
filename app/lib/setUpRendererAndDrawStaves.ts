import createBlankStaves from "./createBlankStaves";
import { BlankStaves, RenderStaves } from "./typesAndInterfaces";

export const setupRendererAndDrawStaves = (
  params: RenderStaves
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
    chosenClef,
    firstStaveWidth,
    keySig,
    setStaves,
  } = params;
  
  // Early return if renderer is not available
  if (!rendererRef?.current) {
    console.error("Renderer reference is not available");
    return undefined;
  }
  
  const renderer = rendererRef.current;
  
  try {
    // Resize the renderer
    renderer.resize(rendererWidth, rendererHeight);
    
    // Get the context
    const context = renderer.getContext();
    
    if (!context) {
      console.error("Failed to get context from renderer");
      return undefined;
    }
    
    // Set font and clear
    context.setFont(font, fontSize * 1.5);
    context.clear();
    
    let newStaves;
    console.log("Renderer Ref:", rendererRef);
    console.log("Renderer:", renderer);
    console.log("Context:", context);
    console.log("Parameters:", {
      numStaves,
      font,
      fontSize,
      rendererWidth,
      rendererHeight,
      yPositionOfStaves,
      xPositionOfStaves,
      chosenClef,
      firstStaveWidth,
      keySig,
    });

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
    
    console.log("New Staves:", newStaves);
    
    // If setStaves function is provided, use it to update the staves state
    if (setStaves) {
      setStaves(newStaves);
      console.log("Staves state updated.");
    }
    
    return newStaves;
  } catch (error) {
    console.error("Error in setupRendererAndDrawStaves:", error);
    return undefined;
  }
};
