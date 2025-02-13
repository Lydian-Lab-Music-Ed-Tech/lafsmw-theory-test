import React from "react";
import { StaveType } from "../lib/typesAndInterfaces";

const getUserClickInfo = (
  e: React.MouseEvent,
  container: React.RefObject<HTMLDivElement>,
  stave: StaveType
): any => {
  const rect = container && container.current?.getBoundingClientRect();
  const scale = 1.2;
  // Divide by scale since we need to map the click to the original coordinate space
  const userClickY = rect ? parseFloat(((e.clientY - rect.top) / scale).toFixed(0)) : 0;
  const userClickX = rect ? parseFloat(((e.clientX - rect.left) / scale).toFixed(0)) : 0;
  const topStaveYCoord = stave && stave.getYForTopText();
  const bottomStaveYCoord = (stave && stave.getYForBottomText()) || undefined;

  console.log(`The maximum right click coordinate is 270, and the user click was
 ${userClickX}. The minimum left click is 36 and the user clicked ${userClickX}. The 
 minimum top click is 40 and the user clicked ${userClickY}. The maximum bottom
 click is 100 and user clicked ${userClickY}.`);
  console.log("topStaveYCoord: ", topStaveYCoord);
  console.log("bottomStaveYCoord: ", bottomStaveYCoord);

  return {
    rect,
    userClickY: Number(userClickY),  // Convert back to number since we used toFixed
    userClickX: Number(userClickX),  // Convert back to number since we used toFixed
    topStaveYCoord,
    bottomStaveYCoord,
  };
};

export default getUserClickInfo;
