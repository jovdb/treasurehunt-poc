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
  const [throttledX, throttledY] = throttleSignals([dragX, dragY], 200);

  // Animate to the new location
  const [x] = createSpringValue(throttledX, { mass: 10 });
  const [y] = createSpringValue(throttledY, { mass: 10 });

  return (
    <div class={styles.App}>
      <svg class={styles.App_svg}>
        <circle cx={dragX()} cy={dragY()} r={5} fill="rgba(0,128,0,0.2)" />
        <circle cx={throttledX()} cy={throttledY()} r={5} fill="rgba(0,0,255,0.2)" />
        <circle cx={x()} cy={y()} r={5} fill="rgba(255,0,0,0.4)" />
      </svg>
    </div>
  );
};

export default App;
