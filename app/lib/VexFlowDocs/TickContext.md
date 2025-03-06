# TickContext | vexflow

- [vexflow](../modules.html)
- [TickContext](TickContext.html)

## Class TickContext

#### Hierarchy

- TickContext

##### Index

## Constructors

### constructor[](#constructor)

- new TickContext(options?): [TickContext](TickContext.html)
  [](#constructor.new_TickContext)
- #### Returns [TickContext](TickContext.html)

## Properties

### tContexts[](#tContexts)

## Methods

### addTickable[](#addTickable)

- addTickable(tickable, voiceIndex?): [TickContext](TickContext.html)
  [](#addTickable.addTickable-1)
- #### Parameters

  - ##### tickable: [Tickable](Tickable.html)

  - ##### `Optional` voiceIndex: number

  #### Returns [TickContext](TickContext.html)

### getCenterAlignedTickables[](#getCenterAlignedTickables)

- getCenterAlignedTickables(): [Tickable](Tickable.html)\[\][](#getCenterAlignedTickables.getCenterAlignedTickables-1)
- #### Returns [Tickable](Tickable.html)\[\]

### getCurrentTick[](#getCurrentTick)

- getCurrentTick(): [Fraction](Fraction.html)
  [](#getCurrentTick.getCurrentTick-1)
- #### Returns [Fraction](Fraction.html)

### getFormatterMetrics[](#getFormatterMetrics)

- getFormatterMetrics(): {
      freedom: {
          left: number;
          right: number;
      };
  }[](#getFormatterMetrics.getFormatterMetrics-1)
- #### Returns {

      freedom: {
          left: number;
          right: number;
      };
  }

  - ##### freedom: {

        left: number;
        right: number;
    }

    - ##### left: number

    - ##### right: number

### getMaxTickable[](#getMaxTickable)

- getMaxTickable(): undefined | [Tickable](Tickable.html)
  [](#getMaxTickable.getMaxTickable-1)
- #### Returns undefined | [Tickable](Tickable.html)

### getMaxTicks[](#getMaxTicks)

- getMaxTicks(): [Fraction](Fraction.html)
  [](#getMaxTicks.getMaxTicks-1)
- #### Returns [Fraction](Fraction.html)

### getMetrics[](#getMetrics)

- getMetrics(): [TickContextMetrics](../interfaces/TickContextMetrics.html)
  [](#getMetrics.getMetrics-1)
- #### Returns [TickContextMetrics](../interfaces/TickContextMetrics.html)

### getMinTickable[](#getMinTickable)

- getMinTickable(): undefined | [Tickable](Tickable.html)
  [](#getMinTickable.getMinTickable-1)
- #### Returns undefined | [Tickable](Tickable.html)

### getMinTicks[](#getMinTicks)

- getMinTicks(): undefined | [Fraction](Fraction.html)
  [](#getMinTicks.getMinTicks-1)
- #### Returns undefined | [Fraction](Fraction.html)

### getTickID[](#getTickID)

- getTickID(): number[](#getTickID.getTickID-1)
- #### Returns number

### getTickableForVoice[](#getTickableForVoice)

- getTickableForVoice(voiceIndex): [Tickable](Tickable.html)
  [](#getTickableForVoice.getTickableForVoice-1)
- #### Parameters

  - ##### voiceIndex: number

  #### Returns [Tickable](Tickable.html)

### getTickables[](#getTickables)

- getTickables(): [Tickable](Tickable.html)\[\][](#getTickables.getTickables-1)
- #### Returns [Tickable](Tickable.html)\[\]

### getTickablesByVoice[](#getTickablesByVoice)

- getTickablesByVoice(): Record<string, [Tickable](Tickable.html)\>[](#getTickablesByVoice.getTickablesByVoice-1)
- #### Returns Record<string, [Tickable](Tickable.html)\>

### getWidth[](#getWidth)

- getWidth(): number[](#getWidth.getWidth-1)
- #### Returns number

### getX[](#getX)

- getX(): number[](#getX.getX-1)
- #### Returns number

### getXBase[](#getXBase)

- getXBase(): number[](#getXBase.getXBase-1)
- #### Returns number

### getXOffset[](#getXOffset)

- getXOffset(): number[](#getXOffset.getXOffset-1)
- #### Returns number

### postFormat[](#postFormat)

- postFormat(): [TickContext](TickContext.html)
  [](#postFormat.postFormat-1)
- #### Returns [TickContext](TickContext.html)

### preFormat[](#preFormat)

- preFormat(): [TickContext](TickContext.html)
  [](#preFormat.preFormat-1)
- #### Returns [TickContext](TickContext.html)

### setCurrentTick[](#setCurrentTick)

- setCurrentTick(tick): void[](#setCurrentTick.setCurrentTick-1)
- #### Returns void

### setPadding[](#setPadding)

- setPadding(padding): [TickContext](TickContext.html)
  [](#setPadding.setPadding-1)
- #### Parameters

  - ##### padding: number

  #### Returns [TickContext](TickContext.html)

### setX[](#setX)

- setX(x): [TickContext](TickContext.html)
  [](#setX.setX-1)
- #### Parameters

  - ##### x: number

  #### Returns [TickContext](TickContext.html)

### setXBase[](#setXBase)

- setXBase(xBase): void[](#setXBase.setXBase-1)
- #### Parameters

  - ##### xBase: number

  #### Returns void

### setXOffset[](#setXOffset)

- setXOffset(xOffset): void[](#setXOffset.setXOffset-1)
- #### Parameters

  - ##### xOffset: number

  #### Returns void

### `Static` getNextContext[](#getNextContext)

- getNextContext(tContext): undefined | [TickContext](TickContext.html)
  [](#getNextContext.getNextContext-1)
- #### Returns undefined | [TickContext](TickContext.html)
