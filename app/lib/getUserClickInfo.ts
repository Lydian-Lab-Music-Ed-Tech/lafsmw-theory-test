import React from "react";
import { StaveType } from "../lib/typesAndInterfaces";

const getUserClickInfo = (
  e: React.MouseEvent,
  container: React.RefObject<HTMLDivElement>,
  stave: StaveType
): any => {
  const rect = container && container.current?.getBoundingClientRect();
  const scale = 1.5;
  // Divide by scale since we need to map the click to the original coordinate space
  const userClickY = rect
    ? parseFloat(((e.clientY - rect.top) / scale).toFixed(0))
    : 0;
  const userClickX = rect
    ? parseFloat(((e.clientX - rect.left) / scale).toFixed(0))
    : 0;
  const topStaveYCoord = stave && stave.getYForTopText();
  const bottomStaveYCoord = (stave && stave.getYForBottomText()) || undefined;

  return {
    rect,
    userClickY: Number(userClickY), // Convert back to number since we used toFixed
    userClickX: Number(userClickX),
    topStaveYCoord,
    bottomStaveYCoord,
  };
};

export default getUserClickInfo;
