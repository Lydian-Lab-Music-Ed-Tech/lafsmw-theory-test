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
import { useClef } from "../context/ClefContext";
import { modifyKeySigActionTypes } from "../lib/actionTypes";
import { buildKeySignature } from "../lib/buildKeySignature";
import { buttonGroup, clearKeySignature } from "../lib/buttonsAndButtonGroups";
import { keySigArray } from "../lib/data/keySigArray";
import { staveData } from "../lib/data/stavesData";
import getUserClickInfo from "../lib/getUserClickInfo";
import { handleKeySigInteraction } from "../lib/handleKeySigInteraction";
import { keySigInitialState } from "../lib/initialStates";
import isClickWithinStaveBounds from "../lib/isClickWithinStaveBounds";
import { reducer } from "../lib/reducer";
import { setupRendererAndDrawStaves } from "../lib/setUpRendererAndDrawStaves";
import { GlyphProps, StaveType } from "../lib/typesAndInterfaces";
import CustomButton from "./CustomButton";
import NotationContainer from "./NotationContainer";
import useNotationRenderer from "../hooks/useNotationRenderer";

const { Renderer } = VexFlow.Flow;

const NotateKeySignature = ({ handleKeySig }: any) => {
  const [staves, setStaves] = useState<StaveType[]>([]);
  const [glyphs, setGlyphs] = useState<GlyphProps[]>([]);
  const [open, setOpen] = useState(false);
  const { chosenClef } = useClef();
  const [message, setMessage] = useState("");
  const [state, dispatch] = useReducer(reducer, keySigInitialState);
  const [keySig, setKeySig] = useState<string[]>([]);
  const renderCount = useRef(0);
  
  // Create a ref for the render function to avoid circular dependencies
  const renderFunctionRef = useRef<() => StaveType[] | undefined>(null);
  
  // Use the hook to get the renderer and container refs
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
    extraDeps: [glyphs],
    yOffsetBass: 1,
    yOffsetTreble: 0,
    isLine: false,
  });
  
  // Set up the render function after rendererRef is initialized
  renderFunctionRef.current = useCallback(() => {
    return setupRendererAndDrawStaves({
      rendererRef,
      ...staveData,
      chosenClef,
      firstStaveWidth: 450,
      setStaves: (newStaves) => {
        setStaves(newStaves);
        setStavesFromHook?.(newStaves);
      },
    });
  }, [chosenClef, rendererRef, setStavesFromHook]);

  const keySigButtonGroup = useMemo(
    () => buttonGroup(dispatch, state, modifyKeySigActionTypes),
    [dispatch, state]
  );

  // Handle click events
  const handleClick = (e: React.MouseEvent) => {
    renderCount.current += 1;
    console.log(`Handling click, render count: ${renderCount.current}`);

    // Make sure the stave exists before trying to use it
    if (!staves.length || !staves[0]) {
      setMessage("Error: Stave not properly initialized");
      setOpen(true);
      return;
    }

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

  useEffect(() => {
    if (rendererRef.current && staves.length > 0) {
      const context = rendererRef.current.getContext();
      if (context) {
        // Clear and redraw without recreating the staves
        context.clear();
        staves[0].setContext(context).draw();
        buildKeySignature(glyphs, 40, context, staves[0]);
      }
    }
  }, [glyphs, staves]);

  useEffect(() => {
    console.log("Key signature state changed:", keySig);
  }, [keySig]);

  useEffect(() => {
    // Pass the updated key signature to the parent component whenever it changes
    if (handleKeySig) {
      console.log(
        "keySig from NotateKeySignature useEffect (will pass to parent):",
        keySig
      );
      handleKeySig(keySig);
    }
  }, [keySig, handleKeySig]);

  const clearKey = () => {
    clearKeySignature(setGlyphs, rendererRef, container);
    setKeySig(() => []);
    // Re-render staves
    if (rendererRef.current && renderFunctionRef.current) {
      renderFunctionRef.current();
    }
    dispatch({ type: "CLEAR_ALL" });
  };

  return (
    <NotationContainer
      containerRef={container}
      onClick={handleClick}
      open={open}
      setOpen={setOpen}
      message={message}
    >
      {keySigButtonGroup.map((button) => (
        <CustomButton
          key={button.text}
          onClick={button.action}
          isEnabled={button.isEnabled}
        >
          {button.text}
        </CustomButton>
      ))}
      <CustomButton onClick={clearKey}>Clear</CustomButton>
    </NotationContainer>
  );
};

export default NotateKeySignature;
