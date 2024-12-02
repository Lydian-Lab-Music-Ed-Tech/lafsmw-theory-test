"use client";
import { useEffect, useRef } from "react";
import * as Flow from "vexflow";
import { Chord } from "../lib/typesAndInterfaces";

type StaffProps = {
  chosenClef: string;
  timeSignature?: string;
  noTimeSignature?: boolean;
  evenbars?: boolean;
  width?: number;
  height?: number;
  addDoubleBarLine?: boolean;
  numBars?: number;
  chords?: Chord[];
};

export default function Staff({
  chosenClef,
  timeSignature = "4/4",
  noTimeSignature = false,
  evenbars = false,
  width = 1650,
  height = 110,
  addDoubleBarLine = false,
  numBars = 4,
  chords = [],
}: StaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Flow.Renderer | null>(null);

  // Gather needed width info - slightly different calculations than other components.
  const fullWidth = width * 0.97;
  let widthOfFirstBar = !evenbars ? width / numBars + 50 : width / numBars;
  const widthOfRemainingBars =
    (fullWidth - 34 - widthOfFirstBar) / (numBars - 1);

  // helper function to check for accidentals for each note in the "keys" array of each chord ("keys" refers to the notes in the chord).
  function noteGroupAccidentalsCheck(keys: string[]): [string, number][] {
    let noteAccidentals: [string, number][] = [];
    for (let i = 0; i < keys.length; i++) {
      let currentKey = keys[i];
      if (currentKey.includes("bb")) {
        noteAccidentals.push(["b", i]);
      }
      if (currentKey.includes("b") && currentKey[0] !== "b") {
        noteAccidentals.push(["b", i]);
      }
      if (currentKey.includes("#")) {
        noteAccidentals.push(["#", i]);
      }
    }
    return noteAccidentals;
  }

  useEffect(() => {
    const { Renderer, Stave, StaveNote, Accidental, Formatter } = Flow;

    const contRefCurrent = containerRef.current;

    const spaceAboveStaff = {
      space_above_staff_ln: -0.5,
    };

    if (contRefCurrent) {
      rendererRef.current = new Renderer(contRefCurrent, Renderer.Backends.SVG);

      const renderer = rendererRef.current;

      // Configure the rendering context.
      renderer.resize(width, height);
      const rendererContext = renderer.getContext();
      rendererContext.setFont("Arial", 10);

      for (let i = 0; i < numBars; i++) {
        // Create the staves, determining the width of the first and other staves and providing a clef and time signature for the first stave as needed.
        const stave = new Stave(
          i === 0 ? 17 : widthOfFirstBar + (i - 1) * widthOfRemainingBars + 17,
          40,
          i === 0 ? widthOfFirstBar : widthOfRemainingBars,
          spaceAboveStaff
        );

        if (i === 0) {
          noTimeSignature
            ? stave.addClef(chosenClef)
            : stave.addClef(chosenClef).addTimeSignature(timeSignature);
        }
        if (i === numBars - 1 && addDoubleBarLine) {
          stave.setEndBarType(3);
        }
        // Connect the stave to the rendering context and draw.
        stave.setContext(rendererContext).draw();

        if (chords.length > 0) {
          // Create each chord as a StaveNote.
          let notesMeasure = [new StaveNote(chords[i])];

          // Determine if any accidentals are needed for the current chord.
          let noteGroupAccidentals = noteGroupAccidentalsCheck(chords[i].keys);

          // Add accidentals to notes of each chord as needed.
          noteGroupAccidentals.forEach((accidental) => {
            notesMeasure[0].addModifier(
              new Accidental(accidental[0]),
              accidental[1]
            );
          });

          // Format and draw the chord on the current stave.
          Formatter.FormatAndDraw(rendererContext, stave, notesMeasure);
        }
      }

      // clean up function to remove the svg.
      return () => {
        contRefCurrent.innerHTML = "";
      };
    }
  }, [
    addDoubleBarLine,
    chords,
    chosenClef,
    widthOfFirstBar,
    height,
    noTimeSignature,
    numBars,
    widthOfRemainingBars,
    timeSignature,
    width,
    evenbars,
  ]);

  return <div role="presentation" ref={containerRef} />;
}
