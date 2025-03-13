import { Flow } from "vexflow";
import { FlexibleDivRef } from "./types";

const { Renderer } = Flow;

/**
 * Initializes a VexFlow renderer on the provided container element
 * Updated to work with React 19's ref system
 */
export const initializeRenderer = (
  renderer: React.RefObject<InstanceType<typeof Renderer> | null>,
  container: FlexibleDivRef
): void => {
  if (!renderer.current && container.current) {
    renderer.current = new Renderer(container.current, Renderer.Backends.SVG);
  }
};
