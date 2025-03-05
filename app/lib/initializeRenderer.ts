import * as VexFlow from "vexflow";
const { Renderer } = VexFlow.Flow;

/**
 * Initializes a VexFlow renderer in the provided container
 * @param renderer - Reference to store the created renderer
 * @param container - Container element where the renderer will be created
 */
export const initializeRenderer = (
  renderer: React.MutableRefObject<InstanceType<typeof Renderer> | null>,
  container: React.RefObject<HTMLDivElement | null>
): void => {
  // Only initialize if not already initialized and container exists
  if (!renderer.current && container.current) {
    try {
      console.log("Creating new renderer...");
      
      // First, ensure the container is empty
      if (container.current.querySelector('svg')) {
        console.log("Clearing existing SVG elements");
        container.current.innerHTML = '';
      }
      
      // Create a new renderer with SVG backend
      renderer.current = new Renderer(container.current, Renderer.Backends.SVG);
      console.log("Renderer created successfully");
      
      // Initialize with default size to ensure context is created
      renderer.current.resize(500, 200);
      
      // Test that we can get a context
      const context = renderer.current.getContext();
      if (!context) {
        console.error("Failed to get context from renderer");
        renderer.current = null;
      } else {
        console.log("Context obtained successfully");
      }
    } catch (error) {
      console.error("Error initializing renderer:", error);
      renderer.current = null;
    }
  } else if (renderer.current) {
    console.log("Renderer already initialized, skipping initialization");
  } else {
    console.error("Container not available for renderer initialization");
  }
};
