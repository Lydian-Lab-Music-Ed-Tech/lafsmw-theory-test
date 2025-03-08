/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Button, Container } from "@mui/material";
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
import calculateNotesAndCoordinates from "../lib/calculateNotesAndCoordinates";
import {
  bassClefNotesArray,
  trebleClefNotesArray,
} from "../lib/data/noteArray";
import { staveData } from "../lib/data/stavesData";
import { findBarIndex } from "../lib/findBar";
import getUserClickInfo from "../lib/getUserClickInfo";
import { handleChordInteraction } from "../lib/handleChordInteraction";
import {
  initialChordData,
  initialNotesAndCoordsState,
} from "../lib/initialStates";
import { initializeRenderer } from "../lib/initializeRenderer";
import { setupRendererAndDrawChords } from "../lib/setUpRendererAndDrawChords";
import { Chord, NotesAndCoordinatesData, StaveType } from "../lib/types";
import CustomButton from "./CustomButton";
import SnackbarToast from "./SnackbarToast";
import { errorMessages } from "../lib/data/errorMessages";
import { useButtonStates } from "../lib/useButtonStates";
const { Renderer } = VexFlow.Flow;

const NotateChord = ({
  setChords,
}: {
  setChords: Dispatch<SetStateAction<Array<string>>>;
}) => {
  const rendererRef = useRef<InstanceType<typeof Renderer> | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const hasScaled = useRef<boolean>(false);
  const [staves, setStaves] = useState<StaveType[]>([]);
  const [barIndex, setBarIndex] = useState<number>(0);
  const [chordData, setChordData] = useState<Chord>(initialChordData);
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { chosenClef } = useClef();
  const [notesAndCoordinates, setNotesAndCoordinates] = useState<
    NotesAndCoordinatesData[]
  >([initialNotesAndCoordsState]);
  const { states, setters, clearAllStates } = useButtonStates();

  const renderStavesAndChords = useCallback(
    (): StaveType[] | undefined =>
      setupRendererAndDrawChords({
        rendererRef,
        ...staveData,
        setStaves,
        chordData,
        staves,
        barIndex,
        chosenClef,
      }),
    [rendererRef, setStaves, chordData, staves, barIndex]
  );

  useEffect(() => {
    initializeRenderer(rendererRef, container);
    const newStave = renderStavesAndChords();
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
  }, []);

  useEffect(() => {
    if (!hasScaled.current && container.current) {
      const svgElement = container.current.querySelector("svg");
      if (svgElement) {
        svgElement.style.transform = "scale(1.5)";
        svgElement.style.transformOrigin = "0 0";
        hasScaled.current = true;
      }
    }
  }, []);

  useEffect(() => {
    renderStavesAndChords();
  }, [chordData]);

  const eraseChord = () => {
    setChordData((): Chord => {
      return initialChordData;
    });
    const newStave: any = renderStavesAndChords();
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

  const handleClick = (e: React.MouseEvent) => {
    const { userClickY, userClickX } = getUserClickInfo(
      e,
      container,
      staves[0]
    );

    let foundNoteData = notesAndCoordinates.find(
      ({ yCoordinateMin, yCoordinateMax }) =>
        userClickY >= yCoordinateMin && userClickY <= yCoordinateMax
    );

    if (!foundNoteData) {
      setOpen(true);
      setMessage(errorMessages.noNoteFound);
      return;
    }

    let chordDataCopy = { ...chordData };
    let notesAndCoordinatesCopy = [...notesAndCoordinates];

    const barIndex = findBarIndex(staves, userClickX);

    const foundNoteIndex: number = chordData.keys.findIndex(
      (note) => note === foundNoteData?.note
    );

    const {
      chordData: newChordData,
      notesAndCoordinates: newNotesAndCoordinates,
    } = handleChordInteraction(
      notesAndCoordinatesCopy,
      states,
      foundNoteData,
      chordDataCopy,
      foundNoteIndex,
      chosenClef
    );

    setNotesAndCoordinates(() => newNotesAndCoordinates);
    setChordData(() => newChordData);
    setChords(newChordData.keys);
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
        <Button onClick={eraseChord}>Clear All</Button>
      </Container>
    </>
  );
};

export default NotateChord;
