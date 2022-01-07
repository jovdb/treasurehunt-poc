import { Component, createMemo } from "solid-js";
import { createMousePosition } from "./hooks/createMousePosition";

import styles from "./App.module.css";
import { throttleSignals } from "./utils/signal-helpers";
import { createTween } from "./hooks/createTween";

const App: Component = () => {
  const [mouseX, mouseY, buttons] = createMousePosition();

  // Only use mouse cooredinates while mouse down
  const dragX = createMemo<number>((prev) => (buttons() === 1 ? mouseX() : prev || 0));
  const dragY = createMemo<number>((prev) => (buttons() === 1 ? mouseY() : prev || 0));

  // Throttle position to simulate geo coordinates
  const [x, y] = throttleSignals([dragX, dragY], 400);

  // Animate to the new location
  const x1 = createTween(x, { duration: 2000 });
  const y1 = createTween(y, { duration: 2000 });

  return (
    <div class={styles.App}>
      <svg class={styles.App_svg}>
        <circle cx={x1()} cy={y1()} r={5} fill="red" />
      </svg>
      2
    </div>
  );
};

export default App;
