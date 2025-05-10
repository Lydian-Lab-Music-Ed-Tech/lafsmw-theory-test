import { Dispatch, SetStateAction, RefObject, ReactNode } from "react";
import { Flow, RenderContext, StemmableNote } from "vexflow";

export interface GlyphProps {
  xPosition: number;
  yPosition: number;
  glyph: string;
}

const { StaveNote, Stave, Renderer, Glyph, Note } = Flow;

export type FormEvent = React.FormEvent<HTMLFormElement>;
export type MouseEvent = React.MouseEvent<HTMLButtonElement>;
export type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type SelectEvent = React.ChangeEvent<HTMLSelectElement>;
export type KeyboardEvent = React.KeyboardEvent<HTMLInputElement>;

export type InputData = {
  [key: string]: string;
};

export interface ButtonStates {
  isEnterNoteActive: boolean;
  isEraseNoteActive: boolean;
  isSharpActive: boolean;
  isFlatActive: boolean;
  isEraseAccidentalActive: boolean;
  [key: string]: boolean;
}

export interface ButtonSetters {
  setIsEnterNoteActive: Dispatch<SetStateAction<boolean>>;
  setIsEraseNoteActive: Dispatch<SetStateAction<boolean>>;
  setIsSharpActive: Dispatch<SetStateAction<boolean>>;
  setIsFlatActive: Dispatch<SetStateAction<boolean>>;
  setIsEraseAccidentalActive: Dispatch<SetStateAction<boolean>>;
  [key: string]: Dispatch<SetStateAction<boolean>>;
}

export type ButtonState = {
  id: string;
  isActive: boolean;
  setter: Dispatch<SetStateAction<boolean>>;
};

export type StateInteraction = ButtonStates & {
  isClearKeySigActive?: boolean;
  noNoteFound?: boolean;
  tooManyBeatsInMeasure?: boolean;
  [key: string]: boolean | undefined;
};

export type Chord = {
  keys: string[];
  duration: string;
  staveNotes?: StemmableNote | null;
  userClickY?: number;
  sharpIndexArray?: number[];
  flatIndexArray?: number[] | [];
};

export interface NotateChordProps {
  initialChords?: string[];
  initialChordData?: SimpleChordData;
  onChange: (chords: string[]) => void;
}

/**
 * SimpleChordData is a serializable version of Chord without VexFlow objects
 * Used for storage and data transfer
 */
export interface SimpleChordData {
  keys: string[];
  duration: string;
  userClickY: number;
  // No staveNotes to avoid circular references
}

export type Level =
  | "advanced-theory"
  | "advanced-improvisation"
  | "intro-to-arranging"
  | "intermediate-arranging"
  | "advanced-arranging"
  | "rhythm-class"
  | "sibelius-class"
  | "select-here";

export type RendererRef = React.RefObject<InstanceType<typeof Renderer>>;
export type SetStaves = Dispatch<SetStateAction<StaveType[]>>;
export type SetStavesForChords = Dispatch<SetStateAction<StaveType[]>>;
export type BlankStaves = StaveType[];
export type NoteData = StaveNoteData[][];

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
  exactX: number;
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
  exactX: number;
}

export interface SimpleScaleData {
  keys: string[];
  duration: string;
  userClickY: number;
  exactX: number;
  barIndex: number; // To track which bar the note belongs to
  noteIndex: number; // To track position within the bar
  // No StaveNote to avoid circular references
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
  openEnterNotes: () => void;
}

export interface CheckIfNoteFoundProps {
  noNoteFound: boolean;
  openEnterNotes: () => void;
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

export interface NotateKeySignatureProps {
  initialKeySignature?: string[];
  initialGlyphs?: GlyphProps[];
  onChange?: (notes: string[], glyphs: GlyphProps[]) => void;
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
  keySignatureGlyphsNotation1?: GlyphProps[];
  keySignatureGlyphsNotation2?: GlyphProps[];
  keySignatureGlyphsNotation3?: GlyphProps[];
  keySignatureGlyphsNotation4?: GlyphProps[];
  scales1: string[];
  scales2: string[];
  scales3: string[];
  scales4: string[];
  scales5: string[];
  scales6: string[];
  scaleData1?: SimpleScaleData[];
  scaleData2?: SimpleScaleData[];
  scaleData3?: SimpleScaleData[];
  scaleData4?: SimpleScaleData[];
  scaleData5?: SimpleScaleData[];
  scaleData6?: SimpleScaleData[];
  triads1: string[];
  triads2: string[];
  triads3: string[];
  triads4: string[];
  triads5: string[];
  triads6: string[];
  triadsData1?: SimpleChordData;
  triadsData2?: SimpleChordData;
  triadsData3?: SimpleChordData;
  triadsData4?: SimpleChordData;
  triadsData5?: SimpleChordData;
  triadsData6?: SimpleChordData;
  seventhChords1: string[];
  seventhChords2: string[];
  seventhChords3: string[];
  seventhChords4: string[];
  seventhChords5: string[];
  seventhChords6: string[];
  seventhChords7: string[];
  seventhChordsData1?: SimpleChordData;
  seventhChordsData2?: SimpleChordData;
  seventhChordsData3?: SimpleChordData;
  seventhChordsData4?: SimpleChordData;
  seventhChordsData5?: SimpleChordData;
  seventhChordsData6?: SimpleChordData;
  seventhChordsData7?: SimpleChordData;
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

export interface ProgressionState {
  [key: string]: string;
}

export interface CardFooterProps {
  width?: number;
  height?: number;
  pageNumber: number;
  buttonType?: "submit" | "button" | "reset" | undefined;
  buttonText?: string;
  handleSubmit?: any;
  buttonForm?: string;
}

export interface CustomButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  isEnabled?: boolean;
  active?: boolean;
}

export interface FormInputProps {
  labelText?: string;
  name: string;
  type?: string;
  value: string;
  fontSize?: string;
  placeholder?: string;
  maxLength?: number;
  width?: string;
  height?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  required?: boolean;
}

export type IdentifyNotationProps = {
  numBars?: number;
  evenbars?: boolean;
  chords?: Chord[];
  width: number;
  currentData?: TextInput;
  handleInput: (input: InputData) => void;
};

export type StaffProps = {
  clef?: string;
  timeSignature?: string;
  noTimeSignature?: boolean;
  evenbars?: boolean;
  width?: number;
  height?: number;
  addDoubleBarLine?: boolean;
  numBars?: number;
  chords?: Chord[];
  keySig?: string[];
  allDoubleBarLines?: boolean;
};

export type NotationContainerProps = {
  containerRef: RefObject<HTMLDivElement | null>;
  onClick?: (e: React.MouseEvent) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  children?: ReactNode;
  width?: string;
  height?: string;
};

export type SimpleSnackbarProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  message: string;
};

export type TutorialInstructions = {
  instructionTitle: string;
  instructionText: string;
};

export interface TutorialModalProps {
  tutorialInstructions: TutorialInstructions[];
}

export type ClefProviderProps = {
  children: ReactNode;
};

export type CreateTimerContextType = {
  timeLeft: number;
  isRunning: boolean;
  startTimer: (duration: SetStateAction<number>, callback: () => void) => void;
  stopTimer: () => void;
};

export type AuthContextType = {
  children: ReactNode;
};

export type UseNotationClickHandlerProps = {
  containerRef: RefObject<HTMLDivElement | null>;
  staves: StaveType[];
  notesAndCoordinates: NotesAndCoordinatesData[];
  setOpen: (open: boolean) => void;
  setMessage: (message: string) => void;
};

export type FlexibleDivRef = { current: HTMLDivElement | null };

export type UseNotationRendererProps = {
  containerRef: FlexibleDivRef;
  renderFunction: () => StaveType[] | undefined;
  scaleFactor?: number;
  width?: number;
  height?: number;
};
