"use client";
import Container from "@mui/material/Container";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Flow } from "vexflow";
import { useClef } from "../context/ClefContext";
import calculateNotesAndCoordinates from "../lib/calculateNotesAndCoordinates";
import { errorMessages } from "../lib/data/errorMessages";
import {
  bassClefNotesArray,
  trebleClefNotesArray,
} from "../lib/data/noteArray";
import { staveData } from "../lib/data/stavesData";
import { findBarIndex } from "../lib/findBar";
import { handleScaleInteraction } from "../lib/handleScaleInteraction";
import { useButtonStates } from "../lib/hooks/useButtonStates";
import { useNotationClickHandler } from "../lib/hooks/useNotationClickHandler";
import { useNotationRenderer } from "../lib/hooks/useNotationRenderer";
import { useStaffHover } from "../lib/hooks/useStaffHover";
import { initialNotesAndCoordsState } from "../lib/initialStates";
import { toFlatScaleData, toNestedScaleData } from "../lib/scaleDataConverters";
import { setupRendererAndDrawNotes } from "../lib/setupRendererAndDrawNotes";
import {
  NotesAndCoordinatesData,
  ScaleData,
  SimpleScaleData,
  StaveType,
} from "../lib/types";
import CustomButton from "./CustomButton";
import NotationContainer from "./NotationContainer";

const NotateScale = ({
  initialScaleData = [[]],
  onChange,
}: {
  initialScaleData?: ScaleData[][] | SimpleScaleData[];
  onChange?: (scaleData: SimpleScaleData[], scales: string[]) => void;
}) => {
  const container = useRef<HTMLDivElement | null>(null);
  const [staves, setStaves] = useState<StaveType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [notesAndCoordinates, setNotesAndCoordinates] = useState<
    NotesAndCoordinatesData[]
  >([initialNotesAndCoordsState]);

  const { buttonStates, setters, clearAllStates } = useButtonStates();
  const { chosenClef } = useClef();

  // Use the utility function from scaleDataConverters.ts

  // Initialize state after we have access to chosenClef
  const [scaleDataMatrix, setScaleDataMatrix] = useState<ScaleData[][]>([[]]);

  // Create a ref for staves to pass to useStaffHover
  const stavesRef = useRef<StaveType[]>(staves);
  useEffect(() => {
    stavesRef.current = staves;
  }, [staves]);

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

  // Use the staff hover hook
  const scaleFactor = 1.5; // Matches useNotationRenderer default
  const { hoveredStaffElement, mouseMoveHandler, mouseLeaveHandler } =
    useStaffHover({
      containerRef: container,
      stavesRef,
      scaleFactor,
    });

  // Setup the actual render function now that rendererRef is initialized
  renderFunctionRef.current = useCallback(
    (): StaveType[] | undefined =>
      setupRendererAndDrawNotes({
        rendererRef: rendererRef as React.RefObject<
          InstanceType<typeof Flow.Renderer>
        >,
        ...staveData,
        chosenClef,
        staves,
        setStaves,
        scaleDataMatrix,
      }),
    [rendererRef, setStaves, scaleDataMatrix, staves, chosenClef]
  );

  // useEffect to draw hover effect
  useEffect(() => {
    if (
      rendererRef.current &&
      stavesRef.current &&
      stavesRef.current.length > 0
    ) {
      const context = rendererRef.current.getContext();
      const currentStaveObject = stavesRef.current[0];

      // Clear and redraw staves and notes
      context.clear(); // Important: clear before redraw
      if (renderFunctionRef.current) {
        renderFunctionRef.current(); // Redraws staves and notes
      }

      // Draw hover effect if present
      if (hoveredStaffElement) {
        context.save();
        context.fillStyle = "var(--highLightBlue)";

        const staveRenderX = currentStaveObject.getNoteStartX();
        const staveRenderWidth =
          currentStaveObject.getNoteEndX() - staveRenderX;

        if (hoveredStaffElement.type === "line") {
          const lineY = hoveredStaffElement.y;
          context.fillRect(
            staveRenderX,
            lineY - hoveredStaffElement.height / 2,
            staveRenderWidth,
            hoveredStaffElement.height
          );
        } else {
          // otherwise it is a space
          const spaceY = hoveredStaffElement.y; // y is the line above the space
          context.fillRect(
            staveRenderX,
            spaceY, // Start at the line above the space
            staveRenderWidth,
            hoveredStaffElement.height // Height of the space
          );
        }
        context.restore();
      }
    }
  }, [hoveredStaffElement, rendererRef, stavesRef, renderFunctionRef]); // renderFunctionRef dependency needed for redraw

  const { getClickInfo } = useNotationClickHandler({
    containerRef: container,
    staves,
    notesAndCoordinates,
    setOpen,
    setMessage,
  });

  useEffect(() => {
    // Initialize VexFlow staveNote objects if needed
    if (initialScaleData) {
      // Check if it's a flat array of SimpleScaleData or a nested array of ScaleData
      if (Array.isArray(initialScaleData)) {
        if (
          initialScaleData.length > 0 &&
          initialScaleData[0] &&
          "barIndex" in initialScaleData[0]
        ) {
          // It's a flat SimpleScaleData array - convert to nested array with VexFlow objects
          const scaleDataWithVexFlow = toNestedScaleData(
            initialScaleData as SimpleScaleData[],
            chosenClef
          );
          setScaleDataMatrix(scaleDataWithVexFlow);
        } else {
          // It's already a nested ScaleData array
          setScaleDataMatrix(initialScaleData as ScaleData[][]);
        }
      }
    }

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
  }, [initialScaleData, chosenClef]);

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

    // Notify parent of cleared scale data
    if (onChange) {
      onChange([], []);
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

      const barIndex = findBarIndex(staves, userClickX);

      const safeCloneNote = (note: ScaleData): ScaleData => {
        let newStaveNote = null;
        if (note.keys && note.keys.length > 0) {
          newStaveNote = new Flow.StaveNote({
            keys: [...note.keys],
            duration: note.duration || "q",
            clef: chosenClef,
          });
        }
        return {
          keys: note.keys ? [...note.keys] : [],
          duration: note.duration || "q",
          exactX: note.exactX,
          userClickY: note.userClickY,
          staveNote: newStaveNote,
        };
      };

      let scaleDataMatrixCopy = scaleDataMatrix.map((bar) =>
        bar.map((note) => safeCloneNote(note))
      );
      let notesAndCoordinatesCopy = notesAndCoordinates.map((note) => ({
        ...note,
      }));

      if (!scaleDataMatrixCopy[barIndex]) {
        console.error("Invalid bar index:", barIndex);
        return;
      }

      const barOfScaleData = scaleDataMatrixCopy[barIndex];

      const isAccidentalMode =
        buttonStates.isSharpActive || buttonStates.isFlatActive;

      if (isAccidentalMode && scaleDataMatrix[0].length > 0) {
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
      } = handleScaleInteraction(
        foundNoteData,
        notesAndCoordinatesCopy,
        barOfScaleData,
        scaleDataMatrixCopy,
        buttonStates,
        userClickX,
        userClickY,
        barIndex,
        chosenClef,
        setMessage,
        setOpen,
        errorMessages,
        staves[barIndex] // Pass the stave for quantized positioning
      );

      // Use a single batch update to prevent race conditions
      // This ensures the state updates happen together in a single render cycle
      // which prevents the flashing issue with double accidentals
      Promise.resolve().then(() => {
        setScaleDataMatrix([...newScaleDataMatrix]);
        setNotesAndCoordinates([...newNotesAndCoordinates]);
      });

      // Update the scales display and notify parent via onChange - safely extract just the key strings
      try {
        // Extract the note keys for display
        const scaleStrings = newScaleDataMatrix[0]
          .map((note: ScaleData) => {
            const keyString = Array.isArray(note.keys) ? note.keys[0] : "";
            return keyString;
          })
          .filter((note) => note !== "");

        if (onChange) {
          // Pass flat simplified data structure without VexFlow objects
          // Use our utility functions from scaleDataConverters.ts
          onChange(toFlatScaleData(newScaleDataMatrix), scaleStrings);
        }
      } catch (error) {
        console.error("Error updating scale display:", error);
      }
    },
    [scaleDataMatrix, notesAndCoordinates, staves, chosenClef, buttonStates]
  );

  return (
    <>
      <NotationContainer
        containerRef={container}
        onClick={handleClick}
        onMouseMove={mouseMoveHandler}
        onMouseLeave={mouseLeaveHandler}
        open={open}
        setOpen={setOpen}
        message={message}
      >
        <Container
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 0.5,
            paddingTop: 4,
            marginTop: 2,
            width: "760px",
          }}
        >
          <CustomButton
            onClick={() => {
              clearAllStates();
              setters.setIsEnterNoteActive(true);
            }}
            active={buttonStates.isEnterNoteActive}
          >
            Enter Note
          </CustomButton>
          <CustomButton
            onClick={() => {
              clearAllStates();
              setters.setIsEraseNoteActive(true);
            }}
            active={buttonStates.isEraseNoteActive}
          >
            Erase Note
          </CustomButton>
          <CustomButton onClick={eraseMeasures}>Clear All</CustomButton>
          <CustomButton
            onClick={() => {
              clearAllStates();
              setters.setIsSharpActive(true);
              // Force a render to ensure state is updated before next click
              renderFunctionRef.current?.();
            }}
            active={buttonStates.isSharpActive}
          >
            Add Sharp
          </CustomButton>
          <CustomButton
            onClick={() => {
              clearAllStates();
              setters.setIsFlatActive(true);
              renderFunctionRef.current?.();
            }}
            active={buttonStates.isFlatActive}
          >
            Add Flat
          </CustomButton>
          <CustomButton
            onClick={() => {
              clearAllStates();
              setters.setIsEraseAccidentalActive(true);
            }}
            active={buttonStates.isEraseAccidentalActive}
          >
            Erase Accidental
          </CustomButton>
        </Container>
      </NotationContainer>
    </>
  );
};

export default NotateScale;
