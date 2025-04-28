/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Container from "@mui/material/Container";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Flow } from "vexflow";
import { useClef } from "../context/ClefContext";
import calculateNotesAndCoordinates from "../lib/calculateNotesAndCoordinates";
import { errorMessages } from "../lib/data/errorMessages";
import {
  bassClefNotesArray,
  trebleClefNotesArray,
} from "../lib/data/noteArray";
import { staveData } from "../lib/data/stavesData";
import { findBarIndex } from "../lib/findBar";
import { HandleScaleInteraction } from "../lib/handleScaleInteraction";
import { useButtonStates } from "../lib/hooks/useButtonStates";
import { useNotationClickHandler } from "../lib/hooks/useNotationClickHandler";
import { useNotationRenderer } from "../lib/hooks/useNotationRenderer";
import { initialNotesAndCoordsState } from "../lib/initialStates";
import { setupRendererAndDrawNotes } from "../lib/setupRendererAndDrawNotes";
import { NotesAndCoordinatesData, ScaleData, StaveType } from "../lib/types";
import CustomButton from "./CustomButton";
import NotationContainer from "./NotationContainer";

const NotateScale = ({
  initialScaleData = [[]],
  onChange,
}: {
  initialScaleData?: ScaleData[][];
  onChange?: (scaleData: ScaleData[][], scales: string[]) => void;
}) => {
  const container = useRef<HTMLDivElement | null>(null);
  const [staves, setStaves] = useState<StaveType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [notesAndCoordinates, setNotesAndCoordinates] = useState<
    NotesAndCoordinatesData[]
  >([initialNotesAndCoordsState]);
  
  const { buttonStates, setters, clearAllStates } = useButtonStates();
  const { chosenClef } = useClef();
  
  // Deserialize scale data and reconstruct VexFlow objects if needed
  const deserializeScaleData = (data: any) => {
    // Handle legacy array format
    if (Array.isArray(data)) {
      if (!data || data.length === 0) return [[]];
      
      return data.map(bar => 
        bar.map((note: any) => {
          // Skip if there are no keys or the staveNote is already present
          if (!note.keys || note.keys.length === 0 || note.staveNote) {
            return note;
          }
          
          // Recreate the VexFlow staveNote object
          try {
            const newStaveNote = new Flow.StaveNote({
              keys: Array.isArray(note.keys) ? [...note.keys] : [note.keys],
              duration: note.duration || "q",
              clef: chosenClef
            });
            
            // Add accidentals if needed
            const keyToCheck = Array.isArray(note.keys) ? note.keys[0] : note.keys;
            if (keyToCheck && keyToCheck.includes("#")) {
              newStaveNote.addModifier(new Flow.Accidental("#"), 0);
            } else if (keyToCheck && keyToCheck.includes("b")) {
              newStaveNote.addModifier(new Flow.Accidental("b"), 0);
            }
            
            return {
              ...note,
              staveNote: newStaveNote
            };
          } catch (error) {
            console.error("Error recreating stave note:", error);
            return note;
          }
        })
      );
    } 
    // Handle new flat object format
    else if (data && typeof data === 'object' && data.type === 'serialized_scale_data') {
      const barCount = data.barCount || 1;
      const result: ScaleData[][] = Array(barCount).fill([]).map(() => []);
      
      // Reconstruct the 2D array from the flat structure
      Object.keys(data).forEach(key => {
        if (key.startsWith('note_')) {
          const note = data[key];
          const barIndex = note.barIndex || 0;
          
          if (!result[barIndex]) {
            result[barIndex] = [];
          }
          
          // Create a proper ScaleData object with VexFlow StaveNote
          try {
            let keyArray = [];
            if (note.keys) {
              keyArray = typeof note.keys === 'string' ? [note.keys] : note.keys;
            }
            
            if (keyArray.length > 0) {
              const newStaveNote = new Flow.StaveNote({
                keys: keyArray,
                duration: note.duration || "q",
                clef: chosenClef
              });
              
              // Add accidentals if needed
              const keyToCheck = keyArray[0];
              if (keyToCheck && keyToCheck.includes("#")) {
                newStaveNote.addModifier(new Flow.Accidental("#"), 0);
              } else if (keyToCheck && keyToCheck.includes("b")) {
                newStaveNote.addModifier(new Flow.Accidental("b"), 0);
              }
              
              result[barIndex][note.noteIndex] = {
                keys: keyArray,
                duration: note.duration || "q",
                exactX: note.exactX,
                userClickY: note.userClickY,
                staveNote: newStaveNote
              };
            }
          } catch (error) {
            console.error("Error reconstructing note from serialized data:", error);
          }
        }
      });
      
      return result;
    }
    
    // Default empty state
    return [[]];
  };

  // Initialize state after we have access to chosenClef
  const [scaleDataMatrix, setScaleDataMatrix] = useState<ScaleData[][]>([[]]);

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
      setupRendererAndDrawNotes({
        rendererRef: rendererRef as React.RefObject<
          InstanceType<typeof Flow.Renderer>
        >,
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
    setMessage,
  });

  // Initial load
  useEffect(() => {
    // Initialize VexFlow staveNote objects if needed
    if (initialScaleData) {
      const deserializedData = deserializeScaleData(initialScaleData);
      if (deserializedData[0]?.length > 0 || 
          (typeof initialScaleData === 'object' && 'type' in initialScaleData && initialScaleData.type === 'serialized_scale_data')) {
        setScaleDataMatrix(deserializedData);
      }
    }
    
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
  }, [initialScaleData, chosenClef]);

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

    // Notify parent of cleared scale data
    if (onChange) {
      onChange([[]], []);
    }
  };

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const clickInfo = getClickInfo(e);
      if (!clickInfo) {
        console.error("No valid click info found");
        return;
      }

      const { userClickX, userClickY, foundNoteData } = clickInfo;

      const barIndex = findBarIndex(staves, userClickX);

      const safeCloneNote = (note: ScaleData): ScaleData => {
        let newStaveNote = null;
        if (note.keys && note.keys.length > 0) {
          newStaveNote = new Flow.StaveNote({
            keys: [...note.keys],
            duration: note.duration || "q",
            clef: chosenClef,
          });
        }

        return {
          keys: note.keys ? [...note.keys] : [],
          duration: note.duration || "q",
          exactX: note.exactX,
          userClickY: note.userClickY,
          staveNote: newStaveNote,
        };
      };

      let scaleDataMatrixCopy = scaleDataMatrix.map((bar) =>
        bar.map((note) => safeCloneNote(note))
      );
      let notesAndCoordinatesCopy = notesAndCoordinates.map((note) => ({
        ...note,
      }));

      if (!scaleDataMatrixCopy[barIndex]) {
        console.error("Invalid bar index:", barIndex);
        return;
      }

      const barOfScaleData = scaleDataMatrixCopy[barIndex];

      const isAccidentalMode =
        buttonStates.isSharpActive || buttonStates.isFlatActive;

      if (isAccidentalMode && scaleDataMatrix[0].length > 0) {
        for (let i = 0; i < barOfScaleData.length; i++) {
          const originalNote = scaleDataMatrix[barIndex]?.[i];
          if (originalNote && originalNote.exactX !== undefined) {
            // Use the most current exactX value from the rendered note
            barOfScaleData[i].exactX = originalNote.exactX;
          }
        }
      }

      // Process the interaction using our handler function
      const {
        scaleDataMatrix: newScaleDataMatrix,
        notesAndCoordinates: newNotesAndCoordinates,
      } = HandleScaleInteraction(
        foundNoteData,
        notesAndCoordinatesCopy,
        barOfScaleData,
        scaleDataMatrixCopy,
        buttonStates,
        userClickX,
        userClickY,
        barIndex,
        chosenClef,
        setMessage,
        setOpen,
        errorMessages
      );

      // We must use setState with a function to ensure we're working with
      // the latest state and properly merge the new values
      setScaleDataMatrix((prevState) => {
        // console.log(
        //   "- Previous state had:",
        //   prevState.map(
        //     (bar) =>
        //       `${bar.length} notes (${bar.map((n) => n?.keys?.[0] || "unknown").join(", ")})`
        //   )
        // );
        // console.log(
        //   "- New state has:",
        //   newScaleDataMatrix.map(
        //     (bar) =>
        //       `${bar.length} notes (${bar.map((n) => n?.keys?.[0] || "unknown").join(", ")})`
        //   )
        // );

        // This ensures we properly replace the state with the new complete state
        return [...newScaleDataMatrix];
      });

      setNotesAndCoordinates((prevCoords) => {
        return [...newNotesAndCoordinates];
      });

      // Update the scales display and notify parent via onChange - safely extract just the key strings
      try {
        // Log the matrix structure for debugging
        console.log("Current scale matrix structure:", JSON.stringify({
          barCount: newScaleDataMatrix.length,
          notesInFirstBar: newScaleDataMatrix[0]?.length || 0,
          hasKeys: newScaleDataMatrix[0]?.some(note => note.keys && note.keys.length > 0)
        }));
        
        // Extract the note keys for display
        const scaleStrings = newScaleDataMatrix[0]
          .map((note: ScaleData) => {
            const keyString = Array.isArray(note.keys) ? note.keys[0] : "";
            return keyString;
          })
          .filter((note) => note !== "");
        
        console.log("Extracted scale strings:", scaleStrings);

        if (onChange) {
          console.log("Calling onChange with scale data");
          onChange(newScaleDataMatrix, scaleStrings);
        }
      } catch (error) {
        console.error("Error updating scale display:", error);
      }
    },
    [scaleDataMatrix, notesAndCoordinates, staves, chosenClef, buttonStates]
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
              // Force a render to ensure state is updated before next click
              renderFunctionRef.current?.();
              setTimeout(() => {
                console.log("Button states confirmation after update:", {
                  isSharpActive: buttonStates.isSharpActive,
                  isFlatActive: buttonStates.isFlatActive,
                  isEnterNoteActive: buttonStates.isEnterNoteActive,
                });
              }, 100); // Slightly longer delay to ensure state updates
            }}
            active={buttonStates.isSharpActive}
          >
            Add Sharp
          </CustomButton>
          <CustomButton
            onClick={() => {
              clearAllStates();
              setters.setIsFlatActive(true);
              renderFunctionRef.current?.();
              setTimeout(() => {
                console.log("Button states confirmation after update:", {
                  isSharpActive: buttonStates.isSharpActive,
                  isFlatActive: buttonStates.isFlatActive,
                  isEnterNoteActive: buttonStates.isEnterNoteActive,
                });
              }, 100);
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
          <CustomButton onClick={eraseMeasures}>Clear All</CustomButton>
        </Container>
      </NotationContainer>
    </>
  );
};

export default NotateScale;
