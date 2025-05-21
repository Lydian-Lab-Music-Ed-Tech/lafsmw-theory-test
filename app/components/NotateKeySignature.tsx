"use client";
import { Container } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Flow } from "vexflow";
import { useClef } from "../context/ClefContext";
import { buildKeySignature } from "../lib/buildKeySignature";
import calculateNotesAndCoordinates from "../lib/calculateNotesAndCoordinates";
import { keySigArray } from "../lib/data/keySigArray";
import { staveData } from "../lib/data/stavesData";
import { handleKeySigInteraction } from "../lib/handleKeySigInteraction";
import { useButtonStates } from "../lib/hooks/useButtonStates";
import { useNotationClickHandler } from "../lib/hooks/useNotationClickHandler";
import { useNotationRenderer } from "../lib/hooks/useNotationRenderer";
import { initialNotesAndCoordsState } from "../lib/initialStates";
import isClickWithinStaveBounds from "../lib/isClickWithinStaveBounds";
import { setupRendererAndDrawStaves } from "../lib/setUpRendererAndDrawStaves";
import {
  GlyphProps,
  NotateKeySignatureProps,
  NotesAndCoordinatesData,
  StaveType,
} from "../lib/types";
import CustomButton from "./CustomButton";
import NotationContainer from "./NotationContainer";

const NotateKeySignature = ({
  initialKeySignature = [],
  initialGlyphs = [],
  onChange,
}: NotateKeySignatureProps) => {
  const container = useRef<HTMLDivElement | null>(null);
  const [staves, setStaves] = useState<StaveType[]>([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("No note found at click position");
  const [notesAndCoordinates, setNotesAndCoordinates] = useState<
    NotesAndCoordinatesData[]
  >([initialNotesAndCoordsState]);
  const [glyphs, setGlyphs] = useState<GlyphProps[]>(initialGlyphs || []);
  const [keySig, setKeySig] = useState<string[]>(initialKeySignature);
  const renderCount = useRef(0);
  const { chosenClef } = useClef();
  const { buttonStates, setters, clearAllStates } = useButtonStates();

  // State for hover effect
  const [hoveredStaffElement, setHoveredStaffElement] = useState<{
    type: "line" | "space";
    index: number; // 0-indexed line or space
    y: number; // y-coordinate for drawing highlight
    height: number; // height for drawing highlight
  } | null>(null);

  // Set up rendering function with the circular dependency pattern
  const renderFunctionRef = useRef<(() => StaveType[] | undefined) | null>(
    null
  );

  // Initialize the renderer with a stable renderFunction that uses renderFunctionRef
  const { rendererRef, render } = useNotationRenderer({
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

  const context = rendererRef.current?.getContext();

  // Define the actual rendering logic - this will be called via the ref
  renderFunctionRef.current = useCallback((): StaveType[] | undefined => {
    if (!rendererRef.current) return undefined;

    return setupRendererAndDrawStaves({
      rendererRef: rendererRef as React.RefObject<
        InstanceType<typeof Flow.Renderer>
      >,
      ...staveData,
      chosenClef,
      staves,
      firstStaveWidth: 450,
    });
  }, [chosenClef, staves, rendererRef]);

  // Set up click handler
  const { getClickInfo } = useNotationClickHandler({
    containerRef: container,
    staves,
    notesAndCoordinates,
    setOpen,
    setMessage,
  });

  // Initial load - happens only when chosenClef changes, not on every render
  useEffect(() => {
    const newStaves = render();
    if (newStaves) {
      setStaves(newStaves);
      calculateNotesAndCoordinates(
        chosenClef,
        setNotesAndCoordinates,
        newStaves,
        keySigArray,
        0,
        1,
        0
      );
    }
  }, [chosenClef, render]);

  // Mouse move handler for hover effect
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (
        !rendererRef.current || // Check rendererRef first
        !container.current ||
        !staves ||
        staves.length === 0 ||
        !staves[0]
      ) {
        if (hoveredStaffElement !== null) setHoveredStaffElement(null);
        return;
      }

      const currentStaveObject = staves[0];
      const rect = container.current.getBoundingClientRect();
      const mouseYInScaledCoords = event.clientY - rect.top;
      const scaleFactor = 1.5; // From useNotationRenderer default
      const mouseY = mouseYInScaledCoords / scaleFactor; // Unscale the coordinate

      const topBound =
        currentStaveObject.getYForLine(0) -
        currentStaveObject.getSpacingBetweenLines();
      const bottomBound =
        currentStaveObject.getYForLine(currentStaveObject.getNumLines() - 1) +
        currentStaveObject.getSpacingBetweenLines();

      if (mouseY < topBound || mouseY > bottomBound) {
        if (hoveredStaffElement !== null) setHoveredStaffElement(null);
        return;
      }

      const vexFlowLineNum = currentStaveObject.getLineForY(mouseY);
      const roundedToHalf = Math.round(vexFlowLineNum * 2) / 2;

      let newHoveredElement: typeof hoveredStaffElement = null;

      // Check if within the main staff lines/spaces
      if (roundedToHalf >= 0 && roundedToHalf < currentStaveObject.getNumLines()) {
        if (Number.isInteger(roundedToHalf)) {
          // Line
          const lineIndex = roundedToHalf;
          newHoveredElement = {
            type: "line",
            index: lineIndex,
            y: currentStaveObject.getYForLine(lineIndex),
            height: 2, // Visual height for line highlight
          };
        } else {
          // Space
          const spaceIndex = Math.floor(roundedToHalf); // Index of the line above the space
          newHoveredElement = {
            type: "space",
            index: spaceIndex,
            y: currentStaveObject.getYForLine(spaceIndex), // Y of the line above the space
            height: currentStaveObject.getSpacingBetweenLines(),
          };
        }
      }

      if (
        JSON.stringify(hoveredStaffElement) !==
        JSON.stringify(newHoveredElement)
      ) {
        setHoveredStaffElement(newHoveredElement);
      }
    },
    [staves, container, hoveredStaffElement] // Keep hoveredStaffElement for the stringify comparison logic
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredStaffElement(null);
  }, []);

  // This is to update glyphs when changed AND draw hover effect
  useEffect(() => {
    if (context && staves.length > 0 && staves[0]) {
      const currentStaveObject = staves[0];
      context.clear();
      currentStaveObject.setContext(context).draw();
      buildKeySignature(glyphs, 40, context, currentStaveObject);

      // Draw hover effect
      if (hoveredStaffElement) {
        context.save();
        context.fillStyle = "rgba(173, 216, 230, 0.4)"; // Light blue with some transparency

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
        } else if (hoveredStaffElement.type === "space") {
          context.fillRect(
            staveRenderX,
            hoveredStaffElement.y, // y is the top line of the space
            staveRenderWidth,
            hoveredStaffElement.height // height is spacingBetweenLines
          );
        }
        context.restore();
      }
    }
  }, [context, staves, glyphs, hoveredStaffElement]); // Dependencies for redraw

  const clearKey = () => {
    setGlyphs([]);
    setKeySig([]);
    if (onChange) onChange([], []);
    clearAllStates();

    const newStaves = render();
    if (newStaves) {
      calculateNotesAndCoordinates(
        chosenClef,
        setNotesAndCoordinates,
        newStaves,
        keySigArray,
        0,
        1,
        0
      );

      if (context) {
        context.clear();
        newStaves[0].setContext(context).draw();
      }
    }
  };

  // Handle click events:
  const handleClick = (e: React.MouseEvent) => {
    renderCount.current += 1;

    const clickInfo = getClickInfo(e);
    if (!clickInfo) return;

    const {
      userClickX,
      userClickY,
      topStaveYCoord,
      bottomStaveYCoord,
      foundNoteData,
    } = clickInfo;

    if (
      !isClickWithinStaveBounds(
        staves[0],
        topStaveYCoord,
        bottomStaveYCoord,
        userClickX,
        userClickY,
        setMessage,
        setOpen
      )
    ) {
      return;
    }

    let notesAndCoordinatesCopy = [...notesAndCoordinates];

    // This will update glyphs via setGlyphs internally AND return the updated glyphs
    const { notesAndCoordinates: newNotesAndCoordinates, updatedGlyphs } =
      handleKeySigInteraction(
        notesAndCoordinatesCopy,
        buttonStates,
        foundNoteData,
        userClickX,
        userClickY,
        setGlyphs,
        glyphs,
        setKeySig,
        keySig
      );

    setNotesAndCoordinates(newNotesAndCoordinates);

    // Immediately draw with our manually calculated updated glyphs
    // This ensures we see the update immediately, not on the next click
    if (context && staves.length > 0) {
      context.clear();
      staves[0].setContext(context).draw();
      buildKeySignature(updatedGlyphs, 40, context, staves[0]);
    }

    // Call onChange with updated keySig value
    if (onChange) {
      // If we're adding an accidental, we need to calculate the updated keySig value
      if (buttonStates.isSharpActive || buttonStates.isFlatActive) {
        const noteBase = foundNoteData.note.charAt(0);
        const accidental = buttonStates.isSharpActive ? "#" : "b";
        const noteWithAccidental = `${noteBase}${accidental}`;

        // Calculate the updated keySig value
        const updatedKeySig = keySig.filter(
          (note) => note.charAt(0) !== noteBase
        );
        updatedKeySig.push(noteWithAccidental);

        // Call onChange with the calculated value
        onChange(updatedKeySig, updatedGlyphs);
      } else if (buttonStates.isEraseAccidentalActive) {
        // For erasing, we can calculate the updated keySig by removing the note
        const noteBase = foundNoteData.note.charAt(0);
        const updatedKeySig = keySig.filter(
          (note) => note.charAt(0) !== noteBase
        );

        // Call onChange with the calculated value
        onChange(updatedKeySig, updatedGlyphs);
      } else {
        // For other cases, use the current keySig
        onChange(keySig, updatedGlyphs);
      }
    }
  };

  return (
    <>
      <NotationContainer
        containerRef={container}
        onClick={handleClick}
        onMouseMove={handleMouseMove} // Added mouse move handler
        onMouseLeave={handleMouseLeave} // Added mouse leave handler
        open={open}
        setOpen={setOpen}
        message={message}
      >
        <Container
          disableGutters={false}
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 1,
            padding: 2,
            width: "750px",
          }}
        >
          <CustomButton
            onClick={() => {
              clearAllStates();
              setters.setIsSharpActive(true);
            }}
            active={buttonStates.isSharpActive}
          >
            Add Sharp
          </CustomButton>
          <CustomButton
            onClick={() => {
              clearAllStates();
              setters.setIsFlatActive(true);
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
          <CustomButton onClick={clearKey}>Clear Key</CustomButton>
        </Container>
      </NotationContainer>
    </>
  );
};

export default NotateKeySignature;
