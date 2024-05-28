"use client";
import { Container } from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import VexFlow from "vexflow";
import CheckIfNoteFound from "../components/CheckIfNoteFound";
import CheckNumBeatsInMeasure from "../components/CheckNumBeatsInMeasure";
import RegularButton from "../components/RegularButton";
import { modifyChordsActionTypes } from "../lib/actionTypes";
import { buttonGroup } from "../lib/buttonsAndButtonGroups";
import { initialChordData } from "../lib/data/initialChordData";
import { initialNotesAndCoordsState } from "../lib/data/initialNotesAndCoordinatesState";
import { staveData } from "../lib/data/stavesData";
import { findBarIndex } from "../lib/findBar";
import generateYMinAndYMaxForNotes from "../lib/generateYMinAndMaxForAllNotes";
import getUserClickInfo from "../lib/getUserClickInfo";
import { handleChordInteraction } from "../lib/handleChordInteraction";
import { chordInteractionInitialState } from "../lib/initialStates";
import { initializeRenderer } from "../lib/initializeRenderer";
import { notesArray } from "../lib/noteArray";
import { chordReducer } from "../lib/reducer";
import { setupRendererAndDrawChords } from "../lib/setUpRendererAndDrawChords";
import {
  Chord,
  NotesAndCoordinatesData,
  StaveType,
} from "../lib/typesAndInterfaces";

const { Renderer } = VexFlow.Flow;

const NotateChord = () => {
  const rendererRef = useRef<InstanceType<typeof Renderer> | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const [staves, setStaves] = useState<StaveType[]>([]);
  const [state, dispatch] = useReducer(
    chordReducer,
    chordInteractionInitialState
  );
  const [barIndex, setBarIndex] = useState<number>(0);
  const [chordData, setChordData] = useState<Chord>(initialChordData);

  const [notesAndCoordinates, setNotesAndCoordinates] = useState<
    NotesAndCoordinatesData[]
  >([initialNotesAndCoordsState]);

  const noNoteFound = () => dispatch({ type: "noNoteFound" });

  const modifyChordsButtonGroup = useMemo(
    () => buttonGroup(dispatch, state, modifyChordsActionTypes),
    [dispatch, state]
  );

  const eraseChord = () => {
    setChordData((): Chord => {
      return initialChordData;
    });
    setNotesAndCoordinates(() => generateYMinAndYMaxForNotes(147, notesArray));
    renderStavesAndChords();
  };

  const renderStavesAndChords = useCallback(
    (): void =>
      setupRendererAndDrawChords({
        rendererRef,
        ...staveData,
        setStaves,
        chordData,
        staves,
        barIndex,
      }),
    [rendererRef, setStaves, chordData, staves, barIndex]
  );

  useEffect(() => {
    setNotesAndCoordinates(() => generateYMinAndYMaxForNotes(147, notesArray));
  }, []);

  useEffect(() => {
    initializeRenderer(rendererRef, container);
    renderStavesAndChords();
  }, []);

  useEffect(() => {
    renderStavesAndChords();
  }, [chordData]);

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

    setBarIndex(() => {
      return findBarIndex(staves, userClickX);
    });

    const foundNoteIndex: number = chordData.keys.findIndex(
      (note) => note === foundNoteData?.note
    );

    if (!foundNoteData) {
      noNoteFound();
      return;
    }
    const {
      chordData: newChordData,
      notesAndCoordinates: newNotesAndCoordinates,
    } = handleChordInteraction(
      notesAndCoordinatesCopy,
      state,
      foundNoteData,
      chordDataCopy,
      foundNoteIndex
    );

    setNotesAndCoordinates(() => newNotesAndCoordinates);
    setChordData(() => newChordData);
  };

  return (
    <>
      <div ref={container} onClick={handleClick} />
      <CheckNumBeatsInMeasure
        tooManyBeatsInMeasure={state.tooManyBeatsInMeasure}
        openEnterNotes={dispatch}
      />
      <CheckIfNoteFound
        noNoteFound={state.noNoteFound || false}
        openEnterNotes={dispatch}
      />
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
            <RegularButton
              key={button.text}
              onClick={button.action}
              isEnabled={button.isEnabled}
            >
              {button.text}
            </RegularButton>
          );
        })}
        <RegularButton onClick={eraseChord}>Erase Chord</RegularButton>
      </Container>
    </>
  );
};

export default NotateChord;
