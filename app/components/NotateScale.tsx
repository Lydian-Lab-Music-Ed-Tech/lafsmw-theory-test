/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Button } from "@mui/material";
import Container from "@mui/material/Container";
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
import { modifyNotesActionTypes } from "../lib/actionTypes";
import { buttonGroup } from "../lib/buttonsAndButtonGroups";
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
import {
  initialNotesAndCoordsState,
  noteInteractionInitialState,
} from "../lib/initialStates";
import { initializeRenderer } from "../lib/initializeRenderer";
import { reducer } from "../lib/reducer";
import { setupRendererAndDrawNotes } from "../lib/setupRendererAndDrawNotes";
import {
  NotesAndCoordinatesData,
  ScaleData,
  StaveType,
} from "../lib/typesAndInterfaces";
import CustomButton from "./CustomButton";
import SnackbarToast from "./SnackbarToast";
const { Renderer } = VexFlow.Flow;

const NotateScale = ({
  setScales,
}: {
  setScales: Dispatch<SetStateAction<Array<string>>>;
}) => {
  const rendererRef = useRef<InstanceType<typeof Renderer> | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const [staves, setStaves] = useState<StaveType[]>([]);
  const [scaleDataMatrix, setScaleDataMatrix] = useState<ScaleData[][]>([[]]);
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [notesAndCoordinates, setNotesAndCoordinates] = useState<
    NotesAndCoordinatesData[]
  >([initialNotesAndCoordsState]);
  const { chosenClef } = useClef();
  const [state, dispatch] = useReducer(reducer, noteInteractionInitialState);

  const modifyStaveNotesButtonGroup = useMemo(
    () => buttonGroup(dispatch, state, modifyNotesActionTypes),
    [dispatch, state]
  );

  const renderStavesAndNotes = useCallback(
    (): StaveType[] =>
      setupRendererAndDrawNotes({
        rendererRef,
        ...staveData,
        setStaves,
        scaleDataMatrix,
        staves,
        chosenClef,
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
  }, [scaleDataMatrix, state]);

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
          staveNoteAbsoluteX: scaleData.staveNote
            ? scaleData.staveNote.getAbsoluteX()
            : 0,
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
        state,
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
      <div ref={container} onClick={handleClick} />
      <SnackbarToast open={open} setOpen={setOpen} message={message} />
      <Container
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          padding: 0,
          marginTop: 2,
        }}
        disableGutters
      >
        {modifyStaveNotesButtonGroup.map((button) => {
          return (
            <CustomButton
              key={button.text}
              onClick={() => {
                button.action();
              }}
              isEnabled={button.isEnabled}
            >
              {button.text}
            </CustomButton>
          );
        })}
        <Button onClick={eraseMeasures} sx={{ m: 1 }}>
          Erase Measure
        </Button>
      </Container>
    </>
  );
};

export default NotateScale;
