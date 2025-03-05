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
import { modifyScalesActionTypes } from "../lib/actionTypes";
import { buttonGroup } from "../lib/buttonsAndButtonGroups";
import { staveData } from "../lib/data/stavesData";
import getUserClickInfo from "../lib/getUserClickInfo";
import { handleScaleInteraction } from "../lib/handleScaleInteraction";
import { scaleInteractionInitialState } from "../lib/initialStates";
import isClickWithinStaveBounds from "../lib/isClickWithinStaveBounds";
import { reducer } from "../lib/reducer";
import { setupRendererAndDrawNotes } from "../lib/setupRendererAndDrawNotes";
import { ScaleData, StaveType } from "../lib/typesAndInterfaces";
import CustomButton from "./CustomButton";
import NotationContainer from "./NotationContainer";
import useNotationRenderer from "../hooks/useNotationRenderer";

const { Renderer } = VexFlow.Flow;

const NotateScale = ({
  setScales,
}: {
  setScales: Dispatch<SetStateAction<Array<string>>>;
}) => {
  const [scaleDataMatrix, setScaleDataMatrix] = useState<ScaleData[][]>([[]]);
  const [staves, setStaves] = useState<StaveType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { chosenClef } = useClef();
  const [state, dispatch] = useReducer(reducer, scaleInteractionInitialState);
  
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
    extraDeps: [scaleDataMatrix, state],
  });
  
  // Set up the render function after rendererRef is initialized
  renderFunctionRef.current = useCallback(() => {
    return setupRendererAndDrawNotes({
      rendererRef,
      ...staveData,
      setStaves: (newStaves) => {
        setStaves(newStaves);
        setStavesFromHook?.(newStaves);
      },
      scaleDataMatrix,
      chosenClef,
    });
  }, [scaleDataMatrix, chosenClef, rendererRef, setStavesFromHook]);

  const eraseMeasures = () => {
    setScaleDataMatrix((): ScaleData[][] => {
      return [[]];
    });
    if (renderFunctionRef.current) {
      renderFunctionRef.current();
    }
  };

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Make sure the stave exists before trying to use it
      if (!staves.length || !staves[0]) {
        setOpen(true);
        setMessage("Error: Stave not properly initialized");
        return;
      }

      const { userClickY, userClickX, topStaveYCoord, bottomStaveYCoord } =
        getUserClickInfo(e, container, staves[0]);

      isClickWithinStaveBounds(
        staves[0],
        topStaveYCoord,
        bottomStaveYCoord,
        userClickX,
        userClickY,
        setMessage,
        setOpen
      );

      let foundNoteData = notesAndCoordinates.find(
        ({ yCoordinateMin, yCoordinateMax }) =>
          userClickY >= yCoordinateMin && userClickY <= yCoordinateMax
      );

      if (!foundNoteData) {
        setOpen(true);
        setMessage("No note found at click position");
        return;
      } else {
        foundNoteData = {
          ...foundNoteData,
          userClickX: userClickX,
        };
      }

      let scaleDataMatrixCopy = [...scaleDataMatrix];
      let notesAndCoordinatesCopy = [...notesAndCoordinates];

      const { scaleDataMatrix: newScaleDataMatrix, notesAndCoordinates: newNotesAndCoordinates } =
        handleScaleInteraction(
          notesAndCoordinatesCopy,
          state,
          foundNoteData,
          scaleDataMatrixCopy,
          userClickX,
          userClickY,
          rendererRef,
          staves,
          chosenClef
        );

      setScaleDataMatrix(() => newScaleDataMatrix);
      setNotesAndCoordinates(() => newNotesAndCoordinates);
      
      if (setScales && newScaleDataMatrix[0] && newScaleDataMatrix[0].length > 0) {
        setScales(
          newScaleDataMatrix[0].map((scaleData) =>
            scaleData.keys.join(", ")
          )
        );
      }
    },
    [notesAndCoordinates, scaleDataMatrix, state, staves, container, rendererRef, chosenClef, setScales]
  );

  const modifyScalesButtonGroup = useMemo(
    () => buttonGroup(dispatch, state, modifyScalesActionTypes),
    [dispatch, state]
  );

  useEffect(() => {
    if (renderFunctionRef.current) {
      renderFunctionRef.current();
    }
  }, [scaleDataMatrix]);

  return (
    <NotationContainer
      containerRef={container}
      onClick={handleClick}
      open={open}
      setOpen={setOpen}
      message={message}
    >
      {modifyScalesButtonGroup.map((button) => (
        <CustomButton
          key={button.text}
          onClick={button.action}
          isEnabled={button.isEnabled}
        >
          {button.text}
        </CustomButton>
      ))}
      <CustomButton onClick={eraseMeasures}>Erase</CustomButton>
    </NotationContainer>
  );
};

export default NotateScale;
