"use client";
import { Container } from "@mui/material";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Flow } from "vexflow";
import { useClef } from "../context/ClefContext";
import {
  toChordWithVexFlow,
  toSimpleChordData,
} from "../lib/chordDataConverters";
import calculateNotesAndCoordinates from "../lib/calculateNotesAndCoordinates";
import {
  bassClefNotesArray,
  trebleClefNotesArray,
} from "../lib/data/noteArray";
import { staveData } from "../lib/data/stavesData";
import { findBarIndex } from "../lib/findBar";
import { handleChordInteraction } from "../lib/handleChordInteraction";
import { useButtonStates } from "../lib/hooks/useButtonStates";
import { useNotationClickHandler } from "../lib/hooks/useNotationClickHandler";
import { useNotationRenderer } from "../lib/hooks/useNotationRenderer";
import {
  initialChordData,
  initialNotesAndCoordsState,
} from "../lib/initialStates";
import { setupRendererAndDrawChords } from "../lib/setUpRendererAndDrawChords";
import {
  Chord,
  NotesAndCoordinatesData,
  SimpleChordData,
  StaveType,
} from "../lib/types";
import CustomButton from "./CustomButton";
import NotationContainer from "./NotationContainer";

interface NotateChordProps {
  initialChords?: string[];
  initialChordData?: SimpleChordData;
  onChange: (chords: string[]) => void;
}

const NotateChord = ({
  initialChords = [],
  initialChordData,
  onChange,
}: NotateChordProps) => {
  const container = useRef<HTMLDivElement | null>(null);
  const [staves, setStaves] = useState<StaveType[]>([]);
  // Always use barIndex 0 for chords since we only have one stave
  const barIndex = 0;

  const { chosenClef } = useClef();

  // Hydrate chordData from initialChordData or initialChords
  const [chordData, setChordData] = useState<Chord>(() => {
    // If we have initialChordData, convert it to a Chord with VexFlow objects
    if (initialChordData) {
      return toChordWithVexFlow(initialChordData, chosenClef);
    }
    // Otherwise use initialChords or empty
    return {
      keys: initialChords || [],
      duration: "w",
      staveNotes: null,
      userClickY: 0,
    };
  });
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [notesAndCoordinates, setNotesAndCoordinates] = useState<
    NotesAndCoordinatesData[]
  >([initialNotesAndCoordsState]);
  const { buttonStates, setters, clearAllStates } = useButtonStates();

  // Use our new renderer hook for VexFlow initialization
  const renderFunctionRef = useRef<(() => StaveType[] | undefined) | null>(
    null
  );

  const { rendererRef } = useNotationRenderer({
    containerRef: container,
    renderFunction: () => {
      if (renderFunctionRef.current) {
        return renderFunctionRef.current();
      }
      return undefined;
    },
    width: 470,
    height: 200,
  });

  // Setup the actual render function now that rendererRef is initialized
  renderFunctionRef.current = useCallback(
    (): StaveType[] | undefined =>
      setupRendererAndDrawChords({
        rendererRef: rendererRef as React.RefObject<
          InstanceType<typeof Flow.Renderer>
        >,
        ...staveData,
        setStaves,
        chordData,
        staves,
        barIndex,
        chosenClef,
      }),
    [rendererRef, setStaves, chordData, staves, barIndex, chosenClef]
  );

  // Set up click handler
  const { getClickInfo } = useNotationClickHandler({
    containerRef: container,
    staves,
    notesAndCoordinates,
    setOpen,
    setMessage,
  });

  // Initial load
  // Sync chordData if initialChords or initialChordData prop changes
  useEffect(() => {
    if (initialChordData) {
      // If we have initialChordData, convert it to a Chord with VexFlow objects
      setChordData(toChordWithVexFlow(initialChordData, chosenClef));
    } else if (initialChords && initialChords.length > 0) {
      // Otherwise use initialChords
      setChordData((prev) => ({ ...prev, keys: initialChords }));
    } else {
      // Or reset to empty
      setChordData({
        keys: [],
        duration: "w",
        staveNotes: null,
        userClickY: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    JSON.stringify(initialChords),
    JSON.stringify(initialChordData),
    chosenClef,
  ]);

  // Trigger VexFlow render whenever chordData changes
  useEffect(() => {
    if (renderFunctionRef.current) {
      renderFunctionRef.current();
    }
  }, [chordData]);

  // Call onChange whenever chordData.keys changes
  useEffect(() => {
    // Make sure we have valid keys before calling onChange
    if (chordData && Array.isArray(chordData.keys)) {
      onChange(chordData.keys);
    } else {
      onChange([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(chordData?.keys)]);

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
  }, []);

  useEffect(() => {
    renderFunctionRef.current?.();
  }, [chordData]);

  const eraseChord = () => {
    // Reset to empty chord
    setChordData({
      keys: [],
      duration: "w",
      staveNotes: null,
      userClickY: 0,
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

  const handleClick = (e: React.MouseEvent) => {
    const clickInfo = getClickInfo(e);
    if (!clickInfo) return;

    const { userClickX, foundNoteData } = clickInfo;

    let chordDataCopy = { ...chordData };
    let notesAndCoordinatesCopy = [...notesAndCoordinates];

    // We don't need barIndex for triads, but we'll keep the function call
    // to maintain compatibility with the rest of the code
    findBarIndex(staves, userClickX);

    const foundNoteIndex: number = chordData.keys.findIndex(
      (note) => note === foundNoteData?.note
    );

    const {
      chordData: newChordData,
      notesAndCoordinates: newNotesAndCoordinates,
    } = handleChordInteraction(
      notesAndCoordinatesCopy,
      buttonStates,
      foundNoteData,
      chordDataCopy,
      foundNoteIndex,
      chosenClef
    );

    setNotesAndCoordinates(() => newNotesAndCoordinates);
    setChordData(() => newChordData);
  };

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
            active={buttonStates.isEnterNoteActive}
          >
            Enter Note
          </CustomButton>
          <CustomButton
            onClick={() => {
              clearAllStates();
              setters.setIsEraseNoteActive(true);
            }}
            active={buttonStates.isEraseNoteActive}
          >
            Erase Note
          </CustomButton>
          <CustomButton
            onClick={() => {
              clearAllStates();
              setters.setIsSharpActive(true);
            }}
            active={buttonStates.isSharpActive}
          >
            Add Sharp
          </CustomButton>
          <CustomButton
            onClick={() => {
              clearAllStates();
              setters.setIsFlatActive(true);
            }}
            active={buttonStates.isFlatActive}
          >
            Add Flat
          </CustomButton>
          <CustomButton
            onClick={() => {
              clearAllStates();
              setters.setIsEraseAccidentalActive(true);
            }}
            active={buttonStates.isEraseAccidentalActive}
          >
            Erase Accidental
          </CustomButton>
          <CustomButton onClick={eraseChord}>Clear All</CustomButton>
        </Container>
      </NotationContainer>
    </>
  );
};

export default NotateChord;
