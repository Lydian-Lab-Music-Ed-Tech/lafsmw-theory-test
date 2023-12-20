"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import BlankStaff from "../components/BlankStaff";
import IdentifyChords from "../components/IdentifyChords";
import WriteProgression from "../components/WriteProgression";
import WriteBlues from "../components/WriteBlues";
import seventhChords from "../lib/seventhChords";
import { useRef, useState } from "react";

const initialFormInputState = {
  level: "",
  keySignatures: [],
  scales: [],
  triads: [],
  chords: [],
  progressions: [],
  blues: [],
};

export default function ExamSample() {
  const [level, setLevel] = useState("");
  const [formInput, setFormInput] = useState(initialFormInputState);

  const width = typeof window !== "undefined" ? window.innerWidth : width;

  const bluesFormRef = useRef(null);

  function handleLevel(input) {
    setFormInput({ ...formInput, level: input });
  }

  function handleChords(input) {
    setFormInput({ ...formInput, chords: input });
  }

  function handleProg(input) {
    setFormInput({ ...formInput, progressions: input });
  }

  function handleBlues(input) {
    setFormInput({ ...formInput, blues: input });
  }

  console.log("form input", formInput);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={4} minHeight={500}>
        <Grid item xs={12}>
          <h1 className="text-3xl text-center mt-24">LAFSMW Theory Test</h1>
        </Grid>
        <Grid item xs={12}>
          <label
            className="ml-4 mt-4 text-xl text-center"
            htmlFor="level-select"
          >
            Choose your Level IV class preference:
          </label>

          <select name="levels" id="level-select">
            <option value="">Please choose an option</option>
            <option value="advanced-theory">Advanced theory</option>
            <option value="advanced-improvisation">
              Advanced improvisation
            </option>
            <option value="intro-to-arranging">Intro to arranging</option>
            <option value="intermediate-arranging">
              Intermediate arranging
            </option>
            <option value="advanced-arranging">Advanced arranging</option>
            <option value="rhythm-class">Rhythm class</option>
            <option value="sibelius-class">Sibelius class</option>
          </select>
        </Grid>
        <Grid item xs={12}>
          <div>
            <h2 className="ml-4 mt-4">Write the following key signatures:</h2>
            <BlankStaff addDoubleBarLine={true} width={width} />
            <div className="ml-24 grid grid-cols-4">
              <p>Db Major</p>
              <p>F# Major</p>
              <p>G Minor</p>
              <p>G# Minor</p>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div>
            <h2 className="ml-4 mt-4">
              Identify the following key signatures:
            </h2>
            <BlankStaff addDoubleBarLine={true} width={width} />
          </div>
        </Grid>
        <Grid item xs={12}>
          <div>
            <h2 className="ml-4 mt-4">Write the following scales:</h2>
            <BlankStaff numBars={2} width={width} />
            <div className="ml-24 grid grid-cols-2">
              <p>Db Major</p>
              <p>B Major</p>
            </div>
            <BlankStaff numBars={2} noTimeSignature={false} width={width} />
            <div className="ml-24 grid grid-cols-2">
              <p>C Dorian</p>
              <p>F# Dorian</p>
            </div>
            <BlankStaff
              numBars={2}
              noTimeSignature={false}
              addDoubleBarLine={true}
              width={width}
            />
            <div className="ml-24 grid grid-cols-2">
              <p>Bb Mixolydian</p>
              <p>C# Mixolydian</p>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div>
            <h2 className="ml-4 mt-4">Write the following triads:</h2>
            <BlankStaff numBars={6} addDoubleBarLine={true} width={width} />
            <div className="ml-24 grid grid-cols-6">
              <p>D Major</p>
              <p>F# Major</p>
              <p>Db Minor</p>
              <p>F# Minor</p>
              <p>Eb Diminished</p>
              <p>E Augmented</p>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div>
            <h2 className="ml-4 mt-4">Write the following 7th chords:</h2>
            <BlankStaff numBars={7} addDoubleBarLine={true} width={width} />
            <div className="ml-24 grid grid-cols-7">
              <p>E-dim</p>
              <p>G-7</p>
              <p>Db-7</p>
              <p>D#-7</p>
              <p>D-dim-7</p>
              <p>Gb-aug-7</p>
              <p>Eb-dim</p>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <h2 className="ml-4 mt-4">Identify the following 7th chords:</h2>
          <IdentifyChords
            chords={seventhChords}
            numBars={7}
            handleChords={handleChords}
            width={width}
          />
        </Grid>
        <Grid item xs={12}>
          <div>
            <h2 className="ml-4 mt-4">
              Write a I-IV-V progression in the following keys:
            </h2>
            <WriteProgression
              numBars={12}
              handleProg={handleProg}
              width={width}
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <div>
            <h2 className="ml-4 mt-4">
              Write the changes to a Bb blues using ii-V7-I in the last 4
              measures (extra credit for hip reharms in the first 8 measures):
            </h2>
            <WriteBlues
              numBars={12}
              handleBlues={handleBlues}
              ref={bluesFormRef}
              width={width}
            />
          </div>
        </Grid>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 8, mt: 8 }}
        >
          <Button
            sx={{
              color: "#2b2b2b",
              borderColor: "#2b2b2b",
              borderRadius: "8px",
              fontSize: "1em",
            }}
            type="button"
            onClick={() => {
              console.log("bluesFormRef", bluesFormRef);
              bluesFormRef.current.requestSubmit();
            }}
            form="submit-form-blues1"
            variant="outlined"
          >
            Submit Answers
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
