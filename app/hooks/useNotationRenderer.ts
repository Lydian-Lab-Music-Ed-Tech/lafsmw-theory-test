import { useEffect, useRef, useState } from "react";
import VexFlow from "vexflow";
import { initializeRenderer } from "../lib/initializeRenderer";
import { scaleRenderer } from "../lib/scaleRenderer";
import { StaveType, NotesAndCoordinatesData } from "../lib/typesAndInterfaces";
import { initialNotesAndCoordsState } from "../lib/initialStates";
import calculateNotesAndCoordinates from "../lib/calculateNotesAndCoordinates";
import { bassClefNotesArray, trebleClefNotesArray } from "../lib/data/noteArray";

const { Renderer } = VexFlow.Flow;

interface UseNotationRendererParams {
  renderFunction: () => StaveType[] | undefined;
  chosenClef: string;
  extraDeps?: any[];
  yOffsetBass?: number;
  yOffsetTreble?: number;
  isLine?: boolean;
}

/**
 * A custom hook that encapsulates common notation renderer initialization logic
 */
const useNotationRenderer = ({
  renderFunction,
  chosenClef,
  extraDeps = [],
  yOffsetBass = -3,
  yOffsetTreble = -4,
  isLine = true,
}: UseNotationRendererParams) => {
  const rendererRef = useRef<InstanceType<typeof Renderer> | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const hasScaled = useRef<boolean>(false);
  const isInitialized = useRef<boolean>(false);
  const [staves, setStaves] = useState<StaveType[]>([]);
  const [notesAndCoordinates, setNotesAndCoordinates] = useState<
    NotesAndCoordinatesData[]
  >([initialNotesAndCoordsState]);
  
  // Initialize renderer only once when container is available
  useEffect(() => {
    if (container.current && !isInitialized.current) {
      console.log("Initializing renderer...");
      // Clear any existing content
      container.current.innerHTML = '';
      
      // Initialize the renderer
      initializeRenderer(rendererRef, container);
      
      // Mark as initialized
      isInitialized.current = true;
      
      // Immediately render if renderer is successfully initialized
      if (rendererRef.current) {
        console.log("Renderer initialized successfully, rendering staves...");
        // Set initial size
        rendererRef.current.resize(500, 200);
        
        try {
          const newStave = renderFunction();
          if (newStave) {
            setStaves(newStave);
            calculateNotesAndCoordinates(
              chosenClef,
              setNotesAndCoordinates,
              newStave,
              chosenClef === "bass" ? bassClefNotesArray : trebleClefNotesArray,
              0,
              yOffsetBass,
              yOffsetTreble,
              isLine
            );
          }
        } catch (error) {
          console.error("Error during initial render:", error);
        }
      } else {
        console.error("Failed to initialize renderer");
      }
    }
  }, [container.current]); // Only run when container ref changes

  // Scale the renderer after it's initialized
  useEffect(() => {
    if (container.current && rendererRef.current && !hasScaled.current) {
      console.log("Scaling renderer...");
      scaleRenderer({ container, hasScaled });
    }
  }, [container.current, rendererRef.current]);

  // Re-render when dependencies change and renderer is initialized
  useEffect(() => {
    if (container.current && rendererRef.current && isInitialized.current) {
      console.log("Re-rendering due to dependency changes...");
      try {
        const newStave = renderFunction();
        if (newStave) {
          setStaves(newStave);
          calculateNotesAndCoordinates(
            chosenClef,
            setNotesAndCoordinates,
            newStave,
            chosenClef === "bass" ? bassClefNotesArray : trebleClefNotesArray,
            0,
            yOffsetBass,
            yOffsetTreble,
            isLine
          );
        }
      } catch (error) {
        console.error("Error during re-render:", error);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenClef, ...extraDeps]);

  return {
    rendererRef,
    container,
    staves,
    setStaves,
    notesAndCoordinates,
    setNotesAndCoordinates,
  };
};

export default useNotationRenderer;
