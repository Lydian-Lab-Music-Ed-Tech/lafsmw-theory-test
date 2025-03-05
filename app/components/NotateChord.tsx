/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  Dispatch,
  SetStateAction
} from "react";
import VexFlow from "vexflow";
import { useClef } from "../context/ClefContext";
import { modifyChordsActionTypes } from "../lib/actionTypes";
import { buttonGroup } from "../lib/buttonsAndButtonGroups";
import { chordInteractionInitialState, initialChordData } from "../lib/initialStates";
import { reducer } from "../lib/reducer";
import { setupRendererAndDrawChords } from "../lib/setUpRendererAndDrawChords";
import { staveData } from "../lib/data/stavesData";
import {
  Chord,
  StaveType,
} from "../lib/typesAndInterfaces";
import CustomButton from "./CustomButton";
import { buildChord } from "../lib/buildChord";
import NotationContainer from "./NotationContainer";
import useNotationRenderer from "../hooks/useNotationRenderer";

const { Renderer } = VexFlow.Flow;

const NotateChord = ({
  setChords,
}: {
  setChords: Dispatch<SetStateAction<Array<string>>>;
}) => {
  const [barIndex, setBarIndex] = useState<number>(0);
  const [chordData, setChordData] = useState<Chord>(initialChordData);
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { chosenClef } = useClef();
  const [chordInteractionState, dispatch] = useReducer(
    reducer,
    chordInteractionInitialState
  );
  const [staves, setStaves] = useState<StaveType[]>([]);
  
  // Create a ref for the render function to avoid circular dependencies
  const renderFunctionRef = useRef<() => StaveType[] | undefined>(null);

  const {
    rendererRef,
    container,
    staves: stavesFromHook,
    setStaves: setStavesFromHook,
    notesAndCoordinates,
    setNotesAndCoordinates,
  } = useNotationRenderer({
    renderFunction: () => {
      // Use the current value of the ref
      if (renderFunctionRef.current) {
        return renderFunctionRef.current();
      }
      return undefined;
    },
    chosenClef,
    extraDeps: [chordData, barIndex],
  });
  
  // Set up the render function after rendererRef is initialized
  renderFunctionRef.current = useCallback(() => {
    return setupRendererAndDrawChords({
      rendererRef,
      ...staveData,
      setStaves: (newStaves) => {
        setStaves(newStaves);
        setStavesFromHook?.(newStaves);
      },
      chordData,
      barIndex,
      chosenClef,
    });
  }, [chordData, barIndex, chosenClef, rendererRef, setStavesFromHook]);

  const modifyChordsButtonGroup = useMemo(
    () => buttonGroup(dispatch, chordInteractionState, modifyChordsActionTypes),
    [dispatch, chordInteractionState]
  );

  useEffect(() => {
    if (renderFunctionRef.current) {
      renderFunctionRef.current();
    }
    const chordsArray = chordData.keys;
    if (setChords && chordsArray.length > 0) {
      setChords(chordsArray);
    }
  }, [chordData, setChords]);

  const eraseChord = () => {
    setChordData((): Chord => {
      return initialChordData;
    });
    if (renderFunctionRef.current) {
      renderFunctionRef.current();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Make sure the stave exists before trying to use it
    if (!staves.length || !staves[0]) {
      setOpen(true);
      setMessage("Error: Stave not properly initialized");
      return;
    }

    const rect = container.current?.getBoundingClientRect();
    if (!rect) return;

    const userClickX = e.clientX - rect.left;
    const userClickY = e.clientY - rect.top;

    const topStaveYCoord = staves[0].getYForLine(0);
    const bottomStaveYCoord = staves[0].getYForLine(4);

    if (
      userClickY < topStaveYCoord - 50 ||
      userClickY > bottomStaveYCoord + 50 ||
      userClickX < staves[0].getBoundingBox().getX() ||
      userClickX > staves[0].getBoundingBox().getX() + staves[0].getWidth()
    ) {
      setOpen(true);
      setMessage("Please click within the stave bounds");
      return;
    }

    buildChord({
      state: chordInteractionState,
      setChordData,
      chordData,
      rendererRef,
      staves,
      userClickX,
      userClickY,
      chosenClef,
      barIndex,
    });
  };

  return (
    <NotationContainer
      containerRef={container}
      onClick={handleClick}
      open={open}
      setOpen={setOpen}
      message={message}
    >
      {modifyChordsButtonGroup.map((button) => (
        <CustomButton
          key={button.text}
          onClick={button.action}
          isEnabled={button.isEnabled}
        >
          {button.text}
        </CustomButton>
      ))}
      <CustomButton onClick={eraseChord}>Erase</CustomButton>
    </NotationContainer>
  );
};

export default NotateChord;
