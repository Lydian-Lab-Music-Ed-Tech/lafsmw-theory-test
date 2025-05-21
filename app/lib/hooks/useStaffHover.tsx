"use client";
import { useState, useCallback, RefObject } from 'react';
import { StaveType, HoveredStaffElement, UseStaffHoverProps, UseStaffHoverReturn } from '../types';

export const useStaffHover = ({
  containerRef,
  stavesRef, // Ref to the staves array
  scaleFactor,
}: UseStaffHoverProps): UseStaffHoverReturn => {
  const [hoveredStaffElement, setHoveredStaffElement] = useState<HoveredStaffElement | null>(null);

  // Define the extended detection range for VexFlow line numbers
  // A3 on treble clef is approx. line index -2.0 (2 ledger lines below E4)
  // C6 on treble clef is approx. line index 6.0 (2 ledger lines above F5 top line)
  const MIN_DETECTABLE_VF_LINE_NUM = -2.0;
  const MAX_DETECTABLE_VF_LINE_NUM = 6.0;

  const mouseMoveHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const staves = stavesRef.current; // Get current staves from ref
      if (!containerRef.current || !staves || staves.length === 0 || !staves[0]) {
        if (hoveredStaffElement !== null) setHoveredStaffElement(null);
        return;
      }

      const currentStaveObject = staves[0];
      const rect = containerRef.current.getBoundingClientRect();
      const mouseYInScaledCoords = event.clientY - rect.top;
      const mouseY = mouseYInScaledCoords / scaleFactor; // Unscale the coordinate

      const halfSpacing = currentStaveObject.getSpacingBetweenLines() / 2;
      // Corrected assignments:
      // topPixelBound is the visually highest Y value (smallest Y pixel value)
      // bottomPixelBound is the visually lowest Y value (largest Y pixel value)
      const topPixelBound = currentStaveObject.getYForLine(MIN_DETECTABLE_VF_LINE_NUM) - halfSpacing;
      const bottomPixelBound = currentStaveObject.getYForLine(MAX_DETECTABLE_VF_LINE_NUM) + halfSpacing;

      if (mouseY < topPixelBound || mouseY > bottomPixelBound) {
        if (hoveredStaffElement !== null) setHoveredStaffElement(null);
        return;
      }

      const vexFlowLineNum = currentStaveObject.getLineForY(mouseY);
      const roundedToHalf = Math.round(vexFlowLineNum * 2) / 2;

      let newHoveredElement: HoveredStaffElement | null = null;

      // Check if within the new extended main staff lines/spaces range
      if (roundedToHalf >= MIN_DETECTABLE_VF_LINE_NUM && roundedToHalf <= MAX_DETECTABLE_VF_LINE_NUM) {
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

      if (JSON.stringify(hoveredStaffElement) !== JSON.stringify(newHoveredElement)) {
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
