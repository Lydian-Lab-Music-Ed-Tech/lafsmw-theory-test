import VexFlow, { RenderContext } from "vexflow";
import { roundToNearest5 } from "./roundToNearest5";
import { GlyphProps, StaveType } from "./types";
const VF = VexFlow.Flow;
const { Glyph } = VF;

export const buildKeySignature = (
  glyphs: GlyphProps[],
  sizeOfGlyph: number,
  context: RenderContext,
  stave: StaveType
) => {
  glyphs &&
    glyphs.forEach((glyphInfo) => {
      const adjustedYPosition = roundToNearest5(glyphInfo.yPosition);
      const glyph = new Glyph(glyphInfo.glyph, sizeOfGlyph);
      glyph
        .setContext(context)
        .setStave(stave)
        .render(context, glyphInfo.xPosition, adjustedYPosition);
    });
};
