"use client";
import React, { useRef, useEffect, useState } from "react";
import VexFlow from "vexflow";
const VF = VexFlow.Flow;
const { Formatter, Renderer, StaveNote, Stave } = VF;
import generateNoteCoordinates from "../components/generateNoteCoordinates";
import noteArray from "@/lib/noteArray";
import CheckNumBeatsInMeasure from "../components/CheckNumBeatsInMeasure";
import KaseyBlankStaves from "../components/KaseyBlankStaves";
import findBar from "../lib/findBar";
type StaveType = InstanceType<typeof Stave>;
type StaveNoteType = InstanceType<typeof StaveNote>;
import { Snackbar, Alert } from "@mui/material/";
import { renderBlueButton } from "../components/RenderButtons";

const clef = "treble";
const timeSig = "4/4";
const beatsInMeasure = parseInt(timeSig.split("/")[0]);
let numStaves = 4;
let yPositionOfStaves = 150;
const notesArray = noteArray();

const CreateAndEraseNotesFromStave = () => {
  const rendererRef = useRef<InstanceType<typeof Renderer> | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const [bars, setBars] = useState<StaveType[]>([]);
  const [notes, setNotes] = useState<StaveNoteType[][]>(
    new Array(numStaves).fill([])
  );
  const [isEraserActive, setIsEraserActive] = useState(false);
  const [isEnterNotesActive, setIsEnterNotesActive] = useState(false);
  const [noteNotFound, setNoteNotFound] = useState(false);
  const [tooManyBeatsInMeasure, setTooManyBeatsInMeasure] = useState(false);

  const eraser = () => {
    setIsEraserActive(!isEraserActive);
    setIsEnterNotesActive(false);
  };

  const enterNotes = () => {
    setIsEnterNotesActive(!isEnterNotesActive);
    setIsEraserActive(false);
  };

  const createRenderer = () => {
    if (!rendererRef.current && container.current) {
      rendererRef.current = new Renderer(
        container.current,
        Renderer.Backends.SVG
      );
    }
  };

  const renderStavesAndNotes = () => {
    const renderer = rendererRef.current;
    const context = renderer && renderer.getContext();
    context?.setFont("Arial", 10);
    context?.clear();
    if (context) {
      context &&
        setBars(() =>
          KaseyBlankStaves(
            numStaves,
            context,
            240,
            180,
            10,
            yPositionOfStaves,
            clef,
            timeSig
          )
        );
    }
    notes.forEach((staveNotes, index) => {
      if (staveNotes.length > 0) {
        context && Formatter.FormatAndDraw(context, bars[index], staveNotes);
      }
    });
  };

  const clearMeasures = () => {
    setNotes(() => {
      const newArrays = new Array(numStaves).fill([]);
      return newArrays;
    });
    createRenderer();
    renderStavesAndNotes();
  };

  useEffect(() => {
    createRenderer();
    const renderer = rendererRef.current;
    renderer?.resize(800, 300);
    const context = renderer && renderer.getContext();
    context?.setFont("Arial", 10);
    context &&
      setBars(
        KaseyBlankStaves(
          4,
          context,
          240,
          180,
          10,
          yPositionOfStaves,
          clef,
          timeSig
        )
      );
  }, []);

  useEffect(() => {
    renderStavesAndNotes();
  }, [notes]);

  //rename variables
  const newFindBar = () => {
    const barWidthArrayOfObjects = bars.map((bar, index) => {
      const barWidth = bar.getWidth();
      const barWidthForBar1 = bars[0].getWidth();
      let xMaxCoordinate = barWidthForBar1 + bars[1].getWidth() * index;
      return {
        barWidth,
        xMaxCoordinate,
      };
    });
    return barWidthArrayOfObjects;
  };

  console.log(newFindBar());
  const handleClick = (e: React.MouseEvent) => {
    const rect = container.current?.getBoundingClientRect();
    let x = rect ? e.clientX - rect.left : 0;
    const y = rect ? e.clientY - rect.top : 0;
    const topStaveYPosition = bars[0].getYForTopText();
    const highG = topStaveYPosition - 33;

    let findNoteObject =
      rect?.top &&
      generateNoteCoordinates(highG, notesArray).find(
        ({ yCoordinateMin, yCoordinateMax }) =>
          y >= yCoordinateMin && y <= yCoordinateMax
      );
    const newBarIndex = findBar(x, 240, 420, 600);

    let newNotes = [...notes];

    if (!findNoteObject) {
      setNoteNotFound(true);
    } else if (isEraserActive) {
      if (newNotes[newBarIndex]) {
        newNotes[newBarIndex].pop();
      }
    } else if (
      newNotes[newBarIndex] &&
      newNotes[newBarIndex].length >= beatsInMeasure
    ) {
      setTooManyBeatsInMeasure(true);
    } else {
      const newStaveNote: StaveNoteType = new StaveNote({
        keys: [findNoteObject.note],
        duration: "q",
      });
      newNotes[newBarIndex] = [...newNotes[newBarIndex], newStaveNote];
    }
    setNotes(() => newNotes);
  };

  return (
    <>
      <div ref={container} onClick={handleClick} />
      <CheckNumBeatsInMeasure
        tooManyBeatsInMeasure={tooManyBeatsInMeasure}
        setTooManyBeatsInMeasure={setTooManyBeatsInMeasure}
      />
      <Snackbar
        open={noteNotFound}
        autoHideDuration={4000}
        onClose={() => setNoteNotFound(false)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert variant="filled" severity="error">
          {"The location you clicked doesn't correspond to a note"}
        </Alert>
      </Snackbar>
      <div className="mt-2 ml-3">
        {renderBlueButton(eraser, "Eraser", isEraserActive)}
        {renderBlueButton(enterNotes, "Enter Notes", isEnterNotesActive)}
        {renderBlueButton(clearMeasures, "Clear Measures")}
      </div>
    </>
  );
};

export default CreateAndEraseNotesFromStave;
