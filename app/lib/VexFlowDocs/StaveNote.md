# StaveNote | vexflow

## Constructors

### constructor[](#constructor)

- new StaveNote(noteStruct): [StaveNote](StaveNote.html)
  [](#constructor.new_StaveNote)
- #### Returns [StaveNote](StaveNote.html)

## Properties

### glyphProps[](#glyphProps)

### keyProps[](#keyProps)

### keys[](#keys)

keys: string\[\]

### maxLine[](#maxLine)

maxLine: number = 0

### minLine[](#minLine)

minLine: number = 0

### render_options[](#render_options)

render_options: {
    annotation_spacing: number;
    draw?: boolean;
    draw_dots?: boolean;
    draw_stem?: boolean;
    draw_stem_through_stave?: boolean;
    extend_left?: number;
    extend_right?: number;
    font: string;
    glyph_font_scale: number;
    glyph_font_size?: number;
    scale: number;
    stroke_px: number;
    y_shift: number;
}

#### Type declaration

- ##### annotation_spacing: number

- ##### `Optional` draw?: boolean

- ##### `Optional` draw_dots?: boolean

- ##### `Optional` draw_stem?: boolean

- ##### `Optional` draw_stem_through_stave?: boolean

- ##### `Optional` extend_left?: number

- ##### `Optional` extend_right?: number

- ##### font: string

- ##### glyph_font_scale: number

- ##### `Optional` glyph_font_size?: number

- ##### scale: number

- ##### stroke_px: number

- ##### y_shift: number

### `Optional` stem[](#stem)

### `Optional` stem_direction[](#stem_direction)

stem_direction?: number

### `Static` DEBUG[](#DEBUG)

DEBUG: boolean = false

### `Static` TEXT_FONT[](#TEXT_FONT)

TEXT_FONT: Required<[FontInfo](../interfaces/FontInfo.html)\> = ...

## Accessors

### font[](#font-1)

- get font(): string
- #### Returns string

- set font(f): void
- #### Parameters

  - ##### f: string

  #### Returns void

### fontInfo[](#fontInfo)

- get fontInfo(): Required<[FontInfo](../interfaces/FontInfo.html)\>
- #### Returns Required<[FontInfo](../interfaces/FontInfo.html)\>

- set fontInfo(fontInfo): void
- #### Returns void

### fontSize[](#fontSize)

- get fontSize(): string
- #### Returns string

  a CSS font-size string (e.g., '18pt', '12px', '1em').

- set fontSize(size): void
- #### Parameters

  - ##### size: string | number

  #### Returns void

### fontSizeInPixels[](#fontSizeInPixels)

- get fontSizeInPixels(): number
- #### Returns number

  the font size in `px`.

### fontSizeInPoints[](#fontSizeInPoints)

- get fontSizeInPoints(): number
- #### Returns number

  the font size in `pt`.

### fontStyle[](#fontStyle)

- get fontStyle(): string
- #### Returns string

  a CSS font-style string (e.g., 'italic').

- set fontStyle(style): void
- #### Parameters

  - ##### style: string

  #### Returns void

### fontWeight[](#fontWeight)

- get fontWeight(): string
- #### Returns string

  a CSS font-weight string (e.g., 'bold'). As in CSS, font-weight is always returned as a string, even if it was set as a number.

- set fontWeight(weight): void
- #### Parameters

  - ##### weight: string | number

  #### Returns void

### noteHeads[](#noteHeads)

- get noteHeads(): [NoteHead](NoteHead.html)\[\]
- #### Returns [NoteHead](NoteHead.html)\[\]

### note_heads[](#note_heads)

- get note_heads(): [NoteHead](NoteHead.html)\[\]
- #### Returns [NoteHead](NoteHead.html)\[\]

### postFormatted[](#postFormatted)

- get postFormatted(): boolean
- #### Returns boolean

- set postFormatted(value): void
- #### Parameters

  - ##### value: boolean

  #### Returns void

### preFormatted[](#preFormatted)

- get preFormatted(): boolean
- #### Returns boolean

- set preFormatted(value): void
- #### Parameters

  - ##### value: boolean

  #### Returns void

### `Static` CATEGORY[](#CATEGORY)

- get CATEGORY(): string
- #### Returns string

### `Static` LEDGER_LINE_OFFSET[](#LEDGER_LINE_OFFSET)

- get LEDGER_LINE_OFFSET(): number
- #### Returns number

### `Static` STEM_DOWN[](#STEM_DOWN)

- get STEM_DOWN(): number
- #### Returns number

### `Static` STEM_UP[](#STEM_UP)

- get STEM_UP(): number
- #### Returns number

### `Static` minNoteheadPadding[](#minNoteheadPadding)

- get minNoteheadPadding(): number
- #### Returns number

## Methods

### addChildElement[](#addChildElement)

- addChildElement(child): [StaveNote](StaveNote.html)
  [](#addChildElement.addChildElement-1)
- #### Returns [StaveNote](StaveNote.html)

### addClass[](#addClass)

- addClass(className): [StaveNote](StaveNote.html)
  [](#addClass.addClass-1)
- #### Parameters

  - ##### className: string

  #### Returns [StaveNote](StaveNote.html)

### addModifier[](#addModifier)

- addModifier(modifier, index?): [StaveNote](StaveNote.html)
  [](#addModifier.addModifier-1)
- #### Parameters

  - ##### modifier: [Modifier](Modifier.html)

  - ##### index: number = 0

  #### Returns [StaveNote](StaveNote.html)

  this

### addStroke[](#addStroke)

- addStroke(index, stroke): [StaveNote](StaveNote.html)
  [](#addStroke.addStroke-1)
- #### Parameters

  - ##### index: number

  - ##### stroke: [Stroke](Stroke.html)

  #### Returns [StaveNote](StaveNote.html)

### addToModifierContext[](#addToModifierContext)

- addToModifierContext(mc): [StaveNote](StaveNote.html)
  [](#addToModifierContext.addToModifierContext-1)
- #### Returns [StaveNote](StaveNote.html)

  this

### applyStyle[](#applyStyle)

- applyStyle(context?, style?): [StaveNote](StaveNote.html)
  [](#applyStyle.applyStyle-1)
- #### Returns [StaveNote](StaveNote.html)

### applyTickMultiplier[](#applyTickMultiplier)

- applyTickMultiplier(numerator, denominator): void[](#applyTickMultiplier.applyTickMultiplier-1)
- #### Parameters

  - ##### numerator: number

  - ##### denominator: number

  #### Returns void

### autoStem[](#autoStem)

- autoStem(): void[](#autoStem.autoStem-1)
- #### Returns void

### buildFlag[](#buildFlag)

- buildFlag(category?): void[](#buildFlag.buildFlag-1)
- #### Parameters

  - ##### category: string = 'flag'

  #### Returns void

### buildNoteHeads[](#buildNoteHeads)

- buildNoteHeads(): [NoteHead](NoteHead.html)\[\][](#buildNoteHeads.buildNoteHeads-1)
- #### Returns [NoteHead](NoteHead.html)\[\]

### buildStem[](#buildStem)

- buildStem(): [StaveNote](StaveNote.html)
  [](#buildStem.buildStem-1)
- #### Returns [StaveNote](StaveNote.html)

### calcNoteDisplacements[](#calcNoteDisplacements)

- calcNoteDisplacements(): void[](#calcNoteDisplacements.calcNoteDisplacements-1)
- #### Returns void

### calculateKeyProps[](#calculateKeyProps)

- calculateKeyProps(): void[](#calculateKeyProps.calculateKeyProps-1)
- #### Returns void

### calculateOptimalStemDirection[](#calculateOptimalStemDirection)

- calculateOptimalStemDirection(): number[](#calculateOptimalStemDirection.calculateOptimalStemDirection-1)
- #### Returns number

### checkBeam[](#checkBeam)

- checkBeam(): [Beam](Beam.html)
  [](#checkBeam.checkBeam-1)
- #### Returns [Beam](Beam.html)

### checkContext[](#checkContext)

- checkContext(): [RenderContext](RenderContext.html)
  [](#checkContext.checkContext-1)
- #### Returns [RenderContext](RenderContext.html)

### checkModifierContext[](#checkModifierContext)

- checkModifierContext(): [ModifierContext](ModifierContext.html)
  [](#checkModifierContext.checkModifierContext-1)
- #### Returns [ModifierContext](ModifierContext.html)

### checkStave[](#checkStave)

- checkStave(): [Stave](Stave.html)
  [](#checkStave.checkStave-1)
- #### Returns [Stave](Stave.html)

### checkStem[](#checkStem)

- checkStem(): [Stem](Stem.html)
  [](#checkStem.checkStem-1)
- #### Returns [Stem](Stem.html)

### checkTickContext[](#checkTickContext)

- checkTickContext(message?): [TickContext](TickContext.html)
  [](#checkTickContext.checkTickContext-1)
- #### Parameters

  - ##### message: string = 'Tickable has no tick context.'

  #### Returns [TickContext](TickContext.html)

### draw[](#draw-1)

- draw(): void[](#draw-1.draw-2)
- #### Returns void

### drawFlag[](#drawFlag)

- drawFlag(): void[](#drawFlag.drawFlag-1)
- #### Returns void

### drawLedgerLines[](#drawLedgerLines)

- drawLedgerLines(): void[](#drawLedgerLines.drawLedgerLines-1)
- #### Returns void

### drawModifiers[](#drawModifiers)

- drawModifiers(noteheadParam): void[](#drawModifiers.drawModifiers-1)
- #### Returns void

### drawNoteHeads[](#drawNoteHeads)

- drawNoteHeads(): void[](#drawNoteHeads.drawNoteHeads-1)
- #### Returns void

### drawStem[](#drawStem)

- drawStem(stemOptions?): void[](#drawStem.drawStem-1)
- #### Returns void

### drawWithStyle[](#drawWithStyle)

- drawWithStyle(): void[](#drawWithStyle.drawWithStyle-1)
- #### Returns void

### getAbsoluteX[](#getAbsoluteX)

- getAbsoluteX(): number[](#getAbsoluteX.getAbsoluteX-1)
- #### Returns number

### getAttribute[](#getAttribute)

- getAttribute(name): any[](#getAttribute.getAttribute-1)
- #### Parameters

  - ##### name: string

  #### Returns any

### getAttributes[](#getAttributes)

- getAttributes(): [ElementAttributes](../interfaces/ElementAttributes.html)
  [](#getAttributes.getAttributes-1)
- #### Returns [ElementAttributes](../interfaces/ElementAttributes.html)

### getBaseCustomNoteHeadGlyphProps[](#getBaseCustomNoteHeadGlyphProps)

- getBaseCustomNoteHeadGlyphProps(): [GlyphProps](../interfaces/GlyphProps.html)
  [](#getBaseCustomNoteHeadGlyphProps.getBaseCustomNoteHeadGlyphProps-1)
- #### Returns [GlyphProps](../interfaces/GlyphProps.html)

### getBeam[](#getBeam)

- getBeam(): undefined | [Beam](Beam.html)
  [](#getBeam.getBeam-1)
- #### Returns undefined | [Beam](Beam.html)

### getBeamCount[](#getBeamCount)

- getBeamCount(): number[](#getBeamCount.getBeamCount-1)
- #### Returns number

### getBoundingBox[](#getBoundingBox)

- getBoundingBox(): [BoundingBox](BoundingBox.html)
  [](#getBoundingBox.getBoundingBox-1)
- #### Returns [BoundingBox](BoundingBox.html)

### getCategory[](#getCategory)

- getCategory(): string[](#getCategory.getCategory-1)
- #### Returns string

### getCenterGlyphX[](#getCenterGlyphX)

- getCenterGlyphX(): number[](#getCenterGlyphX.getCenterGlyphX-1)
- #### Returns number

### getCenterXShift[](#getCenterXShift)

- getCenterXShift(): number[](#getCenterXShift.getCenterXShift-1)
- #### Returns number

### getContext[](#getContext)

- getContext(): undefined | [RenderContext](RenderContext.html)
  [](#getContext.getContext-1)
- #### Returns undefined | [RenderContext](RenderContext.html)

### getDuration[](#getDuration)

- getDuration(): string[](#getDuration.getDuration-1)
- #### Returns string

### getFirstDotPx[](#getFirstDotPx)

- getFirstDotPx(): number[](#getFirstDotPx.getFirstDotPx-1)
- #### Returns number

### getFlagStyle[](#getFlagStyle)

- getFlagStyle(): undefined | [ElementStyle](../interfaces/ElementStyle.html)
  [](#getFlagStyle.getFlagStyle-1)
- #### Returns undefined | [ElementStyle](../interfaces/ElementStyle.html)

### getFont[](#getFont)

- getFont(): string[](#getFont.getFont-1)
- #### Returns string

### getFontSize[](#getFontSize)

- getFontSize(): string[](#getFontSize.getFontSize-1)
- #### Returns string

  a CSS font-size string (e.g., '18pt', '12px', '1em'). See Element.fontSizeInPixels or Element.fontSizeInPoints if you need to get a number for calculation purposes.

### getFormatterMetrics[](#getFormatterMetrics)

- getFormatterMetrics(): [FormatterMetrics](../interfaces/FormatterMetrics.html)
  [](#getFormatterMetrics.getFormatterMetrics-1)
- #### Returns [FormatterMetrics](../interfaces/FormatterMetrics.html)

### getGlyph[](#getGlyph)

- getGlyph(): any[](#getGlyph.getGlyph-1)
- #### Returns any

### getGlyphProps[](#getGlyphProps)

- getGlyphProps(): [GlyphProps](../interfaces/GlyphProps.html)
  [](#getGlyphProps.getGlyphProps-1)
- #### Returns [GlyphProps](../interfaces/GlyphProps.html)

### getGlyphWidth[](#getGlyphWidth)

- getGlyphWidth(): number[](#getGlyphWidth.getGlyphWidth-1)
- #### Returns number

### getIntrinsicTicks[](#getIntrinsicTicks)

- getIntrinsicTicks(): number[](#getIntrinsicTicks.getIntrinsicTicks-1)
- #### Returns number

### getKeyLine[](#getKeyLine)

- getKeyLine(index): number[](#getKeyLine.getKeyLine-1)
- #### Parameters

  - ##### index: number

  #### Returns number

### getKeyProps[](#getKeyProps)

- getKeyProps(): [KeyProps](../interfaces/KeyProps.html)\[\][](#getKeyProps.getKeyProps-1)
- #### Returns [KeyProps](../interfaces/KeyProps.html)\[\]

### getKeys[](#getKeys)

- getKeys(): string\[\][](#getKeys.getKeys-1)
- #### Returns string\[\]

### getLedgerLineStyle[](#getLedgerLineStyle)

- getLedgerLineStyle(): [ElementStyle](../interfaces/ElementStyle.html)
  [](#getLedgerLineStyle.getLedgerLineStyle-1)
- #### Returns [ElementStyle](../interfaces/ElementStyle.html)

### getLeftDisplacedHeadPx[](#getLeftDisplacedHeadPx)

- getLeftDisplacedHeadPx(): number[](#getLeftDisplacedHeadPx.getLeftDisplacedHeadPx-1)
- #### Returns number

### getLeftParenthesisPx[](#getLeftParenthesisPx)

- getLeftParenthesisPx(index): number[](#getLeftParenthesisPx.getLeftParenthesisPx-1)
- #### Parameters

  - ##### index: number

  #### Returns number

### getLineForRest[](#getLineForRest)

- getLineForRest(): number[](#getLineForRest.getLineForRest-1)
- #### Returns number

### getLineNumber[](#getLineNumber)

- getLineNumber(isTopNote?): number[](#getLineNumber.getLineNumber-1)
- #### Parameters

  - ##### `Optional` isTopNote: boolean

  #### Returns number

### getMetrics[](#getMetrics)

- getMetrics(): [NoteMetrics](../interfaces/NoteMetrics.html)
  [](#getMetrics.getMetrics-1)
- #### Returns [NoteMetrics](../interfaces/NoteMetrics.html)

### getModifierContext[](#getModifierContext)

- getModifierContext(): undefined | [ModifierContext](ModifierContext.html)
  [](#getModifierContext.getModifierContext-1)
- #### Returns undefined | [ModifierContext](ModifierContext.html)

### getModifierStartXY[](#getModifierStartXY)

- getModifierStartXY(position, index, options?): {
      x: number;
      y: number;
  }[](#getModifierStartXY.getModifierStartXY-1)
- #### Parameters

  - ##### position: number

  - ##### index: number

  - ##### options: {

        forceFlagRight?: boolean;
    } = {}

    - ##### `Optional` forceFlagRight?: boolean

  #### Returns {

      x: number;
      y: number;
  }

  - ##### x: number

  - ##### y: number

### getModifiers[](#getModifiers)

- getModifiers(): [Modifier](Modifier.html)\[\][](#getModifiers.getModifiers-1)
- #### Returns [Modifier](Modifier.html)\[\]

### getModifiersByType[](#getModifiersByType)

- getModifiersByType(type): [Modifier](Modifier.html)\[\][](#getModifiersByType.getModifiersByType-1)
- #### Parameters

  - ##### type: string

  #### Returns [Modifier](Modifier.html)\[\]

### getNoteHeadBeginX[](#getNoteHeadBeginX)

- getNoteHeadBeginX(): number[](#getNoteHeadBeginX.getNoteHeadBeginX-1)
- #### Returns number

### getNoteHeadBounds[](#getNoteHeadBounds)

- getNoteHeadBounds(): [StaveNoteHeadBounds](../interfaces/StaveNoteHeadBounds.html)
  [](#getNoteHeadBounds.getNoteHeadBounds-1)
- #### Returns [StaveNoteHeadBounds](../interfaces/StaveNoteHeadBounds.html)

### getNoteHeadEndX[](#getNoteHeadEndX)

- getNoteHeadEndX(): number[](#getNoteHeadEndX.getNoteHeadEndX-1)
- #### Returns number

### getNoteType[](#getNoteType)

- getNoteType(): string[](#getNoteType.getNoteType-1)
- #### Returns string

### getPlayNote[](#getPlayNote)

- getPlayNote(): undefined | [Note](Note.html)
  [](#getPlayNote.getPlayNote-1)
- #### Returns undefined | [Note](Note.html)

### getRightDisplacedHeadPx[](#getRightDisplacedHeadPx)

- getRightDisplacedHeadPx(): number[](#getRightDisplacedHeadPx.getRightDisplacedHeadPx-1)
- #### Returns number

### getRightParenthesisPx[](#getRightParenthesisPx)

- getRightParenthesisPx(index): number[](#getRightParenthesisPx.getRightParenthesisPx-1)
- #### Parameters

  - ##### index: number

  #### Returns number

### getSVGElement[](#getSVGElement)

- getSVGElement(suffix?): undefined | SVGElement[](#getSVGElement.getSVGElement-1)
- #### Parameters

  - ##### suffix: string = ''

  #### Returns undefined | SVGElement

### getStave[](#getStave)

- getStave(): undefined | [Stave](Stave.html)
  [](#getStave.getStave-1)
- #### Returns undefined | [Stave](Stave.html)

### getStaveNoteScale[](#getStaveNoteScale)

- getStaveNoteScale(): number[](#getStaveNoteScale.getStaveNoteScale-1)
- #### Returns number

### getStem[](#getStem)

- getStem(): undefined | [Stem](Stem.html)
  [](#getStem.getStem-1)
- #### Returns undefined | [Stem](Stem.html)

### getStemDirection[](#getStemDirection)

- getStemDirection(): number[](#getStemDirection.getStemDirection-1)
- #### Returns number

### getStemExtension[](#getStemExtension)

- getStemExtension(): number[](#getStemExtension.getStemExtension-1)
- #### Returns number

### getStemExtents[](#getStemExtents)

- getStemExtents(): {
      baseY: number;
      topY: number;
  }[](#getStemExtents.getStemExtents-1)
- #### Returns {

      baseY: number;
      topY: number;
  }

  - ##### baseY: number

  - ##### topY: number

### getStemLength[](#getStemLength)

- getStemLength(): number[](#getStemLength.getStemLength-1)
- #### Returns number

### getStemMinimumLength[](#getStemMinimumLength)

- getStemMinimumLength(): number[](#getStemMinimumLength.getStemMinimumLength-1)
- #### Returns number

### getStemStyle[](#getStemStyle)

- getStemStyle(): undefined | [ElementStyle](../interfaces/ElementStyle.html)
  [](#getStemStyle.getStemStyle-1)
- #### Returns undefined | [ElementStyle](../interfaces/ElementStyle.html)

### getStemX[](#getStemX)

- getStemX(): number[](#getStemX.getStemX-1)
- #### Returns number

### getStyle[](#getStyle)

- getStyle(): undefined | [ElementStyle](../interfaces/ElementStyle.html)
  [](#getStyle.getStyle-1)
- #### Returns undefined | [ElementStyle](../interfaces/ElementStyle.html)

### getTickContext[](#getTickContext)

- getTickContext(): [TickContext](TickContext.html)
  [](#getTickContext.getTickContext-1)
- #### Returns [TickContext](TickContext.html)

### getTickMultiplier[](#getTickMultiplier)

- getTickMultiplier(): [Fraction](Fraction.html)
  [](#getTickMultiplier.getTickMultiplier-1)
- #### Returns [Fraction](Fraction.html)

### getTicks[](#getTicks)

- getTicks(): [Fraction](Fraction.html)
  [](#getTicks.getTicks-1)
- #### Returns [Fraction](Fraction.html)

### getTieLeftX[](#getTieLeftX)

- getTieLeftX(): number[](#getTieLeftX.getTieLeftX-1)
- #### Returns number

### getTieRightX[](#getTieRightX)

- getTieRightX(): number[](#getTieRightX.getTieRightX-1)
- #### Returns number

### getTuplet[](#getTuplet)

- getTuplet(): undefined | [Tuplet](Tuplet.html)
  [](#getTuplet.getTuplet-1)
- #### Returns undefined | [Tuplet](Tuplet.html)

### getTupletStack[](#getTupletStack)

- getTupletStack(): [Tuplet](Tuplet.html)\[\][](#getTupletStack.getTupletStack-1)
- #### Returns [Tuplet](Tuplet.html)\[\]

### getVoice[](#getVoice)

- getVoice(): [Voice](Voice.html)
  [](#getVoice.getVoice-1)
- #### Returns [Voice](Voice.html)

### getVoiceShiftWidth[](#getVoiceShiftWidth)

- getVoiceShiftWidth(): number[](#getVoiceShiftWidth.getVoiceShiftWidth-1)
- #### Returns number

### getWidth[](#getWidth)

- getWidth(): number[](#getWidth.getWidth-1)
- #### Returns number

### getX[](#getX)

- getX(): number[](#getX.getX-1)
- #### Returns number

### getXShift[](#getXShift)

- getXShift(): number[](#getXShift.getXShift-1)
- #### Returns number

### getYForBottomText[](#getYForBottomText)

- getYForBottomText(textLine): number[](#getYForBottomText.getYForBottomText-1)
- #### Parameters

  - ##### textLine: number

  #### Returns number

### getYForTopText[](#getYForTopText)

- getYForTopText(textLine): number[](#getYForTopText.getYForTopText-1)
- #### Parameters

  - ##### textLine: number

  #### Returns number

### getYs[](#getYs)

- getYs(): number\[\][](#getYs.getYs-1)
- #### Returns number\[\]

### hasBeam[](#hasBeam)

- hasBeam(): boolean[](#hasBeam.hasBeam-1)
- #### Returns boolean

### hasClass[](#hasClass)

- hasClass(className): boolean[](#hasClass.hasClass-1)
- #### Parameters

  - ##### className: string

  #### Returns boolean

### hasFlag[](#hasFlag)

- hasFlag(): boolean[](#hasFlag.hasFlag-1)
- #### Returns boolean

### hasStem[](#hasStem)

- hasStem(): boolean[](#hasStem.hasStem-1)
- #### Returns boolean

### isCenterAligned[](#isCenterAligned)

- isCenterAligned(): boolean[](#isCenterAligned.isCenterAligned-1)
- #### Returns boolean

### isChord[](#isChord)

- isChord(): boolean[](#isChord.isChord-1)
- #### Returns boolean

### isDisplaced[](#isDisplaced)

- isDisplaced(): boolean[](#isDisplaced.isDisplaced-1)
- #### Returns boolean

### isDotted[](#isDotted)

- isDotted(): boolean[](#isDotted.isDotted-1)
- #### Returns boolean

### isRendered[](#isRendered)

- isRendered(): boolean[](#isRendered.isRendered-1)
- #### Returns boolean

### isRest[](#isRest)

- isRest(): boolean[](#isRest.isRest-1)
- #### Returns boolean

  true if this note is a type of rest. Rests don't have pitches, but take up space in the score.

### onRegister[](#onRegister)

- onRegister(registry): [StaveNote](StaveNote.html)
  [](#onRegister.onRegister-1)
- #### Returns [StaveNote](StaveNote.html)

### postFormat[](#postFormat)

- postFormat(): [StaveNote](StaveNote.html)
  [](#postFormat.postFormat-1)
- #### Returns [StaveNote](StaveNote.html)

### preFormat[](#preFormat)

- preFormat(): void[](#preFormat.preFormat-1)
- #### Returns void

### removeClass[](#removeClass)

- removeClass(className): [StaveNote](StaveNote.html)
  [](#removeClass.removeClass-1)
- #### Parameters

  - ##### className: string

  #### Returns [StaveNote](StaveNote.html)

### reset[](#reset)

- reset(): [StaveNote](StaveNote.html)
  [](#reset.reset-1)
- #### Returns [StaveNote](StaveNote.html)

### resetFont[](#resetFont)

- resetFont(): void[](#resetFont.resetFont-1)
- #### Returns void

### resetTuplet[](#resetTuplet)

- resetTuplet(tuplet?): [StaveNote](StaveNote.html)
  [](#resetTuplet.resetTuplet-1)
- #### Parameters

  - ##### `Optional` tuplet: [Tuplet](Tuplet.html)

  #### Returns [StaveNote](StaveNote.html)

### restoreStyle[](#restoreStyle)

- restoreStyle(context?, style?): [StaveNote](StaveNote.html)
  [](#restoreStyle.restoreStyle-1)
- #### Returns [StaveNote](StaveNote.html)

### setAttribute[](#setAttribute)

- setAttribute(name, value): [StaveNote](StaveNote.html)
  [](#setAttribute.setAttribute-1)
- #### Parameters

  - ##### name: string

  - ##### value: undefined | string

  #### Returns [StaveNote](StaveNote.html)

### setBeam[](#setBeam)

- setBeam(beam): [StaveNote](StaveNote.html)
  [](#setBeam.setBeam-1)
- #### Parameters

  - ##### beam: [Beam](Beam.html)

  #### Returns [StaveNote](StaveNote.html)

### setCenterAlignment[](#setCenterAlignment)

- setCenterAlignment(align_center): [StaveNote](StaveNote.html)
  [](#setCenterAlignment.setCenterAlignment-1)
- #### Parameters

  - ##### align_center: boolean

  #### Returns [StaveNote](StaveNote.html)

### setCenterXShift[](#setCenterXShift)

- setCenterXShift(centerXShift): [StaveNote](StaveNote.html)
  [](#setCenterXShift.setCenterXShift-1)
- #### Parameters

  - ##### centerXShift: number

  #### Returns [StaveNote](StaveNote.html)

### setContext[](#setContext)

- setContext(context?): [StaveNote](StaveNote.html)
  [](#setContext.setContext-1)
- #### Returns [StaveNote](StaveNote.html)

### setDuration[](#setDuration)

- setDuration(duration): void[](#setDuration.setDuration-1)
- #### Returns void

### setFlagStyle[](#setFlagStyle)

- setFlagStyle(style): void[](#setFlagStyle.setFlagStyle-1)
- #### Returns void

### setFont[](#setFont)

- setFont(font?, size?, weight?, style?): [StaveNote](StaveNote.html)
  [](#setFont.setFont-1)
- #### Parameters

  - ##### `Optional` font: string | [FontInfo](../interfaces/FontInfo.html)

  - ##### `Optional` size: string | number

  - ##### `Optional` weight: string | number

  - ##### `Optional` style: string

  #### Returns [StaveNote](StaveNote.html)

### setFontSize[](#setFontSize)

- setFontSize(size?): [StaveNote](StaveNote.html)
  [](#setFontSize.setFontSize-1)
- #### Parameters

  - ##### `Optional` size: string | number

  #### Returns [StaveNote](StaveNote.html)

### setGroupStyle[](#setGroupStyle)

- setGroupStyle(style): [StaveNote](StaveNote.html)
  [](#setGroupStyle.setGroupStyle-1)
- #### Returns [StaveNote](StaveNote.html)

### setIgnoreTicks[](#setIgnoreTicks)

- setIgnoreTicks(flag): [StaveNote](StaveNote.html)
  [](#setIgnoreTicks.setIgnoreTicks-1)
- #### Parameters

  - ##### flag: boolean

  #### Returns [StaveNote](StaveNote.html)

### setIntrinsicTicks[](#setIntrinsicTicks)

- setIntrinsicTicks(intrinsicTicks): void[](#setIntrinsicTicks.setIntrinsicTicks-1)
- #### Parameters

  - ##### intrinsicTicks: number

  #### Returns void

### setKeyLine[](#setKeyLine)

- setKeyLine(index, line): [StaveNote](StaveNote.html)
  [](#setKeyLine.setKeyLine-1)
- #### Parameters

  - ##### index: number

  - ##### line: number

  #### Returns [StaveNote](StaveNote.html)

### setKeyStyle[](#setKeyStyle)

- setKeyStyle(index, style): [StaveNote](StaveNote.html)
  [](#setKeyStyle.setKeyStyle-1)
- #### Returns [StaveNote](StaveNote.html)

### setLedgerLineStyle[](#setLedgerLineStyle)

- setLedgerLineStyle(style): void[](#setLedgerLineStyle.setLedgerLineStyle-1)
- #### Returns void

### setLeftDisplacedHeadPx[](#setLeftDisplacedHeadPx)

- setLeftDisplacedHeadPx(x): [StaveNote](StaveNote.html)
  [](#setLeftDisplacedHeadPx.setLeftDisplacedHeadPx-1)
- #### Parameters

  - ##### x: number

  #### Returns [StaveNote](StaveNote.html)

### setModifierContext[](#setModifierContext)

- setModifierContext(mc?): [StaveNote](StaveNote.html)
  [](#setModifierContext.setModifierContext-1)
- #### Returns [StaveNote](StaveNote.html)

### setNoteDisplaced[](#setNoteDisplaced)

- setNoteDisplaced(displaced): [StaveNote](StaveNote.html)
  [](#setNoteDisplaced.setNoteDisplaced-1)
- #### Parameters

  - ##### displaced: boolean

  #### Returns [StaveNote](StaveNote.html)

### setPlayNote[](#setPlayNote)

- setPlayNote(note): [StaveNote](StaveNote.html)
  [](#setPlayNote.setPlayNote-1)
- #### Parameters

  - ##### note: [Note](Note.html)

  #### Returns [StaveNote](StaveNote.html)

### setRendered[](#setRendered)

- setRendered(rendered?): [StaveNote](StaveNote.html)
  [](#setRendered.setRendered-1)
- #### Parameters

  - ##### rendered: boolean = true

  #### Returns [StaveNote](StaveNote.html)

### setRightDisplacedHeadPx[](#setRightDisplacedHeadPx)

- setRightDisplacedHeadPx(x): [StaveNote](StaveNote.html)
  [](#setRightDisplacedHeadPx.setRightDisplacedHeadPx-1)
- #### Parameters

  - ##### x: number

  #### Returns [StaveNote](StaveNote.html)

### setStave[](#setStave)

- setStave(stave): [StaveNote](StaveNote.html)
  [](#setStave.setStave-1)
- #### Returns [StaveNote](StaveNote.html)

### setStem[](#setStem)

- setStem(stem): [StaveNote](StaveNote.html)
  [](#setStem.setStem-1)
- #### Parameters

  - ##### stem: [Stem](Stem.html)

  #### Returns [StaveNote](StaveNote.html)

### setStemDirection[](#setStemDirection)

- setStemDirection(direction?): [StaveNote](StaveNote.html)
  [](#setStemDirection.setStemDirection-1)
- #### Parameters

  - ##### `Optional` direction: number

  #### Returns [StaveNote](StaveNote.html)

### setStemLength[](#setStemLength)

- setStemLength(height): [StaveNote](StaveNote.html)
  [](#setStemLength.setStemLength-1)
- #### Parameters

  - ##### height: number

  #### Returns [StaveNote](StaveNote.html)

### setStemStyle[](#setStemStyle)

- setStemStyle(style): [StaveNote](StaveNote.html)
  [](#setStemStyle.setStemStyle-1)
- #### Returns [StaveNote](StaveNote.html)

### setStyle[](#setStyle)

- setStyle(style): [StaveNote](StaveNote.html)
  [](#setStyle.setStyle-1)
- #### Returns [StaveNote](StaveNote.html)

### setTickContext[](#setTickContext)

- setTickContext(tc): [StaveNote](StaveNote.html)
  [](#setTickContext.setTickContext-1)
- #### Returns [StaveNote](StaveNote.html)

### setTuplet[](#setTuplet)

- setTuplet(tuplet): [StaveNote](StaveNote.html)
  [](#setTuplet.setTuplet-1)
- #### Returns [StaveNote](StaveNote.html)

### setVoice[](#setVoice)

- setVoice(voice): [StaveNote](StaveNote.html)
  [](#setVoice.setVoice-1)
- #### Returns [StaveNote](StaveNote.html)

### setWidth[](#setWidth)

- setWidth(width): void[](#setWidth.setWidth-1)
- #### Parameters

  - ##### width: number

  #### Returns void

### setXShift[](#setXShift)

- setXShift(x): [StaveNote](StaveNote.html)
  [](#setXShift.setXShift-1)
- #### Parameters

  - ##### x: number

  #### Returns [StaveNote](StaveNote.html)

### setYs[](#setYs)

- setYs(ys): [StaveNote](StaveNote.html)
  [](#setYs.setYs-1)
- #### Parameters

  - ##### ys: number\[\]

  #### Returns [StaveNote](StaveNote.html)

### shouldDrawFlag[](#shouldDrawFlag)

- shouldDrawFlag(): boolean[](#shouldDrawFlag.shouldDrawFlag-1)
- #### Returns boolean

### shouldIgnoreTicks[](#shouldIgnoreTicks)

- shouldIgnoreTicks(): boolean[](#shouldIgnoreTicks.shouldIgnoreTicks-1)
- #### Returns boolean

### `Static` format[](#format)

- format(notes, state): boolean[](#format.format-1)
- #### Returns boolean

### `Static` getPoint[](#getPoint)

- getPoint(size?): number[](#getPoint.getPoint-1)
- #### Parameters

  - ##### `Optional` size: string

  #### Returns number

### `Static` plotMetrics[](#plotMetrics)

- plotMetrics(ctx, note, yPos): void[](#plotMetrics.plotMetrics-1)
- #### Returns void

### `Static` postFormat[](#postFormat-2)

- postFormat(notes): boolean[](#postFormat-2.postFormat-3)
- #### Parameters

  - ##### notes: [Note](Note.html)\[\]

  #### Returns boolean
