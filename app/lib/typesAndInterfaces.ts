import { Dispatch, RefObject, SetStateAction } from "react";
import VexFlow, { RenderContext, StemmableNote } from "vexflow";
import {
  modifyChordsActionTypes,
  modifyKeySigActionTypes,
  modifyNotesActionTypes,
} from "./actionTypes";
const VF = VexFlow.Flow;
const { StaveNote, Stave, Renderer, Glyph, Note } = VF;

export type FormEvent = React.FormEvent<HTMLFormElement>;
export type MouseEvent = React.MouseEvent<HTMLButtonElement>;
export type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type SelectEvent = React.ChangeEvent<HTMLSelectElement>;
export type KeyboardEvent = React.KeyboardEvent<HTMLInputElement>;

export type InputData = {
  [key: string]: string;
};

export type StateInteraction =
  | ChordInteractionState
  | NoteInteractionState
  | KeySigState;

export type InteractionActionTypes =
  | keyof typeof modifyNotesActionTypes
  | keyof typeof modifyChordsActionTypes
  | keyof typeof modifyKeySigActionTypes
  | "CLEAR_ALL";

export type Chord = {
  keys: string[];
  duration: string;
  staveNotes?: StemmableNote | null;
  userClickY?: number;
  sharpIndexArray?: number[];
  flatIndexArray?: number[] | [];
};

export type Level =
  | "advanced-theory"
  | "advanced-improvisation"
  | "intro-to-arranging"
  | "intermediate-arranging"
  | "advanced-arranging"
  | "rhythm-class"
  | "sibelius-class"
  | "select-here";

export type RendererRef = RefObject<InstanceType<typeof Renderer>>;
export type SetStaves = Dispatch<SetStateAction<StaveType[]>>;
export type SetStavesForChords = Dispatch<SetStateAction<StaveType[]>>;
export type BlankStaves = StaveType[];
export type NoteData = StaveNoteData[][];

export interface ActionType {
  type: InteractionActionTypes;
}

export type NoteInteractionState = {
  isEraseNoteActive: boolean;
  isEraseAccidentalActive: boolean;
  isChangeNoteActive: boolean;
  isEnterNoteActive: boolean;
  isSharpActive: boolean;
  noNoteFound: boolean;
  tooManyBeatsInMeasure?: boolean;
  isFlatActive: boolean;
  [key: string]: boolean | undefined;
};

export type ChordInteractionState = {
  isEraseNoteActive: boolean;
  isEraseAccidentalActive: boolean;
  isSharpActive: boolean;
  noNoteFound: boolean;
  isFlatActive: boolean;
  [key: string]: boolean | undefined;
};

export type KeySigState = {
  isSharpActive: boolean;
  isFlatActive: boolean;
  isEraseAccidentalActive: boolean;
  isClearKeySigActive: boolean;
  [key: string]: boolean | undefined;
};

export type BarMetrics = {
  barWidth: number;
  xMaxCoordinate: number;
};

export type StaveType = InstanceType<typeof Stave>;
export type GlyphType = InstanceType<typeof Glyph>;
export type StaveNoteType = InstanceType<typeof StaveNote>;
export type NoteType = InstanceType<typeof Note>;

export interface UserClickInfo {
  rect: DOMRect | undefined;
  userClickX: number;
  userClickY: number;
  topStaveYCoord: number;
  highGYPosition: number;
  topKeySigPosition: number;
  spacingBetweenLines?: number | undefined;
  bottomY?: number;
  bottomStaveYCoord?: number;
}

export interface StaveNoteData {
  newStaveNote: StaveNoteType;
  staveNoteAbsoluteX: number;
  userClickY: number;
}
export interface chosenClef {
  chosenClef: string;
  setChosenClef: Dispatch<SetStateAction<string>>;
}
export interface errorMessages {
  tooManyNotesInMeasure: string;
  noNoteFound: string;
}
export interface ScaleData {
  keys: string[];
  duration: string;
  staveNote: StaveNoteType | null;
  userClickY: number;
  staveNoteAbsoluteX: number;
}

export interface NoteStringData {
  note: string;
  yCoordinateMin: number;
  yCoordinateMax: number;
  userClickY?: number;
  staveNotes?: StaveNoteData;
  accidental?: null | string;
}
export interface NotesAndCoordinatesData {
  note: string;
  originalNote: string;
  yCoordinateMin: number;
  yCoordinateMax: number;
  userClickY?: number;
  userClickX?: number;
}

export interface ModifyNoteData {
  barOfStaveNotes: StaveNoteData;
  noteIndex: number;
}
export interface ModifyScaleData {
  noteDataObject: ScaleData;
  noteIndex: number;
}

export interface CheckNumBeatsInMeasureProps {
  tooManyBeatsInMeasure: boolean | undefined;
  openEnterNotes: React.Dispatch<InteractionActionTypes>;
}

export interface CheckIfNoteFoundProps {
  noNoteFound: boolean;
  openEnterNotes: React.Dispatch<InteractionActionTypes>;
}

export interface RenderStavesAndNotesParams {
  rendererRef: RendererRef | null;
  font: string;
  fontSize: number;
  numStaves: number;
  rendererWidth: number;
  rendererHeight: number;
  yPositionOfStaves: number;
  xPositionOfStaves: number;
  chosenClef: string;
  timeSig?: string;
  keySig?: string;
  firstStaveWidth: number;
  regularStaveWidth?: number | null;
  setStaves: SetStaves;
  scaleDataMatrix?: ScaleData[][];
  notesData?: NoteData | null;
  staves: BlankStaves;
}

export interface RenderStaves {
  rendererRef: RendererRef | null;
  font: string;
  fontSize: number;
  numStaves: number;
  rendererWidth: number;
  rendererHeight: number;
  yPositionOfStaves: number;
  xPositionOfStaves: number;
  chosenClef: string;
  timeSig?: string;
  keySig?: string;
  firstStaveWidth: number;
  regularStaveWidth?: number | null;
  setStaves?: SetStaves;
  staves: BlankStaves;
}
export interface RenderStavesAndChordParams {
  rendererRef: RendererRef | null;
  font: string;
  fontSize: number;
  numStaves: number;
  rendererWidth: number;
  rendererHeight: number;
  yPositionOfStaves: number;
  xPositionOfStaves: number;
  chosenClef: string;
  timeSig?: string;
  keySig?: string;
  firstStaveWidth: number;
  regularStaveWidth?: number | null;
  setStaves: SetStaves;
  chordData: Chord;
  staves: BlankStaves;
  barIndex: number;
}

export interface CreateBlankStavesParams {
  numStaves: number;
  context: RenderContext;
  firstStaveWidth: number;
  x: number;
  y: number;
  regularStaveWidth: number;
  chosenClef?: string;
  timeSig?: string;
  keySig?: string;
}

export interface GlyphProps {
  xPosition: number;
  yPosition: number;
  glyph: string;
}

export interface InputState {
  userId: string | null | undefined;
  user: any;
  level: Level;
  keySignatures: InputData;
  keySignaturesNotation1: string[];
  keySignaturesNotation2: string[];
  keySignaturesNotation3: string[];
  keySignaturesNotation4: string[];
  scales1: string[];
  scales2: string[];
  scales3: string[];
  scales4: string[];
  scales5: string[];
  scales6: string[];
  triads1: string[];
  triads2: string[];
  triads3: string[];
  triads4: string[];
  triads5: string[];
  triads6: string[];
  seventhChords1: string[];
  seventhChords2: string[];
  seventhChords3: string[];
  seventhChords4: string[];
  seventhChords5: string[];
  seventhChords6: string[];
  seventhChords7: string[];
  chords: InputData;
  progressions: InputData;
  blues: InputData;
  bluesUrl: string;
}

export interface UserDataProps {
  currentUserData: InputState;
  setCurrentUserData: (userData: InputState) => void;
  nextViewState: () => void;
  page: number;
}

export interface UserDataBluesProps extends UserDataProps {
  isPDFReady: boolean;
  setIsPDFReady: React.Dispatch<SetStateAction<boolean>>;
}

export interface TextInput {
  [key: string]: string;
}

export type WriteProps = {
  width: number;
  currentData?: TextInput;
  handleInput: (data: InputData) => void;
};

export interface EmailData {
  email: string;
  subject?: string;
  text?: string;
}
