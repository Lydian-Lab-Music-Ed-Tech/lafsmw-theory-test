"use client";
import { notesArray } from "../lib/noteArray";
import { Alert, Snackbar } from "@mui/material/";
import React, { useEffect, useRef, useState } from "react";
import VexFlow from "vexflow";
import CheckNumBeatsInMeasure from "../components/CheckNumBeatsInMeasure";
import KaseyBlankStaves from "../components/KaseyBlankStaves";
import { renderBlueButton } from "../components/RenderButtons";
import { findBarIndex } from "../lib/findBar";
import generateNoteCoordinates from "../lib/generateNoteCoordinates";
const VF = VexFlow.Flow;
const { Formatter, Renderer, StaveNote, Stave, Accidental } = VF;

type StaveType = InstanceType<typeof Stave>;
type StaveNoteType = InstanceType<typeof StaveNote>;

interface NoteType {
  newStaveNote: StaveNoteType;
  x: number;
  y: number;
}

const clef = "treble";
const timeSig = "4/4";
const beatsInMeasure = parseInt(timeSig.split("/")[0]);
let numStaves = 4;
let yPositionOfStaves = 150;

const initialNotes: NoteType[][] = new Array(numStaves).fill([]);

const CreateAndEraseNotesFromStave = () => {
  const rendererRef = useRef<InstanceType<typeof Renderer> | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const [bars, setBars] = useState<StaveType[]>([]);
  const [notes, setNotes] = useState(initialNotes);
  const [isEraserActive, setIsEraserActive] = useState(false);
  const [isEnterNotesActive, setIsEnterNotesActive] = useState(true);
  const [noteNotFound, setNoteNotFound] = useState(false);
  const [tooManyBeatsInMeasure, setTooManyBeatsInMeasure] = useState(false);
  const [isSharpActive, setIsSharpActive] = useState(false);
  const [isFlatActive, setIsFlatActive] = useState(false);

  console.log(notes);
  const eraser = () => {
    setIsEraserActive(!isEraserActive);
    setIsEnterNotesActive(false);
  };

  const enterNotes = () => {
    setIsEnterNotesActive(true);
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
    notes.forEach((noteArray, index) => {
      if (noteArray) {
        const staveNotes = noteArray
          .map(({ newStaveNote }) => newStaveNote)
          .filter((note): note is StaveNoteType => note !== undefined);
        if (staveNotes.length > 0) {
          context && Formatter.FormatAndDraw(context, bars[index], staveNotes);
        }
      }
    });
  };

  const clearMeasures = () => {
    setNotes(() => initialNotes);
    createRenderer();
    renderStavesAndNotes();
    setIsEraserActive(false);
  };

  const addSharp = () => {
    setIsSharpActive(!isSharpActive);
    setIsEnterNotesActive(false);
    setIsFlatActive(false);
  };
  const addFlat = () => {
    setIsFlatActive(!isFlatActive);
    setIsEnterNotesActive(false);
    setIsSharpActive(false);
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

  const handleClick = (e: React.MouseEvent) => {
    const rect = container.current?.getBoundingClientRect();
    const x = rect ? e.clientX - rect.left : 0;
    const y = rect ? e.clientY - rect.top : 0;
    const topStaveYPosition = bars[0].getYForTopText();
    const highG = topStaveYPosition - 33;

    let noteObject = generateNoteCoordinates(highG, notesArray).find(
      ({ yCoordinateMin, yCoordinateMax }) =>
        y >= yCoordinateMin && y <= yCoordinateMax
    );

    if (noteObject)
      noteObject = {
        ...noteObject,
        userClickXCoordinate: x,
        userClickYCoordinate: y,
      };

    const barIndex = findBarIndex(bars, x);
    let notesCopy = [...notes];

    const barOfStaveNotes = notesCopy[barIndex];
    if (!noteObject) {
      setNoteNotFound(true);
    } else if (isEraserActive) {
      const indexOfNoteToErase: number = barOfStaveNotes?.findIndex(
        (note) =>
          note.y >= noteObject.yCoordinateMin &&
          note.y <= noteObject.yCoordinateMax
      );
      if (indexOfNoteToErase !== -1) {
        barOfStaveNotes.splice(indexOfNoteToErase, 1);
      }
    } else if (isSharpActive) {
      if (noteObject) {
        const indexOfNoteToSharp: number = barOfStaveNotes?.findIndex(
          (note) =>
            note.y >= noteObject.yCoordinateMin &&
            note.y <= noteObject.yCoordinateMax
        );
        if (indexOfNoteToSharp !== -1) {
          barOfStaveNotes[indexOfNoteToSharp].newStaveNote.addModifier(
            new Accidental("#")
          );
        }
      }
    } else if (isFlatActive) {
      const indexOfNoteToFlat = barOfStaveNotes.findIndex(
        (note) =>
          note.y >= noteObject.yCoordinateMin &&
          note.y <= noteObject.yCoordinateMax
      );
      if (indexOfNoteToFlat !== -1) {
        barOfStaveNotes[indexOfNoteToFlat].newStaveNote?.addModifier(
          new Accidental("b")
        );
      }
    } else if (barOfStaveNotes && barOfStaveNotes.length >= beatsInMeasure) {
      setTooManyBeatsInMeasure(true);
    } else {
      const newStaveNote: StaveNoteType = new StaveNote({
        keys: [noteObject.note],
        duration: "q",
      });
      if (notes[0])
        notesCopy[barIndex] = [...barOfStaveNotes, { newStaveNote, x, y }];
    }
    setNotes(() => notesCopy);
    setIsEraserActive(false);
    setIsSharpActive(false);
    setIsFlatActive(false);
    setIsEnterNotesActive(true);
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
        {renderBlueButton(addSharp, "#", isSharpActive)}
        {renderBlueButton(addFlat, "b", isFlatActive)}
      </div>
    </>
  );
};

export default CreateAndEraseNotesFromStave;
