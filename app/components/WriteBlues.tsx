// "use client";
import Stack from "@mui/material/Stack";
import { ForwardedRef, forwardRef, useState, useEffect } from "react";
import createInitialState from "../lib/createInitialState";
import { ChangeEvent, FormEvent, WriteProps } from "../lib/typesAndInterfaces";
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

  const isCurrentDataBluesFilled = (data: any) => {
    for (let i = 0; i < 48; i++) {
      if (data[i] !== "") {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (currentData && isCurrentDataBluesFilled(currentData)) {
      setNumeralInput(currentData);
    } else {
      setNumeralInput(initialBluesInputState);
    }
  }, [currentData]);

  // console.log("currentData from WriteBlues: ", currentData);

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
    console.log("numeralInput from handleNumeralSubmit: ", numeralInput);
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
          <Staff numBars={4} width={width} />
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
          <Staff numBars={4} noTimeSignature={true} width={width} />
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
            numBars={4}
            noTimeSignature={true}
            addDoubleBarLine={true}
            width={width}
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
