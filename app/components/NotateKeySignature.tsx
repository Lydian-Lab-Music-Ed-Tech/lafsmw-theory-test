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
  }, [chosenClef]);

  // This is to update glyphs when changed
  useEffect(() => {
    if (context && staves.length > 0) {
      context.clear();
      staves[0].setContext(context).draw();
      buildKeySignature(glyphs, 40, context, staves[0]);
    }
  }, [glyphs, context, staves]);

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
        open={open}
        setOpen={setOpen}
        message={message}
      >
        <Container
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 1,
            padding: 2,
            marginTop: 4,
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
