"use client";
import { ForwardedRef, forwardRef, useEffect, useMemo, useState } from "react";
import { useClef } from "../context/ClefContext";
import createInitialState from "../lib/createInitialState";
import isCurrentDataFilled from "../lib/isCurrentDataFilled";
import { ChangeEvent, FormEvent, IdentifyNotationProps } from "../lib/types";
import FormInput from "./FormInput";
import Staff from "./Staff";

export default forwardRef(function IdentifyNotation(
  {
    numBars = 4,
    evenbars = false,
    chords = [],
    width = 1650,
    handleInput,
    currentData,
  }: IdentifyNotationProps,
  ref: ForwardedRef<HTMLFormElement>
) {
  const initialChordsInputState = useMemo(
    () => createInitialState(numBars),
    [numBars]
  );

  const [textInput, setTextInput] = useState<Record<string, string>>(
    initialChordsInputState
  );

  const { chosenClef } = useClef();

  useEffect(() => {
    if (!currentData || !isCurrentDataFilled(currentData)) {
      setTextInput(initialChordsInputState);
    } else {
      setTextInput(currentData);
    }
  }, [currentData, initialChordsInputState]);

  const fullWidth = width * 0.97;
  const reducedWidth = fullWidth - 90;

  let widthOfFirstBar;
  let widthOfRemainingBars;

  if (evenbars === false) {
    widthOfFirstBar = fullWidth / numBars;
    widthOfRemainingBars = (fullWidth - widthOfFirstBar - 90) / (numBars - 1);
  } else {
    widthOfFirstBar = reducedWidth / numBars;
    widthOfRemainingBars = widthOfFirstBar;
  }

  const remainingBarsString = (numBars - 1).toString();

  const gridInputInline = {
    display: "grid",
    gridTemplateColumns: `${widthOfFirstBar}px repeat(${remainingBarsString}, ${widthOfRemainingBars}px)`,
    paddingLeft: evenbars ? "4.5rem" : "5.5rem",
  };

  function handleInputSubmit(e: FormEvent) {
    e.preventDefault();
    handleInput(textInput);
  }

  const renderTextInputs = () => {
    return Object.keys(textInput).map((key) => (
      <FormInput
        key={key}
        name={key}
        type="text"
        value={textInput[key] || ""}
        width="65px"
        onChange={(e: ChangeEvent) =>
          setTextInput({ ...textInput, [key]: e.target.value })
        }
        required={false}
      />
    ));
  };
  return (
    <div>
      <form ref={ref} id="submit-form-chords" onSubmit={handleInputSubmit}>
        <Staff
          chosenClef={chosenClef}
          evenbars={evenbars}
          addDoubleBarLine={true}
          numBars={numBars}
          chords={chords}
          width={width}
          noTimeSignature
        />
        <div style={gridInputInline}>{renderTextInputs()}</div>
      </form>
    </div>
  );
});
