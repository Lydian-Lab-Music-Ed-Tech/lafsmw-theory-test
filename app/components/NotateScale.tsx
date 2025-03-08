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
import getUserClickInfo from "../lib/getUserClickInfo";
import { HandleScaleInteraction } from "../lib/handleScaleInteraction";
import { initialNotesAndCoordsState } from "../lib/initialStates";
import { initializeRenderer } from "../lib/initializeRenderer";

import { setupRendererAndDrawNotes } from "../lib/setupRendererAndDrawNotes";
import { NotesAndCoordinatesData, ScaleData, StaveType } from "../lib/types";
import CustomButton from "./CustomButton";
import SnackbarToast from "./SnackbarToast";

const { Renderer } = VexFlow.Flow;

const NotateScale = ({
  setScales,
}: {
  setScales: Dispatch<SetStateAction<string[]>>;
}) => {
  const rendererRef = useRef<InstanceType<typeof Renderer> | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const hasScaled = useRef<boolean>(false);
  const [staves, setStaves] = useState<StaveType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [notesAndCoordinates, setNotesAndCoordinates] = useState<
    NotesAndCoordinatesData[]
  >([initialNotesAndCoordsState]);
  const [scaleDataMatrix, setScaleDataMatrix] = useState<ScaleData[][]>([[]]);
  const { states, setters, clearAllStates } = useButtonStates();
  const { chosenClef } = useClef();

  const renderStavesAndNotes = useCallback(
    (): StaveType[] =>
      setupRendererAndDrawNotes({
        rendererRef,
        ...staveData,
        chosenClef,
        staves,
        setStaves,
        scaleDataMatrix,
      }),
    [rendererRef, setStaves, scaleDataMatrix, staves]
  );

  useEffect(() => {
    initializeRenderer(rendererRef, container);
    const newStave = renderStavesAndNotes();
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

  useEffect(() => {
    if (!hasScaled.current && container.current) {
      const svgElement = container.current.querySelector("svg");
      if (svgElement) {
        svgElement.style.transform = "scale(1.5)";
        svgElement.style.transformOrigin = "0 0";
        container.current.style.height = "300px";
        container.current.style.width = "705px";
        hasScaled.current = true;
      }
    }
  }, []);

  useEffect(() => {
    const newStave: StaveType[] = renderStavesAndNotes();
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
  }, [scaleDataMatrix]);

  const eraseMeasures = () => {
    setScaleDataMatrix((): ScaleData[][] => {
      return [[]];
    });
    const newStave = renderStavesAndNotes();
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
      const { userClickY, userClickX } = getUserClickInfo(
        e,
        container,
        staves[0]
      );

      let foundNoteData = notesAndCoordinates.find(
        ({ yCoordinateMin, yCoordinateMax }) =>
          userClickY >= yCoordinateMin && userClickY <= yCoordinateMax
      );

      if (foundNoteData) {
        foundNoteData = {
          ...foundNoteData,
          userClickY,
        };
      } else {
        setOpen(true);
        setMessage(errorMessages.noNoteFound);
        return;
      }

      const barIndex = findBarIndex(staves, userClickX);

      let scaleDataMatrixCopy = scaleDataMatrix.map((scaleData) => [
        ...scaleData,
      ]);

      let notesAndCoordinatesCopy = [...notesAndCoordinates];

      const barOfScaleData = scaleDataMatrixCopy[barIndex].map(
        (scaleData: ScaleData) => ({
          ...scaleData,
        })
      );

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

      setNotesAndCoordinates(() => newNotesAndCoordinates);

      setScaleDataMatrix(() => newScaleDataMatrix);

      setScales(
        newScaleDataMatrix[0].map((scaleDataMatrix) =>
          scaleDataMatrix.keys.join(", ")
        )
      );
    },
    [scaleDataMatrix, notesAndCoordinates, staves, chosenClef]
  );

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
            setters.setIsChangeNoteActive(true);
          }}
          active={states.isChangeNoteActive}
        >
          Change Note
        </CustomButton>
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
        <Button onClick={eraseMeasures}>Clear All</Button>
      </Container>
    </>
  );
};

export default NotateScale;
