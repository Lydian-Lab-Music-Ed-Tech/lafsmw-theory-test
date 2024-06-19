import {
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { Clef } from "../lib/typesAndInterfaces";
import { ChangeEvent } from "react";

const ClefPreferenceSelector = ({ clef, setClef }: Clef) => {
  function handleClef(event: ChangeEvent<HTMLInputElement>) {
    setClef(event.target.value);
  }
  return (
    <FormControl size="small" fullWidth>
      <RadioGroup row value={clef} onChange={handleClef}>
        <FormControlLabel
          value={"treble"}
          control={<Radio />}
          label="Treble Clef"
        />
        <FormControlLabel
          value={"bass"}
          control={<Radio />}
          label="Bass Clef"
        />
      </RadioGroup>
    </FormControl>
  );
};

export default ClefPreferenceSelector;
