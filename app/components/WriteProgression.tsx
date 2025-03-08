"use client";
import Stack from "@mui/material/Stack";
import { ForwardedRef, forwardRef, useEffect, useState } from "react";
import { useClef } from "../context/ClefContext";
import keyNames from "../lib/data/keyNamesText";
import { initialProgressionInputState } from "../lib/initialStates";
import isCurrentDataFilled from "../lib/isCurrentDataFilled";
import { ChangeEvent, FormEvent, WriteProps } from "../lib/types";
import FormInput from "./FormInput";
import Staff from "./Staff";

export default forwardRef(function WriteProgression(
  { width, handleInput, currentData }: WriteProps,
  ref: ForwardedRef<HTMLFormElement>
) {
  const [numeralInput, setNumeralInput] = useState<Record<string, string>>(
    initialProgressionInputState
  );

  const { chosenClef } = useClef();

  useEffect(() => {
    if (currentData && isCurrentDataFilled(currentData)) {
      setNumeralInput(currentData);
    } else {
      setNumeralInput(initialProgressionInputState);
    }
  }, [currentData]);

  const chordWidth = width * 0.058;
  const gapWidth = chordWidth * 0.15;
  const chordGroupSpacing = chordWidth * 0.05;

  const gridInputInline = {
    display: "grid",
    gridTemplateColumns: `repeat(4, ${chordWidth.toString()}px)`,
    gap: gapWidth.toString() + "px",
  };

  const gridInputInline2 = {
    display: "grid",
    gridTemplateColumns: `repeat(2, ${(chordWidth * 2).toString()}px)`,
    gap: (gapWidth * 2).toString() + "px",
  };

  function handleNumeralSubmit(e: FormEvent) {
    e.preventDefault();
    handleInput(numeralInput);
  }

  const renderNumeralInputs = (
    start: number | undefined,
    end: number | undefined
  ) => {
    return Object.keys(numeralInput)
      .slice(start, end)
      .map((key) => (
        <FormInput
          key={key}
          name={key}
          type="text"
          value={numeralInput[key] || ""}
          width={(chordWidth + 6).toString() + "px"}
          onChange={(e: ChangeEvent) =>
            setNumeralInput({ ...numeralInput, [key]: e.target.value })
          }
          required={false}
        />
      ));
  };

  const renderKeyNames = (
    start: number | undefined,
    end: number | undefined
  ) => {
    return keyNames.slice(start, end).map((key) => (
      <span key={key} style={gridInputInline2}>
        {key}
      </span>
    ));
  };

  return (
    <div>
      <form
        ref={ref}
        id="submit-form-progression"
        onSubmit={handleNumeralSubmit}
      >
        <Stack direction="column">
          <Stack
            direction="row"
            spacing={chordGroupSpacing}
            marginLeft="100px"
            gap={4}
          >
            {renderKeyNames(0, 3)}
          </Stack>
          <Staff chosenClef={chosenClef} numBars={6} width={width} />
          <Stack
            direction="row"
            spacing={chordGroupSpacing}
            sx={{ paddingLeft: 13, paddingRight: 6, marginBottom: 6 }}
          >
            <div style={gridInputInline}>{renderNumeralInputs(0, 3)}</div>
            <div style={gridInputInline}>{renderNumeralInputs(3, 6)}</div>
            <div style={gridInputInline}>{renderNumeralInputs(6, 9)}</div>
          </Stack>
          <Stack
            direction="row"
            spacing={chordGroupSpacing}
            marginLeft="100px"
            gap={4}
          >
            {renderKeyNames(3, 6)}
          </Stack>
          <Staff
            chosenClef={chosenClef}
            numBars={6}
            noTimeSignature
            width={width}
            addDoubleBarLine
          />
          <Stack
            direction="row"
            spacing={chordGroupSpacing}
            sx={{ paddingLeft: 13 }}
          >
            <div style={gridInputInline}>{renderNumeralInputs(9, 12)}</div>
            <div style={gridInputInline}>{renderNumeralInputs(12, 15)}</div>
            <div style={gridInputInline}>{renderNumeralInputs(15, 18)}</div>
          </Stack>
        </Stack>
      </form>
    </div>
  );
});
