import * as VexFlow from "vexflow";

const { Renderer } = VexFlow.Flow;

// More flexible type that accepts any ref with a current property
// This avoids type issues with React 19's ref implementation
type FlexibleDivRef = { current: HTMLDivElement | null };

/**
 * Initializes a VexFlow renderer on the provided container element
 *
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
