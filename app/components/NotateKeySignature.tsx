/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Container } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import VexFlow from "vexflow";
import SnackbarToast from "../components/SnackbarToast";
import { useClef } from "../context/ClefContext";
import { buildKeySignature } from "../lib/buildKeySignature";
import { useButtonStates } from "../lib/useButtonStates";
import calculateNotesAndCoordinates from "../lib/calculateNotesAndCoordinates";
import { keySigArray } from "../lib/data/keySigArray";
import { staveData } from "../lib/data/stavesData";
import getUserClickInfo from "../lib/getUserClickInfo";
import { handleKeySigInteraction } from "../lib/handleKeySigInteraction";
import { initialNotesAndCoordsState } from "../lib/initialStates";
import { initializeRenderer } from "../lib/initializeRenderer";
import isClickWithinStaveBounds from "../lib/isClickWithinStaveBounds";

import { setupRendererAndDrawStaves } from "../lib/setUpRendererAndDrawStaves";
import { GlyphProps, NotesAndCoordinatesData, StaveType } from "../lib/types";
import CustomButton from "./CustomButton";

const { Renderer } = VexFlow.Flow;

//weird glitch is still happening. Figure out why!

const NotateKeySignature = ({ setKeySignatureNotation }: any) => {
  const rendererRef = useRef<InstanceType<typeof Renderer> | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const hasScaled = useRef(false);
  const [staves, setStaves] = useState<StaveType[]>([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("No note found at click position");
  const [notesAndCoordinates, setNotesAndCoordinates] = useState<
    NotesAndCoordinatesData[]
  >([initialNotesAndCoordsState]);
  const [glyphs, setGlyphs] = useState<GlyphProps[]>([]);
  const [keySig, setKeySig] = useState<string[]>([]);
  const renderCount = useRef(0);
  const { chosenClef } = useClef();
  const { states, setters, clearAllStates } = useButtonStates();

  const renderer = rendererRef.current;
  renderer?.resize(470, 200);

  const context = rendererRef.current?.getContext();

  const renderStaves = useCallback(
    (): StaveType[] | undefined =>
      setupRendererAndDrawStaves({
        rendererRef,
        ...staveData,
        chosenClef,
        staves,
        firstStaveWidth: 450,
      }),
    [chosenClef]
  );

  useEffect(() => {
    initializeRenderer(rendererRef, container);
    const newStaves = renderStaves();
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
  }, [chosenClef, renderStaves]);

  useEffect(() => {
    if (!hasScaled.current && container.current) {
      const svgElement = container.current.querySelector("svg");
      if (svgElement) {
        svgElement.style.transform = "scale(1.5)";
        svgElement.style.transformOrigin = "0 0";
        // Adjust container size to accommodate scaled SVG
        container.current.style.height = "300px"; // 200px * 1.5
        container.current.style.width = "705px"; // 470px * 1.5
        hasScaled.current = true;
      }
    }
  }, []);

  useEffect(() => {
    if (context && staves.length > 0) {
      // Clear and redraw without recreating the staves
      context.clear();
      staves[0].setContext(context).draw();
      buildKeySignature(glyphs, 40, context, staves[0]);

      // Re-apply scaling if needed
      if (container.current) {
        const svgElement = container.current.querySelector("svg");
        if (svgElement) {
          svgElement.style.transform = "scale(1.5)";
          svgElement.style.transformOrigin = "0 0";
        }
      }
    }
  }, [glyphs]);

  useEffect(() => {
    if (setKeySignatureNotation) {
      setKeySignatureNotation(keySig);
    }
  }, [keySig, setKeySignatureNotation]);

  const clearKey = () => {
    setGlyphs([]);
    setKeySig([]);
    initializeRenderer(rendererRef, container);
    const newStaves = renderStaves();
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
    }
    clearAllStates();
  };

  const handleClick = (e: React.MouseEvent) => {
    renderCount.current += 1;
    const { userClickY, userClickX, topStaveYCoord, bottomStaveYCoord } =
      getUserClickInfo(e, container, staves[0]);

    let foundNoteData = notesAndCoordinates.find(
      ({ yCoordinateMin, yCoordinateMax }) =>
        userClickY >= yCoordinateMin && userClickY <= yCoordinateMax
    );

    if (!foundNoteData) {
      setOpen(true);
      setMessage("No note found at click position");
      return;
    }

    foundNoteData = {
      ...foundNoteData,
      userClickX: userClickX,
    };

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

    const { notesAndCoordinates: newNotesAndCoordinates } =
      handleKeySigInteraction(
        notesAndCoordinatesCopy,
        states,
        foundNoteData,
        userClickX,
        userClickY,
        setGlyphs,
        glyphs,
        setKeySig,
        keySig
      );

    setNotesAndCoordinates(() => newNotesAndCoordinates);
  };

  return (
    <>
      <div
        ref={container}
        onClick={handleClick}
        style={{
          overflow: "visible",
          width: "705px",
          height: "300px",
        }}
      />
      <SnackbarToast open={open} setOpen={setOpen} message={message} />

      <Container
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 1,
          padding: 2,
        }}
      >
        <CustomButton
          onClick={() => {
            clearAllStates();
            setters.setIsSharpActive(true);
          }}
          active={states.isSharpActive}
        >
          Add Sharp
        </CustomButton>
        <CustomButton
          onClick={() => {
            clearAllStates();
            setters.setIsFlatActive(true);
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
        <CustomButton onClick={clearKey}>Clear Key</CustomButton>
      </Container>
    </>
  );
};

export default NotateKeySignature;
