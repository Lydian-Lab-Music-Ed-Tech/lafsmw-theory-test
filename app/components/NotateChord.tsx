/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Button, Container } from "@mui/material";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import VexFlow from "vexflow";
import { useClef } from "../context/ClefContext";
import { modifyChordsActionTypes } from "../lib/actionTypes";
import { buttonGroup } from "../lib/buttonsAndButtonGroups";
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
  chordInteractionInitialState,
  initialChordData,
  initialNotesAndCoordsState,
} from "../lib/initialStates";
import { initializeRenderer } from "../lib/initializeRenderer";
import { reducer } from "../lib/reducer";
import { setupRendererAndDrawChords } from "../lib/setUpRendererAndDrawChords";
import {
  Chord,
  NotesAndCoordinatesData,
  StaveType,
} from "../lib/typesAndInterfaces";
import CustomButton from "./CustomButton";
import SnackbarToast from "./SnackbarToast";
import { errorMessages } from "../lib/data/errorMessages";
const { Renderer } = VexFlow.Flow;

const NotateChord = ({
  setChords,
}: {
  setChords: Dispatch<SetStateAction<Array<string>>>;
}) => {
  const rendererRef = useRef<InstanceType<typeof Renderer> | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const [staves, setStaves] = useState<StaveType[]>([]);
  const [chordInteractionState, dispatch] = useReducer(
    reducer,
    chordInteractionInitialState
  );
  //not currently being used, but will be used in the future
  const [barIndex, setBarIndex] = useState<number>(0);
  const [chordData, setChordData] = useState<Chord>(initialChordData);
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { chosenClef } = useClef();
  const [notesAndCoordinates, setNotesAndCoordinates] = useState<
    NotesAndCoordinatesData[]
  >([initialNotesAndCoordsState]);

  const noNoteFound = () => dispatch({ type: "noNoteFound" });

  const modifyChordsButtonGroup = useMemo(
    () => buttonGroup(dispatch, chordInteractionState, modifyChordsActionTypes),
    [dispatch, chordInteractionState]
  );

  const renderStavesAndChords = useCallback(
    (): StaveType[] =>
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
    const newStave: StaveType[] = renderStavesAndChords();
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
    renderStavesAndChords();
    //this is the array to use for grading
    const chordsArray = chordData.keys;
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

    let chordDataCopy = { ...chordData };
    let notesAndCoordinatesCopy = [...notesAndCoordinates];
    //not currently being used but will be used in the future
    const barIndex = findBarIndex(staves, userClickX);

    const foundNoteIndex: number = chordData.keys.findIndex(
      (note) => note === foundNoteData?.note
    );

    if (!foundNoteData) {
      setOpen(true);
      setMessage(errorMessages.noNoteFound);
      return;
    }

    const {
      chordData: newChordData,
      notesAndCoordinates: newNotesAndCoordinates,
    } = handleChordInteraction(
      notesAndCoordinatesCopy,
      chordInteractionState,
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
      <div ref={container} onClick={handleClick} />
      <SnackbarToast open={open} setOpen={setOpen} message={message} />
      <Container
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          padding: 0,
          margin: 0,
        }}
        disableGutters
      >
        {modifyChordsButtonGroup.map((button) => {
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
        <Button onClick={eraseChord} sx={{ m: 0.5 }}>
          Erase Measure
        </Button>
      </Container>
    </>
  );
};

export default NotateChord;
