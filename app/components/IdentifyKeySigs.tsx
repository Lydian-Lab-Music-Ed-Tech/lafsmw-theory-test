"use client";
import { ForwardedRef, forwardRef, useEffect, useMemo, useState } from "react";
import { useClef } from "../context/ClefContext";
import createInitialState from "../lib/createInitialState";
import isCurrentDataFilled from "../lib/isCurrentDataFilled";
import { ChangeEvent, FormEvent, IdentifyNotationProps } from "../lib/types";
import FormInput from "./FormInput";
import KeySigStaff from "./KeySigStaff";

export default forwardRef(function IdentifyKeySigs(
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
    paddingLeft: evenbars ? "1rem" : "5.5rem",
    gap: "20px",
  };

  function handleInputSubmit(e: FormEvent) {
    e.preventDefault();
    handleInput(textInput);
  }

  const keySigs = [
    { key: "Db", type: "major" },
    { key: "A", type: "major" },
    { key: "Ab", type: "minor" },
    { key: "E", type: "minor" },
  ];

  const renderTextInputs = () => {
    return keySigs.map((keySig, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
          font: "10px",
          marginLeft: "15px",
        }}
      >
        <FormInput
          name={keySig.key}
          fontSize="14px"
          type="text"
          value={textInput[index] || ""}
          width="45px"
          onChange={(e: ChangeEvent) =>
            setTextInput({ ...textInput, [index]: e.target.value })
          }
          required={false}
        />
        <div
          style={{
            fontSize: "14px",
            minWidth: "30px",
            marginLeft: "6px",
          }}
        >{` ${keySig.type}`}</div>
      </div>
    ));
  };

  return (
    <div>
      <form ref={ref} id="submit-form-chords" onSubmit={handleInputSubmit}>
        <KeySigStaff
          clef={chosenClef}
          evenbars={evenbars}
          addDoubleBarLine={true}
          numBars={numBars}
          chords={chords}
          width={width}
          noTimeSignature
          allDoubleBarLines
          keySig={keySigs.map((keySig) => keySig.key)}
        />
        <div style={gridInputInline}>{renderTextInputs()}</div>
      </form>
    </div>
  );
});
