"use client";
import Stack from "@mui/material/Stack";
import { ForwardedRef, forwardRef, useEffect, useState } from "react";
import { useClef } from "../context/ClefContext";
import createInitialState from "../lib/createInitialState";
import isCurrentDataFilled from "../lib/isCurrentDataFilled";
import { ChangeEvent, FormEvent, WriteProps } from "../lib/types";
import FormInput from "./FormInput";
import Staff from "./Staff";

const initialBluesInputState = createInitialState(48);

export default forwardRef(function WriteBlues(
  { width, handleInput, currentData }: WriteProps,
  ref: ForwardedRef<HTMLFormElement>
) {
  const [numeralInput, setNumeralInput] = useState<Record<string, string>>(
    initialBluesInputState
  );

  const { chosenClef } = useClef();

  useEffect(() => {
    if (currentData && isCurrentDataFilled(currentData)) {
      setNumeralInput(currentData);
    } else {
      setNumeralInput(initialBluesInputState);
    }
  }, [currentData]);

  const chordWidth = width * 0.048;
  const gapWidth = chordWidth * 0.05;
  const chordGroupSpacing = chordWidth * 0.05;

  const gridInputInline = {
    display: "grid",
    gridTemplateColumns: `repeat(4, ${chordWidth.toString()}px)`,
    gap: gapWidth.toString() + "px",
  };

  function handleNumeralSubmit(e: FormEvent) {
    e.preventDefault();
    handleInput(numeralInput);
  }

  function renderNumeralInputs(
    start: number | undefined,
    end: number | undefined
  ) {
    return Object.keys(numeralInput)
      .slice(start, end)
      .map((key) => (
        <FormInput
          key={key}
          name={key}
          type="text"
          value={numeralInput[key] || ""}
          width={(chordWidth + 6).toString() + "px"}
          height="50px"
          onChange={(e: ChangeEvent) =>
            setNumeralInput({ ...numeralInput, [key]: e.target.value })
          }
          required={false}
        />
      ));
  }

  return (
    <div>
      <form ref={ref} id="submit-form-blues" onSubmit={handleNumeralSubmit}>
        <Stack direction="column">
          <Staff
            chosenClef={chosenClef}
            numBars={4}
            width={width}
            spaceAboveStaffLn={1.3}
          />
          <Stack
            direction="row"
            spacing={chordGroupSpacing}
            sx={{ paddingLeft: 13, paddingRight: 6 }}
          >
            <div style={gridInputInline}>{renderNumeralInputs(0, 4)}</div>
            <div style={gridInputInline}>{renderNumeralInputs(4, 8)}</div>
            <div style={gridInputInline}>{renderNumeralInputs(8, 12)}</div>
            <div style={gridInputInline}>{renderNumeralInputs(12, 16)}</div>
          </Stack>
          <Staff
            chosenClef={chosenClef}
            numBars={4}
            noTimeSignature={true}
            width={width}
            spaceAboveStaffLn={1.3}
          />
          <Stack
            direction="row"
            spacing={chordGroupSpacing}
            sx={{ paddingLeft: 13 }}
          >
            <div style={gridInputInline}>{renderNumeralInputs(16, 20)}</div>
            <div style={gridInputInline}>{renderNumeralInputs(20, 24)}</div>
            <div style={gridInputInline}>{renderNumeralInputs(24, 28)}</div>
            <div style={gridInputInline}>{renderNumeralInputs(28, 32)}</div>
          </Stack>
          <Staff
            chosenClef={chosenClef}
            numBars={4}
            noTimeSignature={true}
            addDoubleBarLine={true}
            width={width}
            spaceAboveStaffLn={1.3}
          />
          <Stack
            direction="row"
            spacing={chordGroupSpacing}
            sx={{ paddingLeft: 13 }}
          >
            <div style={gridInputInline}>{renderNumeralInputs(32, 36)}</div>
            <div style={gridInputInline}>{renderNumeralInputs(36, 40)}</div>
            <div style={gridInputInline}>{renderNumeralInputs(40, 44)}</div>
            <div style={gridInputInline}>{renderNumeralInputs(44, 48)}</div>
          </Stack>
        </Stack>
      </form>
    </div>
  );
});
