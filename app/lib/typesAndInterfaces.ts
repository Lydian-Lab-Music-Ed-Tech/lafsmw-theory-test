import VexFlow from "vexflow";
import { IRenderContext } from "vexflow";
const VF = VexFlow.Flow;
const { StaveNote, Stave, Renderer } = VF;
import { RefObject, Dispatch, SetStateAction } from "react";

export type InputData = {
  [key: string]: string;
};

export type Chord = {
  keys: string[];
  duration: string;
};

export type RendererRef = RefObject<InstanceType<typeof Renderer>>;
export type SetStaves = Dispatch<SetStateAction<StaveType[]>>;
export type BlankStaves = StaveType[];
export type NoteData = StaveNoteData[][];

export type NoteInteractionState = {
  isEraseNoteActive: boolean;
  isEraseAccidentalActive: boolean;
  isChangeNoteActive: boolean;
  isEnterNoteActive: boolean;
  isSharpActive: boolean;
  noNoteFound: boolean;
  tooManyBeatsInMeasure?: boolean;
  isFlatActive: boolean;
  [key: string]: boolean | undefined; //This is an index signature. This is a type in TypeScript that allows indexing into an object with a string
};
export type KeySigState = {
  isAddSharpActive: boolean;
  isAddFlatActive: boolean;
  isRemoveSharpActive: boolean;
  isRemoveFlatActive: boolean;
  [key: string]: boolean | undefined; //This is an index signature. This is a type in TypeScript that allows indexing into an object with a string
};

export type Action = { type: keyof NoteInteractionState };

export type BarMetrics = {
  barWidth: number;
  xMaxCoordinate: number;
};

export type AccidentalStateType = {
  isAddSharpActive: boolean;
  isAddFlatActive: boolean;
  isRemoveSharpActive: boolean;
  isRemoveFlatActive: boolean;
  isClearMeasuresActive: boolean;
};
export type StaveType = InstanceType<typeof Stave>;

export type StaveNoteType = InstanceType<typeof StaveNote>;

export interface UserClickInfo {
  rect: DOMRect | undefined;
  userClickX: number;
  userClickY: number;
  topStaveYPosition: number;
  highGYPosition: number;
}

export interface StaveNoteData {
  newStaveNote: StaveNoteType;
  staveNoteAbsoluteX: number;
  userClickY: number;
}

export interface NoteStringData {
  note: string;
  yCoordinateMin: number;
  yCoordinateMax: number;
  userClickY?: number;
}
export interface ModifyNoteData {
  barOfStaveNotes: StaveNoteData;
  noteIndex: number;
}

export interface CheckNumBeatsInMeasureProps {
  tooManyBeatsInMeasure: boolean | undefined;
  openEnterNotes: React.Dispatch<Action>;
}

export interface CheckIfNoteFoundProps {
  noNoteFound: boolean;
  openEnterNotes: React.Dispatch<Action>;
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
  clef: string;
  timeSig?: string;
  keySig?: string;
  firstStaveWidth: number;
  regularStaveWidth?: number | null;
  setStaves: SetStaves;
  notesData?: NoteData | null;
  staves: BlankStaves;
}

export interface CreateBlankStavesParams {
  numStaves: number;
  context: IRenderContext;
  firstStaveWidth: number;
  x: number;
  y: number;
  regularStaveWidth: number;
  clef?: string;
  timeSig?: string;
  keySig?: string;
}
