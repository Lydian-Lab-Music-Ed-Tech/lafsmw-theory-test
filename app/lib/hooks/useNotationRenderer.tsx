import { RefObject, useCallback, useEffect, useRef } from 'react';
import VexFlow from 'vexflow';
import { initializeRenderer } from '../initializeRenderer';
import { StaveType } from '../types';

type UseNotationRendererProps = {
  containerRef: RefObject<HTMLDivElement>;
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
  const rendererRef = useRef<InstanceType<typeof VexFlow.Flow.Renderer> | null>(null);
  const hasScaled = useRef<boolean>(false);
  const renderFunctionRef = useRef(renderFunction);
  
  // Update the render function ref when it changes
  // This prevents the effect from re-running when the function changes
  useEffect(() => {
    renderFunctionRef.current = renderFunction;
  }, [renderFunction]);
  
  // Initialize the renderer - only depends on containerRef, not the render function
  useEffect(() => {
    if (containerRef.current) {
      initializeRenderer(rendererRef, containerRef);
      // Only call render if we have a renderer
      if (rendererRef.current) {
        // Use the ref to the function, not the function itself
        renderFunctionRef.current();
      }
    }
  }, [containerRef]); // Remove renderFunction dependency

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
  }, [rendererRef]); // Only depend on rendererRef, not renderFunctionRef which is stable

  return {
    rendererRef,
    hasScaled,
    render, // Expose render method for explicit calls after state changes
  };
};
