import React, { MutableRefObject } from "react";

interface ScaleRendererParams {
  container: React.RefObject<HTMLDivElement | null>;
  hasScaled: MutableRefObject<boolean>;
  scale?: number;
  height?: string;
  width?: string;
}

/**
 * Scale the SVG renderer consistently across notation components
 */
export const scaleRenderer = ({
  container,
  hasScaled,
  scale = 1.5,
  height = "300px",
  width = "705px",
}: ScaleRendererParams): void => {
  if (!hasScaled.current && container.current) {
    const svgElement = container.current.querySelector("svg");
    if (svgElement) {
      svgElement.style.transform = `scale(${scale})`;
      svgElement.style.transformOrigin = "0 0";
      container.current.style.height = height;
      container.current.style.width = width;
      hasScaled.current = true;
    }
  }
};
