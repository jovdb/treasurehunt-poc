import { Accessor, createMemo } from "solid-js";
import { throttleSignals } from "../utils/signal-helpers";
import { createMousePosition } from "./createMousePosition";

export function createGeoSimulation() {
  const [mouseX, mouseY, buttons] = createMousePosition();

  // Only use mouse cooredinates while mouse down
  const dragX = createMemo<number>((prev) => (buttons() === 1 ? mouseX() : prev || 0));
  const dragY = createMemo<number>((prev) => (buttons() === 1 ? mouseY() : prev || 0));

  // Throttle position to simulate geo coordinates
  return throttleSignals([dragX, dragY], 200) as [Accessor<number>, Accessor<number>];
}
