import VexFlow from "vexflow";
import { BlankStaves, CreateBlankStavesParams } from "./types";
const VF = VexFlow.Flow;
const { Stave } = VF;

const createBlankStaves = (
  params: CreateBlankStavesParams,
  {
    numStaves,
    context,
    firstStaveWidth,
    x,
    y,
    regularStaveWidth,
    chosenClef: clef,
    timeSig,
    keySig,
  } = params
): BlankStaves => {
  const spaceAboveStaff = { space_above_staff_ln: -10 };
  const stavesArray: InstanceType<typeof Stave>[] = [];
  if (regularStaveWidth)
    for (let i = 0; i < numStaves; i++) {
      let staveWidth = i === 0 ? firstStaveWidth : regularStaveWidth;
      let stave = new Stave(x, y, staveWidth, spaceAboveStaff);
      i === 0 && clef ? stave.addClef(clef) : null;
      i === 0 && timeSig ? stave.addTimeSignature(timeSig) : null;
      i === 0 && keySig ? stave.addKeySignature(keySig) : null;
      i === numStaves - 1 ? stave.setEndBarType(3) : null;
      context ? stave.setContext(context).draw() : null;
      x += staveWidth;
      stavesArray.push(stave);
    }
  else {
    return [];
  }

  return stavesArray;
};

export default createBlankStaves;
