/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import VexFlow from "vexflow";
import SnackbarToast from "../components/SnackbarToast";
import { useClef } from "../context/ClefContext";
import { modifyKeySigActionTypes } from "../lib/actionTypes";
import { buildKeySignature } from "../lib/buildKeySignature";
import { buttonGroup, clearKeySignature } from "../lib/buttonsAndButtonGroups";
import calculateNotesAndCoordinates from "../lib/calculateNotesAndCoordinates";
import { keySigArray } from "../lib/data/keySigArray";
import { staveData } from "../lib/data/stavesData";
import getUserClickInfo from "../lib/getUserClickInfo";
import { handleKeySigInteraction } from "../lib/handleKeySigInteraction";
import {
  initialNotesAndCoordsState,
  keySigInitialState,
} from "../lib/initialStates";
import { initializeRenderer } from "../lib/initializeRenderer";
import isClickWithinStaveBounds from "../lib/isClickWithinStaveBounds";
import { reducer } from "../lib/reducer";
import { setupRendererAndDrawStaves } from "../lib/setUpRendererAndDrawStaves";
import {
  GlyphProps,
  NotesAndCoordinatesData,
  StaveType,
} from "../lib/typesAndInterfaces";
import CustomButton from "./CustomButton";
import { Container } from "@mui/material";

const { Renderer } = VexFlow.Flow;

//weird glitch is still happening. Figure out why!

const NotateKeySignature = ({ handleKeySig }: any) => {
  const rendererRef = useRef<InstanceType<typeof Renderer> | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const hasScaled = useRef(false);
  const [staves, setStaves] = useState<StaveType[]>([]);
  const [glyphs, setGlyphs] = useState<GlyphProps[]>([]);
  const [open, setOpen] = useState(false);
  const { chosenClef } = useClef();
  const [message, setMessage] = useState("");
  const [state, dispatch] = useReducer(reducer, keySigInitialState);
  const [keySig, setKeySig] = useState<string[]>([]);
  const [notesAndCoordinates, setNotesAndCoordinates] = useState<
    NotesAndCoordinatesData[]
  >([initialNotesAndCoordsState]);
  const renderCount = useRef(0);

  const keySigButtonGroup = useMemo(
    () => buttonGroup(dispatch, state, modifyKeySigActionTypes),
    [dispatch, state]
  );

  const renderer = rendererRef.current;
  renderer?.resize(470, 200);

  const context = rendererRef.current?.getContext();

  const renderStaves = useCallback(
    (): StaveType[] | undefined =>
      setupRendererAndDrawStaves({
        rendererRef,
        ...staveData,
        chosenClef,
        firstStaveWidth: 450,
        staves,
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
    console.log("Key signature state changed:", keySig);
  }, [keySig]);

  useEffect(() => {
    // Pass the updated key signature to the parent component whenever it changes
    if (handleKeySig) {
      console.log("keySig from NotateKeySignature useEffect (will pass to parent):", keySig);
      handleKeySig(keySig);
    }
  }, [keySig, handleKeySig]);

  const clearKey = () => {
    clearKeySignature(setGlyphs, rendererRef, container), setKeySig(() => []);
    const newStaves = renderStaves();
    if (newStaves) {
      if (newStaves)
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
    dispatch({ type: "CLEAR_ALL" });
  };

  const handleClick = (e: React.MouseEvent) => {
    renderCount.current += 1;
    console.log(`Handling click, render count: ${renderCount.current}`);
    const { userClickY, userClickX, topStaveYCoord, bottomStaveYCoord } =
      getUserClickInfo(e, container, staves[0]);

    let foundNoteData = notesAndCoordinates.find(
      ({ yCoordinateMin, yCoordinateMax }) =>
        userClickY >= yCoordinateMin && userClickY <= yCoordinateMax
    );

    if (!foundNoteData) {
      console.log("No note found at click position");
      return;
    } else {
      foundNoteData = {
        ...foundNoteData,
        userClickX: userClickX,
      };
      console.log("Found note data:", foundNoteData.note);
    }

    isClickWithinStaveBounds(
      staves[0],
      topStaveYCoord,
      bottomStaveYCoord,
      userClickX,
      userClickY,
      setMessage,
      setOpen
    );

    let notesAndCoordinatesCopy = [...notesAndCoordinates];
    console.log("Current key sig before interaction:", keySig);
    
    const { notesAndCoordinates: newNotesAndCoordinates } =
      handleKeySigInteraction(
        notesAndCoordinatesCopy,
        state,
        foundNoteData,
        userClickX,
        userClickY,
        setGlyphs,
        glyphs,
        setKeySig,
        keySig
      );

    setNotesAndCoordinates(() => newNotesAndCoordinates);
    console.log("Current glyphs after interaction:", glyphs);
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
        }}
      >
        {keySigButtonGroup.map((button) => {
          return (
            <CustomButton
              key={button.text}
              onClick={button.action}
              isEnabled={button.isEnabled}
            >
              {button.text}
            </CustomButton>
          );
        })}
        <CustomButton onClick={clearKey}>Erase Key Signature</CustomButton>
      </Container>
    </>
  );
};

export default NotateKeySignature;
