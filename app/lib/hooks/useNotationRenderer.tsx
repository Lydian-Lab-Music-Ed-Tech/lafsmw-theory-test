import { RefObject, useCallback, useEffect, useRef } from "react";
import { Flow } from "vexflow";
import { initializeRenderer } from "../initializeRenderer";
import { StaveType } from "../types";

const { Renderer } = Flow;

type FlexibleDivRef = { current: HTMLDivElement | null };

type UseNotationRendererProps = {
  containerRef: FlexibleDivRef;
  renderFunction: () => StaveType[] | undefined;
  scaleFactor?: number;
  width?: number;
  height?: number;
};

/**
 * A custom hook for handling VexFlow notation rendering
 *
 * This hook follows the pattern described in our circular dependency solution
 * where the render function is stored in a ref and not a direct dependency.
 */
export const useNotationRenderer = ({
  containerRef,
  renderFunction,
  scaleFactor = 1.5,
  width = 470,
  height = 200,
}: UseNotationRendererProps) => {
  // Define the renderer ref with proper type
  const rendererRef = useRef<InstanceType<typeof Renderer> | null>(null);
  const hasScaled = useRef(false);
  const renderFunctionRef = useRef(renderFunction);

  // Update the render function ref when it changes
  useEffect(() => {
    renderFunctionRef.current = renderFunction;
  }, [renderFunction]);

  // Initialize the renderer - only depends on containerRef, not the render function
  useEffect(() => {
    if (containerRef.current) {
      // Pass directly to initializeRenderer which now accepts FlexibleDivRef
      initializeRenderer(
        rendererRef as RefObject<InstanceType<typeof Renderer> | null>,
        containerRef
      );

      // Only call render if we have a renderer
      if (rendererRef.current) {
        renderFunctionRef.current();
      }
    }
  }, [containerRef]);

  // Apply scaling to the SVG
  useEffect(() => {
    if (!hasScaled.current && containerRef.current) {
      const svgElement = containerRef.current.querySelector("svg");
      if (svgElement) {
        svgElement.style.transform = `scale(${scaleFactor})`;
        svgElement.style.transformOrigin = "0 0";

        // Adjust container size to accommodate scaled SVG
        containerRef.current.style.height = `${height * scaleFactor}px`;
        containerRef.current.style.width = `${width * scaleFactor}px`;
        hasScaled.current = true;
      }
    }
  }, [containerRef, scaleFactor, width, height]);

  // Provide a stable function to re-render explicitly when needed
  const render = useCallback(() => {
    if (rendererRef.current && renderFunctionRef.current) {
      return renderFunctionRef.current();
    }
    return undefined;
  }, [rendererRef]);

  return {
    rendererRef,
    hasScaled,
    render,
  };
};
