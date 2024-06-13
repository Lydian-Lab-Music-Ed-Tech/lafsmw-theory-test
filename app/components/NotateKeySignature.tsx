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
import RegularButton from "../components/RegularButton";
import { modifyKeySigActionTypes } from "../lib/actionTypes";
import { buildKeySignature } from "../lib/buildKeySignature";
import { buttonGroup, clearKeySignature } from "../lib/buttonsAndButtonGroups";
import { initialNotesAndCoordsState } from "../lib/data/initialNotesAndCoordinatesState";
import generateYMinAndYMaxForKeySig from "../lib/generateYMinAndMaxForKeySig";
import { INITIAL_STAVES, staveData } from "../lib/data/stavesData";
import getUserClickInfo from "../lib/getUserClickInfo";
import { handleKeySigInteraction } from "../lib/handleKeySigInteraction";
import { keySigInitialState } from "../lib/initialStates";
import { initializeRenderer } from "../lib/initializeRenderer";
import isClickWithinStaveBounds from "../lib/isClickWithinStaveBounds";
import { keySigArray } from "../lib/keySigArray";
import { deleteAccidentalFromKeySig } from "../lib/modifyKeySignature";
import { parseNote } from "../lib/modifyNotesAndCoordinates";
import { keySigReducer } from "../lib/reducer";
import { setupRenderer } from "../lib/setUpRenderer";
import { GlyphProps, NotesAndCoordinatesData } from "../lib/typesAndInterfaces";

const VF = VexFlow.Flow;
const { Renderer } = VF;

const NotateKeySignature = ({ handleNotes }: any) => {
  const rendererRef = useRef<InstanceType<typeof Renderer> | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const [blankStaves, setBlankStaves] = useState(INITIAL_STAVES);
  const [glyphs, setGlyphs] = useState<GlyphProps[]>([]);

  const [state, dispatch] = useReducer(keySigReducer, keySigInitialState);
  const [keySig, setKeySig] = useState<string[]>([]);
  const [notesAndCoordinates, setNotesAndCoordinates] = useState<
    NotesAndCoordinatesData[]
  >([initialNotesAndCoordsState]);
  const [topKeySigNoteYCoord, setTopKeySigYNoteCoord] = useState<number>(0);
  const keySigButtonGroup = useMemo(
    () => buttonGroup(dispatch, state, modifyKeySigActionTypes),
    [dispatch, state]
  );

  const renderer = rendererRef.current;
  renderer?.resize(470, 200);

  const context = rendererRef.current?.getContext();

  const renderStaves = useCallback((): void => {
    setupRenderer({
      rendererRef,
      ...staveData,
      firstStaveWidth: 450,
      setStaves: setBlankStaves,
      staves: blankStaves,
    });
  }, [blankStaves, setBlankStaves]);

  const clearKey = () => {
    clearKeySignature(setGlyphs, rendererRef, container, renderStaves),
      setKeySig(() => []);
    dispatch({ type: "" });
  };

  //need to figure out how to NOT hard code the top note coordinate

  useEffect(() => {
    initializeRenderer(rendererRef, container);
    renderStaves();
    setNotesAndCoordinates(() => generateYMinAndYMaxForKeySig(44, keySigArray));
  }, []);

  //this is where the we will get the array to grade
  useEffect(() => {
    console.log("key signature: ", keySig);
    handleNotes(keySig);
  }, [keySig]);

  useEffect(() => {
    initializeRenderer(rendererRef, container);
    renderStaves();
    context?.clear();
    context && buildKeySignature(glyphs, 40, context, blankStaves[0]);
  }, [glyphs]);

  const handleClick = (e: React.MouseEvent) => {
    if (
      !state.isAddSharpActive &&
      !state.isAddFlatActive &&
      !state.isRemoveAccidentalActive
    )
      return;

    const {
      userClickY,
      userClickX,
      topStaveYCoord,
      bottomStaveYCoord,
      topKeySigPosition,
    } = getUserClickInfo(e, container, blankStaves[0]);

    setTopKeySigYNoteCoord(() => topKeySigPosition);

    let foundNoteData = notesAndCoordinates.find(
      ({ yCoordinateMin, yCoordinateMax }) =>
        userClickY >= yCoordinateMin && userClickY <= yCoordinateMax
    );
    if (!foundNoteData) {
      return;
    }

    const { maxRightClick, minLeftClick, minTopClick, maxBottomClick } =
      isClickWithinStaveBounds(
        blankStaves[0],
        topStaveYCoord,
        bottomStaveYCoord
      );

    if (
      typeof maxBottomClick === "undefined" ||
      userClickX < minLeftClick ||
      userClickX > maxRightClick ||
      userClickY < minTopClick ||
      userClickY > maxBottomClick
    )
      return;

    if (state.isRemoveAccidentalActive) {
      deleteAccidentalFromKeySig(setGlyphs, userClickX, userClickY);
      return;
    }

    let notesAndCoordinatesCopy = [...notesAndCoordinates];

    setGlyphs((prevState) => [
      ...prevState,
      {
        xPosition: userClickX,
        yPosition: userClickY,
        glyph: state.isAddSharpActive
          ? "accidentalSharp"
          : state.isAddFlatActive
          ? "accidentalFlat"
          : "",
      },
    ]);
    const { notesAndCoordinates: newNotesAndCoordinates } =
      handleKeySigInteraction(notesAndCoordinatesCopy, state, foundNoteData);

    // TO DO: Refactor this to a separate function? It's taking too long to update the state if student clicks on a note too quickly after another note
    setKeySig((prevState) => {
      const newKeySig = [...prevState];
      if (foundNoteData?.note) {
        const noteBase = parseNote(foundNoteData?.note).noteBase;
        const noteWithAccidental = state.isAddSharpActive
          ? `${noteBase}` + "#"
          : `${noteBase}` + "b";
        if (!newKeySig.includes(noteWithAccidental)) {
          newKeySig.push(noteWithAccidental);
        }
      }
      return newKeySig;
    });

    setNotesAndCoordinates(() => newNotesAndCoordinates);
  };

  return (
    <>
      <div ref={container} onClick={handleClick} />

      <div>
        {keySigButtonGroup.map((button) => {
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
        <RegularButton onClick={clearKey}>Clear Key Signature</RegularButton>
      </div>
    </>
  );
};

export default NotateKeySignature;
