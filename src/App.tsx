import { Component, createMemo } from "solid-js";
import { createMousePosition } from "./hooks/createMousePosition";

import styles from "./App.module.css";
import { throttleSignals } from "./utils/signal-helpers";
import { createSpringValue } from "./hooks/createSpring";

const App: Component = () => {
  const [mouseX, mouseY, buttons] = createMousePosition();

  // Only use mouse cooredinates while mouse down
  const dragX = createMemo<number>((prev) => (buttons() === 1 ? mouseX() : prev || 0));
  const dragY = createMemo<number>((prev) => (buttons() === 1 ? mouseY() : prev || 0));

  // Throttle position to simulate geo coordinates
  const [throttledX, throttledY] = throttleSignals([dragX, dragY], 400);

  // Animate to the new location
  const [x] = createSpringValue(throttledX);
  const [y] = createSpringValue(throttledY);

  return (
    <div class={styles.App}>
      <svg class={styles.App_svg}>
        <circle cx={x()} cy={y()} r={5} fill="red" />
      </svg>
    </div>
  );
};

export default App;
