import VexFlow from "vexflow";
import { BlankStaves, CreateBlankStavesParams } from "./typesAndInterfaces";
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
    clef,
    timeSig,
    keySig,
  } = params
): BlankStaves => {
  const stavesArray: InstanceType<typeof Stave>[] = [];
  if (regularStaveWidth)
    for (let i = 0; i < numStaves; i++) {
      let staveWidth = i === 0 ? firstStaveWidth : regularStaveWidth;
      let stave = new Stave(x, y, staveWidth);
      // console.log(stave.getYForLine(1))
      // console.log(stave.getYForLine(2))
      // console.log(stave.getYForLine(3))
      // console.log(stave.getYForLine(4))
      // console.log(stave.getYForLine(5))
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
