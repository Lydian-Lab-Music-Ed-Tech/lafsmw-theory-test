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
import { HandleScaleInteraction } from "../lib/handleScaleInteraction";
import { initialNotesAndCoordsState } from "../lib/initialStates";
import { setupRendererAndDrawNotes } from "../lib/setupRendererAndDrawNotes";
import { NotesAndCoordinatesData, ScaleData, StaveType } from "../lib/types";
import { useNotationRenderer } from "../lib/hooks/useNotationRenderer";
import { useNotationClickHandler } from "../lib/hooks/useNotationClickHandler";
import CustomButton from "./CustomButton";
import NotationContainer from "./NotationContainer";

const NotateScale = ({
  setScales,
}: {
  setScales: Dispatch<SetStateAction<string[]>>;
}) => {
  const container = useRef<HTMLDivElement | null>(null);
  const [staves, setStaves] = useState<StaveType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [notesAndCoordinates, setNotesAndCoordinates] = useState<
    NotesAndCoordinatesData[]
  >([initialNotesAndCoordsState]);
  const [scaleDataMatrix, setScaleDataMatrix] = useState<ScaleData[][]>([[]]);
  const { states, setters, clearAllStates } = useButtonStates();
  const { chosenClef } = useClef();

  // Use our new renderer hook for VexFlow initialization
  const renderFunctionRef = useRef<(() => StaveType[] | undefined) | null>(null);
  
  const { rendererRef } = useNotationRenderer({
    containerRef: container,
    renderFunction: () => {
      if (renderFunctionRef.current) {
        return renderFunctionRef.current();
      }
      return undefined;
    },
    width: 470,
    height: 200
  });
  
  // Setup the actual render function now that rendererRef is initialized
  renderFunctionRef.current = useCallback(
    (): StaveType[] | undefined => 
      setupRendererAndDrawNotes({
        rendererRef,
        ...staveData,
        chosenClef,
        staves,
        setStaves,
        scaleDataMatrix,
      }),
    [rendererRef, setStaves, scaleDataMatrix, staves, chosenClef]
  );

  // Set up click handler
  const { getClickInfo } = useNotationClickHandler({
    containerRef: container,
    staves,
    notesAndCoordinates,
    setOpen,
    setMessage
  });

  // Initial load
  useEffect(() => {
    const newStave = renderFunctionRef.current?.();
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

  // Update notes when scale data changes
  useEffect(() => {
    const newStave = renderFunctionRef.current?.();
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
  }, [scaleDataMatrix, chosenClef]);

  const eraseMeasures = () => {
    setScaleDataMatrix((): ScaleData[][] => {
      return [[]];
    });
    const newStave = renderFunctionRef.current?.();
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

  // Enhanced click handler with better debugging and error prevention
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      console.log('Click detected in NotateScale');
      
      // Get click information
      const clickInfo = getClickInfo(e);
      if (!clickInfo) {
        console.log('No valid click info found');
        return;
      }
      
      const { userClickX, userClickY, foundNoteData } = clickInfo;
      console.log('Click info:', { userClickX, userClickY, note: foundNoteData.note });

      // Find which bar was clicked
      const barIndex = findBarIndex(staves, userClickX);
      console.log('Bar index:', barIndex);

      // Create a safe deep clone that properly handles VexFlow objects
      // We need to specially handle staveNote objects to avoid circular references
      const safeCloneNote = (note: ScaleData): ScaleData => {
        // Create a new StaveNote if needed to avoid circular references
        let newStaveNote = null;
        if (note.keys && note.keys.length > 0) {
          // Create a minimal StaveNote to satisfy the type requirements
          // The real StaveNote will be recreated in HandleScaleInteraction
          newStaveNote = new VexFlow.Flow.StaveNote({
            keys: [...note.keys],
            duration: note.duration || 'q',
            clef: chosenClef
          });
        }
        
        // Return a properly typed ScaleData object
        return {
          keys: note.keys ? [...note.keys] : [],
          duration: note.duration || 'q',
          exactX: note.exactX,
          userClickY: note.userClickY,
          staveNote: newStaveNote // Add the staveNote property to satisfy TypeScript
        };
      };

      // Create clean copies without circular references
      let scaleDataMatrixCopy = scaleDataMatrix.map(bar => 
        bar.map(note => safeCloneNote(note))
      );
      let notesAndCoordinatesCopy = notesAndCoordinates.map(note => ({...note}));

      // Extract the specific bar data for the clicked bar
      // Make sure it exists to prevent errors
      if (!scaleDataMatrixCopy[barIndex]) {
        console.error('Invalid bar index:', barIndex);
        return;
      }

      // Get bar of scale data with proper deep copy
      const barOfScaleData = scaleDataMatrixCopy[barIndex];
      
      console.log('Current button states:', states);
      console.log('Current notes in bar:', barOfScaleData.map((note: ScaleData) => note.keys?.[0]));

      // Process the interaction using our handler function
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

      console.log('After handling interaction:');
      
      // Safely log without triggering circular reference errors
      try {
        const noteKeys = newScaleDataMatrix[0].map((note: ScaleData) => note.keys?.[0] || 'unknown');
        console.log('- New notes in bar:', noteKeys);
      } catch (error) {
        console.error('Error logging note data:', error);
      }

      // Update state with the new values
      // Use callback form to ensure we're working with the latest state
      setNotesAndCoordinates(newNotesAndCoordinates);
      setScaleDataMatrix(newScaleDataMatrix);

      // Update the scales display - safely extract just the key strings
      try {
        const scaleStrings = newScaleDataMatrix[0].map((note: ScaleData) => {
          return Array.isArray(note.keys) ? note.keys.join(", ") : '';
        });
        setScales(scaleStrings);
      } catch (error) {
        console.error('Error updating scale display:', error);
      }
    },
    [scaleDataMatrix, notesAndCoordinates, staves, chosenClef]
  );

  return (
    <>
      <NotationContainer
        containerRef={container}
        onClick={handleClick}
        open={open}
        setOpen={setOpen}
        message={message}
      >
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
      </NotationContainer>
    </>
  );
};

export default NotateScale;
