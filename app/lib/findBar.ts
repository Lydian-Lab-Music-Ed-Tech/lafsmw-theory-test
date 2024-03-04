import VexFlow from "vexflow";
const VF = VexFlow.Flow;
const { Stave } = VF;

import { BarCoordinatesData } from "./typesAndInterfaces";

export const findBarIndex = (
  bars: InstanceType<typeof Stave>[],
  userClickXCoordinate: number
): number => {
  let staveIndex: number = 0;

  const barWidthAndXMaxCoordinate: BarCoordinatesData[] = bars.map(
    (bar, index) => {
      const barWidth = bar.getWidth();
      const xMaxCoordinateForBar1 = bars[0].getWidth();

      let xMaxCoordinate =
        bars.length > 1
          ? xMaxCoordinateForBar1 + bars[1].getWidth() * index
          : xMaxCoordinateForBar1;
      return {
        barWidth,
        xMaxCoordinate,
      };
    }
  );

  for (let i = 0; i < barWidthAndXMaxCoordinate.length; i++) {
    if (userClickXCoordinate < barWidthAndXMaxCoordinate[i].xMaxCoordinate) {
      staveIndex = i;
      break;
    }
  }
  return staveIndex;
};
