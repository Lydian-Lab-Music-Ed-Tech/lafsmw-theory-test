/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Container } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import VexFlow from "vexflow";
import { useClef } from "../context/ClefContext";
import { buildKeySignature } from "../lib/buildKeySignature";
import calculateNotesAndCoordinates from "../lib/calculateNotesAndCoordinates";
import { keySigArray } from "../lib/data/keySigArray";
import { staveData } from "../lib/data/stavesData";
import { handleKeySigInteraction } from "../lib/handleKeySigInteraction";
import { initialNotesAndCoordsState } from "../lib/initialStates";
import isClickWithinStaveBounds from "../lib/isClickWithinStaveBounds";
import { setupRendererAndDrawStaves } from "../lib/setUpRendererAndDrawStaves";
import { GlyphProps, NotesAndCoordinatesData, StaveType } from "../lib/types";
import { useButtonStates } from "../lib/useButtonStates";
import { useNotationRenderer } from "../lib/hooks/useNotationRenderer";
import { useNotationClickHandler } from "../lib/hooks/useNotationClickHandler";
import CustomButton from "./CustomButton";
import NotationContainer from "./NotationContainer";

const { Renderer } = VexFlow.Flow;

//weird glitch is still happening. Figure out why!

const NotateKeySignature = ({ setKeySignatureNotation }: any) => {
  const container = useRef<HTMLDivElement | null>(null);
  const [staves, setStaves] = useState<StaveType[]>([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("No note found at click position");
  const [notesAndCoordinates, setNotesAndCoordinates] = useState<
    NotesAndCoordinatesData[]
  >([initialNotesAndCoordsState]);
  const [glyphs, setGlyphs] = useState<GlyphProps[]>([]);
  const [keySig, setKeySig] = useState<string[]>([]);
  const renderCount = useRef(0);
  const { chosenClef } = useClef();
  const { states, setters, clearAllStates } = useButtonStates();

  // Set up rendering function with the circular dependency pattern
  const renderFunctionRef = useRef<(() => StaveType[] | undefined) | null>(null);
  
  // Initialize the renderer with a stable renderFunction that uses renderFunctionRef
  const { rendererRef, render } = useNotationRenderer({
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

  const context = rendererRef.current?.getContext();

  // Define the actual rendering logic - this will be called via the ref
  renderFunctionRef.current = useCallback(
    (): StaveType[] | undefined => {
      if (!rendererRef.current) return undefined;
      
      return setupRendererAndDrawStaves({
        rendererRef,
        ...staveData,
        chosenClef,
        staves,
        firstStaveWidth: 450,
      });
    },
    [chosenClef, staves, rendererRef]
  );

  // Set up click handler
  const { getClickInfo } = useNotationClickHandler({
    containerRef: container,
    staves,
    notesAndCoordinates,
    setOpen,
    setMessage,
  });

  // Initial load - happens only when chosenClef changes, not on every render
  // We're removing render from the dependency array to avoid infinite loops
  useEffect(() => {
    const loadStaves = () => {
      // Use the explicit render function from the hook
      const newStaves = render();
      if (newStaves) {
        setStaves(newStaves);
        calculateNotesAndCoordinates(
          chosenClef,
          setNotesAndCoordinates,
          newStaves,
          keySigArray,
          0,
          1,
          0
        );
      }
    };
    
    loadStaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenClef]); // Intentionally removing render from deps to prevent loops

  // Update glyphs when changed
  useEffect(() => {
    if (context && staves.length > 0) {
      // Clear and redraw without recreating the staves
      context.clear();
      staves[0].setContext(context).draw();
      buildKeySignature(glyphs, 40, context, staves[0]);
    }
  }, [glyphs, context, staves]);
  
  // Manual re-render after glyph changes - without this effect to avoid circular dependencies
  // We'll handle glyph persistence in the handleClick function instead


  // Update parent component with key signature
  useEffect(() => {
    if (setKeySignatureNotation) {
      setKeySignatureNotation(keySig);
    }
  }, [keySig, setKeySignatureNotation]);

  const clearKey = () => {
    setGlyphs([]);
    setKeySig([]);
    clearAllStates();
    
    // Use the explicit render function from the hook
    const newStaves = render();
    if (newStaves) {
      calculateNotesAndCoordinates(
        chosenClef,
        setNotesAndCoordinates,
        newStaves,
        keySigArray,
        0,
        1,
        0
      );
      
      // Ensure staves are updated properly
      if (context) {
        context.clear();
        newStaves[0].setContext(context).draw();
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    renderCount.current += 1;

    const clickInfo = getClickInfo(e);
    if (!clickInfo) return;

    const {
      userClickX,
      userClickY,
      topStaveYCoord,
      bottomStaveYCoord,
      foundNoteData,
    } = clickInfo;

    if (
      !isClickWithinStaveBounds(
        staves[0],
        topStaveYCoord,
        bottomStaveYCoord,
        userClickX,
        userClickY,
        setMessage,
        setOpen
      )
    ) {
      return;
    }

    let notesAndCoordinatesCopy = [...notesAndCoordinates];

    // Handle the key signature interaction
    // This will update glyphs via setGlyphs internally AND return the updated glyphs
    const { notesAndCoordinates: newNotesAndCoordinates, updatedGlyphs } = handleKeySigInteraction(
      notesAndCoordinatesCopy,
      states,
      foundNoteData,
      userClickX,
      userClickY,
      setGlyphs,
      glyphs,
      setKeySig,
      keySig
    );
    
    // Update notesAndCoordinates 
    setNotesAndCoordinates(newNotesAndCoordinates);
    
    // Immediately draw with our manually calculated updated glyphs
    // This ensures we see the update immediately, not on the next click
    if (context && staves.length > 0) {
      context.clear();
      staves[0].setContext(context).draw();
      buildKeySignature(updatedGlyphs, 40, context, staves[0]);
    }
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
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 1,
            padding: 2,
          }}
        >
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
          <CustomButton onClick={clearKey}>Clear Key</CustomButton>
        </Container>
      </NotationContainer>
    </>
  );
};

export default NotateKeySignature;
