"use client";
import { Container } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Flow } from "vexflow";
import { useClef } from "../context/ClefContext";
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
import { useStaffHover } from "../lib/hooks/useStaffHover";
import { initialNotesAndCoordsState } from "../lib/initialStates";
import { setupRendererAndDrawChords } from "../lib/setUpRendererAndDrawChords";
import { toChordWithVexFlow } from "../lib/toChordWithVexFlow";
import {
  Chord,
  NotesAndCoordinatesData,
  NotateChordProps,
  StaveType,
} from "../lib/types";
import CustomButton from "./CustomButton";
import NotationContainer from "./NotationContainer";

const NotateChord = ({ initialChordData, onChange }: NotateChordProps) => {
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
      keys: [],
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

  // Create a ref for staves to pass to useStaffHover
  const stavesRef = useRef<StaveType[]>(staves);
  useEffect(() => {
    stavesRef.current = staves;
  }, [staves]);

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

  // Use the staff hover hook
  const scaleFactor = 1.5; // Matches useNotationRenderer default
  const { hoveredStaffElement, mouseMoveHandler, mouseLeaveHandler } =
    useStaffHover({
      containerRef: container,
      stavesRef,
      scaleFactor,
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
  // Sync chordData if initialChordData prop changes
  useEffect(() => {
    if (initialChordData) {
      // If we have initialChordData, convert it to a Chord with VexFlow objects
      setChordData(toChordWithVexFlow(initialChordData, chosenClef));
    } else {
      // Or reset to empty
      setChordData({
        keys: [],
        duration: "w",
        staveNotes: null,
        userClickY: 0,
      });
    }
  }, [JSON.stringify(initialChordData), chosenClef]);

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
    if (
      rendererRef.current &&
      stavesRef.current &&
      stavesRef.current.length > 0
    ) {
      const context = rendererRef.current.getContext();
      const currentStaveObject = stavesRef.current[0];

      context.clear(); // Clear before redraw
      if (renderFunctionRef.current) {
        renderFunctionRef.current(); // Redraws staves and notes/chords
      }

      // Draw hover effect if present
      if (hoveredStaffElement) {
        context.save();
        context.fillStyle = "var(--highLightBlue)";

        const staveRenderX = currentStaveObject.getNoteStartX();
        const staveRenderWidth =
          currentStaveObject.getNoteEndX() - staveRenderX;

        if (hoveredStaffElement.type === "line") {
          const lineY = hoveredStaffElement.y;
          context.fillRect(
            staveRenderX,
            lineY - hoveredStaffElement.height / 2,
            staveRenderWidth,
            hoveredStaffElement.height
          );
        } else {
          // space
          const spaceY = hoveredStaffElement.y; // y is the line above the space
          context.fillRect(
            staveRenderX,
            spaceY, // Start at the line above the space
            staveRenderWidth,
            hoveredStaffElement.height // Height of the space
          );
        }
        context.restore();
      }
    }
  }, [hoveredStaffElement, rendererRef, stavesRef, renderFunctionRef]);

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
        onMouseMove={mouseMoveHandler}
        onMouseLeave={mouseLeaveHandler}
        open={open}
        setOpen={setOpen}
        message={message}
      >
        <Container
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 0.5,
            paddingTop: 4,
            marginTop: 2,
            width: "760px",
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
          <CustomButton onClick={eraseChord}>Clear All</CustomButton>
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
        </Container>
      </NotationContainer>
    </>
  );
};

export default NotateChord;
