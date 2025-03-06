# Formatter | vexflow

- [vexflow](../modules.html)
- [Formatter](Formatter.html)

## Class Formatter

#### Hierarchy

- Formatter

##### Index

## Constructors

### constructor[](#constructor)

- new Formatter(options?): [Formatter](Formatter.html)
  [](#constructor.new_Formatter)
- #### Returns [Formatter](Formatter.html)

## Properties

### `Static` DEBUG[](#DEBUG)

DEBUG: boolean = false

## Methods

### alignRests[](#alignRests)

- alignRests(voices, alignAllNotes): void[](#alignRests.alignRests-1)
- #### Parameters

  - ##### voices: [Voice](Voice.html)\[\]

  - ##### alignAllNotes: boolean

  #### Returns void

### createModifierContexts[](#createModifierContexts)

- createModifierContexts(voices): void[](#createModifierContexts.createModifierContexts-1)
- #### Parameters

  - ##### voices: [Voice](Voice.html)\[\]

  #### Returns void

### createTickContexts[](#createTickContexts)

- createTickContexts(voices): [AlignmentContexts](../interfaces/AlignmentContexts.html)<[TickContext](TickContext.html)\>[](#createTickContexts.createTickContexts-1)
- #### Parameters

  - ##### voices: [Voice](Voice.html)\[\]

  #### Returns [AlignmentContexts](../interfaces/AlignmentContexts.html)<[TickContext](TickContext.html)\>

### evaluate[](#evaluate)

- evaluate(): number[](#evaluate.evaluate-1)
- #### Returns number

### format[](#format)

- format(voices, justifyWidth?, options?): [Formatter](Formatter.html)
  [](#format.format-1)
- #### Parameters

  - ##### voices: [Voice](Voice.html)\[\]

  - ##### `Optional` justifyWidth: number

  - ##### `Optional` options: [FormatParams](../interfaces/FormatParams.html)

  #### Returns [Formatter](Formatter.html)

### formatToStave[](#formatToStave)

- formatToStave(voices, stave, optionsParam?): [Formatter](Formatter.html)
  [](#formatToStave.formatToStave-1)
- #### Returns [Formatter](Formatter.html)

### getMinTotalWidth[](#getMinTotalWidth)

- getMinTotalWidth(): number[](#getMinTotalWidth.getMinTotalWidth-1)
- #### Returns number

### getTickContext[](#getTickContext)

- getTickContext(tick): undefined | [TickContext](TickContext.html)
  [](#getTickContext.getTickContext-1)
- #### Parameters

  - ##### tick: number

  #### Returns undefined | [TickContext](TickContext.html)

### getTickContexts[](#getTickContexts)

- getTickContexts(): undefined | [AlignmentContexts](../interfaces/AlignmentContexts.html)<[TickContext](TickContext.html)\>[](#getTickContexts.getTickContexts-1)
- #### Returns undefined | [AlignmentContexts](../interfaces/AlignmentContexts.html)<[TickContext](TickContext.html)\>

### joinVoices[](#joinVoices)

- joinVoices(voices): [Formatter](Formatter.html)
  [](#joinVoices.joinVoices-1)
- #### Parameters

  - ##### voices: [Voice](Voice.html)\[\]

  #### Returns [Formatter](Formatter.html)

### postFormat[](#postFormat)

- postFormat(): [Formatter](Formatter.html)
  [](#postFormat.postFormat-1)
- #### Returns [Formatter](Formatter.html)

### preCalculateMinTotalWidth[](#preCalculateMinTotalWidth)

- preCalculateMinTotalWidth(voices): number[](#preCalculateMinTotalWidth.preCalculateMinTotalWidth-1)
- #### Parameters

  - ##### voices: [Voice](Voice.html)\[\]

  #### Returns number

  the estimated width in pixels

### preFormat[](#preFormat)

- preFormat(justifyWidth?, renderingContext?, voicesParam?, stave?): number[](#preFormat.preFormat-1)
- #### Parameters

  - ##### justifyWidth: number = 0

  - ##### `Optional` renderingContext: [RenderContext](RenderContext.html)

  - ##### `Optional` voicesParam: [Voice](Voice.html)\[\]

  - ##### `Optional` stave: [Stave](Stave.html)

  #### Returns number

### tune[](#tune)

- tune(options?): number[](#tune.tune-1)
- #### Parameters

  - ##### `Optional` options: {

        alpha?: number;
    }

    - ##### `Optional` alpha?: number

  #### Returns number

### `Static` AlignRestsToNotes[](#AlignRestsToNotes)

- AlignRestsToNotes(tickables, alignAllNotes, alignTuplets?): void[](#AlignRestsToNotes.AlignRestsToNotes-1)
- #### Parameters

  - ##### tickables: [Tickable](Tickable.html)\[\]

  - ##### alignAllNotes: boolean

  - ##### `Optional` alignTuplets: boolean

  #### Returns void

### `Static` FormatAndDraw[](#FormatAndDraw)

- FormatAndDraw(ctx, stave, notes, params?): undefined | [BoundingBox](BoundingBox.html)
  [](#FormatAndDraw.FormatAndDraw-1)
- #### Returns undefined | [BoundingBox](BoundingBox.html)

### `Static` FormatAndDrawTab[](#FormatAndDrawTab)

- FormatAndDrawTab(ctx, tabstave, stave, tabnotes, notes, autobeam, params): void[](#FormatAndDrawTab.FormatAndDrawTab-1)
- #### Parameters

  - ##### ctx: [RenderContext](RenderContext.html)

  - ##### tabstave: [TabStave](TabStave.html)

  - ##### stave: [Stave](Stave.html)

  - ##### tabnotes: [TabNote](TabNote.html)\[\]

  - ##### notes: [Tickable](Tickable.html)\[\]

  - ##### autobeam: boolean

  - ##### params: [FormatParams](../interfaces/FormatParams.html)

  #### Returns void

### `Static` SimpleFormat[](#SimpleFormat)

- SimpleFormat(notes, x?, \_\_namedParameters?): void[](#SimpleFormat.SimpleFormat-1)
- #### Parameters

  - ##### notes: [Tickable](Tickable.html)\[\]

  - ##### x: number = 0

  - ##### \_\_namedParameters: {

        paddingBetween: undefined | number;
    } = {}

    - ##### paddingBetween: undefined | number

  #### Returns void

### `Static` getResolutionMultiplier[](#getResolutionMultiplier)

- getResolutionMultiplier(voices): number[](#getResolutionMultiplier.getResolutionMultiplier-1)
- #### Parameters

  - ##### voices: [Voice](Voice.html)\[\]

  #### Returns number

### `Static` plotDebugging[](#plotDebugging)

- plotDebugging(ctx, formatter, xPos, y1, y2, options?): void[](#plotDebugging.plotDebugging-1)
- #### Parameters

  - ##### ctx: [RenderContext](RenderContext.html)

  - ##### formatter: [Formatter](Formatter.html)

  - ##### xPos: number

  - ##### y1: number

  - ##### y2: number

  - ##### `Optional` options: {

        stavePadding: number;
    }

    - ##### stavePadding: number

  #### Returns void
