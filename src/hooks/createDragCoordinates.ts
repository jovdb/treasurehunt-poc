import { createMemo } from "solid-js";
import { createMousePosition } from "./createMousePosition";

export function createDragCoordinates() {
  const [mouseX, mouseY, buttons] = createMousePosition();

  // Only use mouse cooredinates while mouse down
  const isDragging = createMemo(() => (buttons() === 1));
  const dragX = createMemo<number>((prev) => (buttons() === 1 ? mouseX() : prev || 0));
  const dragY = createMemo<number>((prev) => (buttons() === 1 ? mouseY() : prev || 0));

  return [dragX, dragY, isDragging];
}
