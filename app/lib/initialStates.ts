import {
  Chord,
  InputState,
  NotesAndCoordinatesData,
  ProgressionState,
} from "./types";

// -----------------------------------------------------------------------------
// Notation Component Initial States
// -----------------------------------------------------------------------------

/**
 * Initial state for chord data
 */
export const initialChordData: Chord = {
  keys: [],
  duration: "w",
  staveNotes: null,
  userClickY: 0,
};

/**
 * Initial state for notes and coordinates data
 */
export const initialNotesAndCoordsState: NotesAndCoordinatesData = {
  note: "",
  originalNote: "",
  yCoordinateMin: 0,
  yCoordinateMax: 0,
};

// -----------------------------------------------------------------------------
// Form Input Initial States
// -----------------------------------------------------------------------------

/**
 * Initial state for progression inputs
 */
export const initialProgressionInputState: ProgressionState = {
  0: "Dm7",
  1: "G7",
  2: "Cmaj7",
  3: "",
  4: "",
  5: "",
  6: "",
  7: "",
  8: "",
  9: "",
  10: "",
  11: "",
  12: "",
  13: "",
  14: "",
  15: "",
  16: "",
  17: "",
};

/**
 * Initial state for the main form inputs
 */
export const initialFormInputState: InputState = {
  // User information
  userId: "",
  user: null,
  level: "select-here",

  // Key signatures section
  keySignatures: {},
  keySignaturesNotation1: [],
  keySignaturesNotation2: [],
  keySignaturesNotation3: [],
  keySignaturesNotation4: [],

  // Scales section
  scales1: [],
  scales2: [],
  scales3: [],
  scales4: [],
  scales5: [],
  scales6: [],

  // Triads section (using triadsDataX.keys instead of separate triadsX arrays)
  // Seventh chords section (using seventhChordsDataX.keys instead of separate seventhChordsX arrays)

  // Other sections
  chords: {},
  progressions: {},
  blues: {},
  bluesUrl: "",
};
