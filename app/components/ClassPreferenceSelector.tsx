import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Level } from "../lib/types";

export default function ClassPreferenceSelector({
  setLevel,
  level,
}: {
  setLevel: Dispatch<SetStateAction<Level>>;
  level: Level;
}) {
  function handleLevel(event: SelectChangeEvent) {
    const selectedLevel = event.target.value as Level;
    setLevel(selectedLevel);
  }

  return (
    <FormControl size="small" fullWidth>
      <InputLabel id="class-preference-label" color="info">
        Class Preference
      </InputLabel>
      <Select
        labelId="class-preference-label"
        id="class-preference-select"
        value={level}
        label="Class Preference"
        onChange={handleLevel}
      >
        <MenuItem value="select-here">select class here...</MenuItem>
        <MenuItem value="advanced-theory">Advanced Theory</MenuItem>
        <MenuItem value="advanced-improvisation">
          Advanced Improvisation
        </MenuItem>
        <MenuItem value="intro-to-arranging">Intro to Arranging</MenuItem>
        <MenuItem value="intermediate-arranging">
          Intermediate Arranging
        </MenuItem>
        <MenuItem value="advanced-arranging">Advanced Arranging</MenuItem>
        <MenuItem value="rhythm-class">Rhythm Class</MenuItem>
        <MenuItem value="sibelius-class">Sibelius Class</MenuItem>
      </Select>
    </FormControl>
  );
}
