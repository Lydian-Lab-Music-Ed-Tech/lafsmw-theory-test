"use client";
import { useState, useCallback } from "react";
import {
  HoveredStaffElement,
  UseStaffHoverProps,
  UseStaffHoverReturn,
} from "../types";

export const useStaffHover = ({
  containerRef,
  stavesRef,
  scaleFactor,
}: UseStaffHoverProps): UseStaffHoverReturn => {
  const [hoveredStaffElement, setHoveredStaffElement] =
    useState<HoveredStaffElement | null>(null);

  // Define the extended detection range for VexFlow line numbers from A below the staff to A above the staff. Not sure how we got these numbers. A lesser number in upperBound means more upper ledger lines are detected. A greater number in lowerBound means more lower ledger lines are detected.
  const upperBound = -2.0;
  const lowerBound = 6.0;

  const mouseMoveHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // stavesRef.current seems to be a Stave array with just one element in it: the current stave object
      const staves = stavesRef.current;
      if (
        !containerRef.current ||
        !staves ||
        staves.length === 0 ||
        !staves[0]
      ) {
        if (hoveredStaffElement !== null) setHoveredStaffElement(null);
        return;
      }

      // the current stave object has all the Stave methods we need to calculate the hovered staff element such as getYForLine and getSpacingBetweenLines
      const currentStaveObject = staves[0];
      const rect = containerRef.current.getBoundingClientRect();
      const mouseYInScaledCoords = event.clientY - rect.top;
      const mouseY = mouseYInScaledCoords / scaleFactor; // Unscale the coordinate

      const halfSpacing = currentStaveObject.getSpacingBetweenLines() / 2;
      // topPixelBound is the visually highest Y value (smallest Y pixel value)
      // bottomPixelBound is the visually lowest Y value (largest Y pixel value)
      const topPixelBound =
        currentStaveObject.getYForLine(upperBound) - halfSpacing;
      const bottomPixelBound =
        currentStaveObject.getYForLine(lowerBound) + halfSpacing;

      if (mouseY < topPixelBound || mouseY > bottomPixelBound) {
        if (hoveredStaffElement !== null) setHoveredStaffElement(null);
        return;
      }

      const vexFlowLineNum = currentStaveObject.getLineForY(mouseY);
      const roundedToHalf = Math.round(vexFlowLineNum * 2) / 2;

      let newHoveredElement: HoveredStaffElement | null = null;

      // Check if within the new extended main staff lines/spaces range
      if (roundedToHalf >= upperBound && roundedToHalf <= lowerBound) {
        if (Number.isInteger(roundedToHalf)) {
          const lineIndex = roundedToHalf;
          newHoveredElement = {
            type: "line",
            index: lineIndex,
            y: currentStaveObject.getYForLine(lineIndex),
            height: 2, // Visual height for line highlight (in stave's coordinate system)
          };
        } else {
          const spaceIndex = Math.floor(roundedToHalf);
          newHoveredElement = {
            type: "space",
            index: spaceIndex,
            y: currentStaveObject.getYForLine(spaceIndex),
            height: currentStaveObject.getSpacingBetweenLines(),
          };
        }
      }

      if (
        JSON.stringify(hoveredStaffElement) !==
        JSON.stringify(newHoveredElement)
      ) {
        setHoveredStaffElement(newHoveredElement);
      }
    },
    [containerRef, stavesRef, scaleFactor, hoveredStaffElement] // Include hoveredStaffElement for the comparison
  );

  const mouseLeaveHandler = useCallback(() => {
    setHoveredStaffElement(null);
  }, []);

  return {
    hoveredStaffElement,
    mouseMoveHandler,
    mouseLeaveHandler,
  };
};
