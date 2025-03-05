import VexFlow from "vexflow";
import { Chord } from "./typesAndInterfaces";

type BuildChordParams = {
  state: {
    isEnterNoteActive: boolean;
    isEraseNoteActive: boolean;
    isSharpActive: boolean;
    isFlatActive: boolean;
    isEraseAccidentalActive: boolean;
  };
  setChordData: (callback: (prevChord: Chord) => Chord) => void;
  chordData: Chord;
  rendererRef: React.MutableRefObject<InstanceType<typeof VexFlow.Flow.Renderer> | null>;
  staves: any[];
  userClickX: number;
  userClickY: number;
  chosenClef: string;
  barIndex: number;
};

export const buildChord = (params: BuildChordParams) => {
  const {
    state,
    setChordData,
    chordData,
    rendererRef,
    staves,
    userClickX,
    userClickY,
    chosenClef,
    barIndex,
  } = params;

  // Get the stave note based on click position
  const stave = staves[barIndex];
  if (!stave) return;

  const noteName = getNoteName(stave, userClickY, chosenClef);
  if (!noteName) return;

  // Handle accidentals based on state
  let noteWithAccidental = noteName;
  if (state.isSharpActive) {
    noteWithAccidental = noteName.replace(/(\/\d+)$/, "#$1");
  } else if (state.isFlatActive) {
    noteWithAccidental = noteName.replace(/(\/\d+)$/, "b$1");
  }

  // Update chord data based on state
  if (state.isEnterNoteActive) {
    addNoteToChord(setChordData, noteWithAccidental);
  } else if (state.isEraseNoteActive) {
    removeNoteFromChord(setChordData, noteWithAccidental);
  } else if (state.isEraseAccidentalActive) {
    removeAccidentalFromChord(setChordData, noteName, noteWithAccidental);
  }
};

// Helper function to get note name based on click position
const getNoteName = (stave: any, userClickY: number, chosenClef: string): string | null => {
  const clef = chosenClef || "treble";
  const staveY = stave.getYForLine(0); // Top line of the stave
  const lineHeight = stave.getYForLine(1) - staveY; // Height of one line
  
  // Calculate which line or space was clicked
  const relativeY = userClickY - staveY;
  const lineIndex = Math.round(relativeY / (lineHeight / 2)) / 2;
  
  // Convert line index to note name based on clef
  return getNoteNameFromLineIndex(lineIndex, clef);
};

// Helper function to convert line index to note name
const getNoteNameFromLineIndex = (lineIndex: number, clef: string): string | null => {
  // Note mapping for treble clef (adjust for bass clef)
  const trebleNotes = [
    "f/5", "e/5", "d/5", "c/5", "b/4", "a/4", "g/4", "f/4", "e/4", "d/4", "c/4", "b/3", "a/3"
  ];
  
  const bassNotes = [
    "a/3", "g/3", "f/3", "e/3", "d/3", "c/3", "b/2", "a/2", "g/2", "f/2", "e/2", "d/2", "c/2"
  ];
  
  const notes = clef === "bass" ? bassNotes : trebleNotes;
  const index = Math.floor(lineIndex);
  
  if (index >= 0 && index < notes.length) {
    return notes[index];
  }
  
  return null;
};

// Helper function to add a note to the chord
const addNoteToChord = (setChordData: (callback: (prevChord: Chord) => Chord) => void, note: string) => {
  setChordData((prevChord) => {
    // Don't add duplicate notes
    if (prevChord.keys.includes(note)) {
      return prevChord;
    }
    
    return {
      ...prevChord,
      keys: [...prevChord.keys, note],
      staveNotes: null, // Will be regenerated when rendered
    };
  });
};

// Helper function to remove a note from the chord
const removeNoteFromChord = (setChordData: (callback: (prevChord: Chord) => Chord) => void, note: string) => {
  setChordData((prevChord) => {
    return {
      ...prevChord,
      keys: prevChord.keys.filter(key => key !== note),
      staveNotes: null, // Will be regenerated when rendered
    };
  });
};

// Helper function to remove an accidental from a note in the chord
const removeAccidentalFromChord = (
  setChordData: (callback: (prevChord: Chord) => Chord) => void, 
  noteName: string, 
  noteWithAccidental: string
) => {
  setChordData((prevChord) => {
    const updatedKeys = prevChord.keys.map(key => {
      // If this is the note with the accidental, replace it with the base note
      if (key === noteWithAccidental) {
        return noteName;
      }
      return key;
    });
    
    return {
      ...prevChord,
      keys: updatedKeys,
      staveNotes: null, // Will be regenerated when rendered
    };
  });
};
