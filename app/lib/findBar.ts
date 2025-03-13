import VexFlow from "vexflow";
import { BarMetrics } from "./types";

const VF = VexFlow.Flow;
const { Stave } = VF;

export const findBarIndex = (
  bars: InstanceType<typeof Stave>[],
  userClickX: number
): number => {
  let staveIndex: number = 0;

  const barMetrics: BarMetrics[] = bars.map((bar, index) => {
    const barWidth = bar.getWidth();
    const firstBarMaxX = bars[0].getWidth();

    let currentBarMaxX =
      bars.length > 1
        ? firstBarMaxX + bars[1].getWidth() * index
        : firstBarMaxX;
    return {
      barWidth,
      xMaxCoordinate: currentBarMaxX,
    };
  });

  for (let barIndex = 0; barIndex < barMetrics.length; barIndex++) {
    if (userClickX < barMetrics[barIndex].xMaxCoordinate) {
      staveIndex = barIndex;
      break;
    }
  }
  return staveIndex;
};
