/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import VexFlow from "vexflow";
import { useClef } from "../context/ClefContext";
import { useButtonStates } from "../lib/useButtonStates";
import calculateNotesAndCoordinates from "../lib/calculateNotesAndCoordinates";
import { errorMessages } from "../lib/data/errorMessages";
import {
  bassClefNotesArray,
  trebleClefNotesArray,
} from "../lib/data/noteArray";
import { staveData } from "../lib/data/stavesData";
import { findBarIndex } from "../lib/findBar";
import { HandleScaleInteraction } from "../lib/handleScaleInteraction";
import { initialNotesAndCoordsState } from "../lib/initialStates";
import { setupRendererAndDrawNotes } from "../lib/setupRendererAndDrawNotes";
import { NotesAndCoordinatesData, ScaleData, StaveType } from "../lib/types";
import { useNotationRenderer } from "../lib/hooks/useNotationRenderer";
import { useNotationClickHandler } from "../lib/hooks/useNotationClickHandler";
import CustomButton from "./CustomButton";
import NotationContainer from "./NotationContainer";

const NotateScale = ({
  setScales,
}: {
  setScales: Dispatch<SetStateAction<string[]>>;
}) => {
  const container = useRef<HTMLDivElement | null>(null);
  const [staves, setStaves] = useState<StaveType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [notesAndCoordinates, setNotesAndCoordinates] = useState<
    NotesAndCoordinatesData[]
  >([initialNotesAndCoordsState]);
  const [scaleDataMatrix, setScaleDataMatrix] = useState<ScaleData[][]>([[]]);
  const { states, setters, clearAllStates } = useButtonStates();
  const { chosenClef } = useClef();

  // Use our new renderer hook for VexFlow initialization
  const renderFunctionRef = useRef<(() => StaveType[] | undefined) | null>(
    null
  );

  const { rendererRef } = useNotationRenderer({
    containerRef: container,
    renderFunction: () => {
      if (renderFunctionRef.current) {
        return renderFunctionRef.current();
      }
      return undefined;
    },
    width: 470,
    height: 200,
  });

  // Setup the actual render function now that rendererRef is initialized
  renderFunctionRef.current = useCallback(
    (): StaveType[] | undefined =>
      setupRendererAndDrawNotes({
        rendererRef,
        ...staveData,
        chosenClef,
        staves,
        setStaves,
        scaleDataMatrix,
      }),
    [rendererRef, setStaves, scaleDataMatrix, staves, chosenClef]
  );

  // Set up click handler
  const { getClickInfo } = useNotationClickHandler({
    containerRef: container,
    staves,
    notesAndCoordinates,
    setOpen,
    setMessage,
  });

  // Initial load
  useEffect(() => {
    const newStave = renderFunctionRef.current?.();
    if (newStave)
      calculateNotesAndCoordinates(
        chosenClef,
        setNotesAndCoordinates,
        newStave,
        chosenClef === "bass" ? bassClefNotesArray : trebleClefNotesArray,
        0,
        -3,
        -4,
        true
      );
  }, []);

  // Update notes when scale data changes
  useEffect(() => {
    const newStave = renderFunctionRef.current?.();
    if (newStave) {
      calculateNotesAndCoordinates(
        chosenClef,
        setNotesAndCoordinates,
        newStave,
        chosenClef === "bass" ? bassClefNotesArray : trebleClefNotesArray,
        0,
        -3,
        -4,
        true
      );
    }
  }, [scaleDataMatrix, chosenClef]);

  const eraseMeasures = () => {
    setScaleDataMatrix((): ScaleData[][] => {
      return [[]];
    });
    const newStave = renderFunctionRef.current?.();
    if (newStave) {
      calculateNotesAndCoordinates(
        chosenClef,
        setNotesAndCoordinates,
        newStave,
        chosenClef === "bass" ? bassClefNotesArray : trebleClefNotesArray,
        0,
        -3,
        -4,
        true
      );
    }
  };

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const clickInfo = getClickInfo(e);
      if (!clickInfo) {
        console.error("No valid click info found");
        return;
      }

      const { userClickX, userClickY, foundNoteData } = clickInfo;

      // Find which bar was clicked
      const barIndex = findBarIndex(staves, userClickX);

      // Create a safe deep clone that properly handles VexFlow objects
      // We need to specially handle staveNote objects to avoid circular references
      const safeCloneNote = (note: ScaleData): ScaleData => {
        // Create a new StaveNote if needed to avoid circular references
        let newStaveNote = null;
        if (note.keys && note.keys.length > 0) {
          // Create a minimal StaveNote to satisfy the type requirements
          // The real StaveNote will be recreated in HandleScaleInteraction
          newStaveNote = new VexFlow.Flow.StaveNote({
            keys: [...note.keys],
            duration: note.duration || "q",
            clef: chosenClef,
          });
        }

        // Return a properly typed ScaleData object
        return {
          keys: note.keys ? [...note.keys] : [],
          duration: note.duration || "q",
          exactX: note.exactX,
          userClickY: note.userClickY,
          staveNote: newStaveNote, // Add the staveNote property to satisfy TypeScript
        };
      };

      // Create clean copies without circular references
      let scaleDataMatrixCopy = scaleDataMatrix.map((bar) =>
        bar.map((note) => safeCloneNote(note))
      );
      let notesAndCoordinatesCopy = notesAndCoordinates.map((note) => ({
        ...note,
      }));

      // Extract the specific bar data for the clicked bar
      // Make sure it exists to prevent errors
      if (!scaleDataMatrixCopy[barIndex]) {
        console.error("Invalid bar index:", barIndex);
        return;
      }

      // Get bar of scale data with proper deep copy
      const barOfScaleData = scaleDataMatrixCopy[barIndex];

      const isAccidentalMode = states.isSharpActive || states.isFlatActive;

      if (isAccidentalMode && scaleDataMatrix[0].length > 0) {
        // Make sure the bar data has the correct x-coordinates from the most recently rendered state
        for (let i = 0; i < barOfScaleData.length; i++) {
          const originalNote = scaleDataMatrix[barIndex]?.[i];
          if (originalNote && originalNote.exactX !== undefined) {
            // Use the most current exactX value from the rendered note
            barOfScaleData[i].exactX = originalNote.exactX;
          }
        }
      }

      // Process the interaction using our handler function
      const {
        scaleDataMatrix: newScaleDataMatrix,
        notesAndCoordinates: newNotesAndCoordinates,
      } = HandleScaleInteraction(
        foundNoteData,
        notesAndCoordinatesCopy,
        barOfScaleData,
        scaleDataMatrixCopy,
        states,
        userClickX,
        userClickY,
        barIndex,
        chosenClef,
        setMessage,
        setOpen,
        errorMessages
      );

      // We must use setState with a function to ensure we're working with
      // the latest state and properly merge the new values
      setScaleDataMatrix((prevState) => {
        console.log(
          "- Previous state had:",
          prevState.map(
            (bar) =>
              `${bar.length} notes (${bar.map((n) => n?.keys?.[0] || "unknown").join(", ")})`
          )
        );
        console.log(
          "- New state has:",
          newScaleDataMatrix.map(
            (bar) =>
              `${bar.length} notes (${bar.map((n) => n?.keys?.[0] || "unknown").join(", ")})`
          )
        );

        // This ensures we properly replace the state with the new complete state
        return [...newScaleDataMatrix];
      });

      setNotesAndCoordinates((prevCoords) => {
        return [...newNotesAndCoordinates];
      });

      // Update the scales display - safely extract just the key strings
      try {
        const scaleStrings = newScaleDataMatrix[0].map((note: ScaleData) => {
          return Array.isArray(note.keys) ? note.keys.join(", ") : "";
        });
        setScales(scaleStrings);
      } catch (error) {
        console.error("Error updating scale display:", error);
      }
    },
    [scaleDataMatrix, notesAndCoordinates, staves, chosenClef, states]
  );

  return (
    <>
      <NotationContainer
        containerRef={container}
        onClick={handleClick}
        open={open}
        setOpen={setOpen}
        message={message}
      >
        <Container
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            paddingTop: 4,
            marginTop: 2,
          }}
        >
          <CustomButton
            onClick={() => {
              clearAllStates();
              setters.setIsEnterNoteActive(true);
            }}
            active={states.isEnterNoteActive}
          >
            Enter Note
          </CustomButton>
          <CustomButton
            onClick={() => {
              clearAllStates();
              setters.setIsEraseNoteActive(true);
            }}
            active={states.isEraseNoteActive}
          >
            Erase Note
          </CustomButton>
          <CustomButton
            onClick={() => {
              clearAllStates();
              setters.setIsSharpActive(true);
              // Force a render to ensure state is updated before next click
              renderFunctionRef.current?.();
              setTimeout(() => {
                console.log("Button states confirmation after update:", {
                  isSharpActive: states.isSharpActive,
                  isFlatActive: states.isFlatActive,
                  isEnterNoteActive: states.isEnterNoteActive,
                });
              }, 100); // Slightly longer delay to ensure state updates
            }}
            active={states.isSharpActive}
          >
            Add Sharp
          </CustomButton>
          <CustomButton
            onClick={() => {
              clearAllStates();
              setters.setIsFlatActive(true);
              renderFunctionRef.current?.();
              setTimeout(() => {
                console.log("Button states confirmation after update:", {
                  isSharpActive: states.isSharpActive,
                  isFlatActive: states.isFlatActive,
                  isEnterNoteActive: states.isEnterNoteActive,
                });
              }, 100);
            }}
            active={states.isFlatActive}
          >
            Add Flat
          </CustomButton>
          <CustomButton
            onClick={() => {
              clearAllStates();
              setters.setIsEraseAccidentalActive(true);
            }}
            active={states.isEraseAccidentalActive}
          >
            Erase Accidental
          </CustomButton>
          <CustomButton onClick={eraseMeasures}>Clear All</CustomButton>
        </Container>
      </NotationContainer>
    </>
  );
};

export default NotateScale;
