import type { Component } from "solid-js";
import { useMousePosition } from "./hooks/useMousePosition";

import styles from "./App.module.css";
import { throttleSignals } from "./utils/signal-helpers";

const App: Component = () => {
  const [x1, y1] = useMousePosition();
  const [x, y] = throttleSignals([x1, y1], 400);

  return (
    <div class={styles.App}>
      <svg class={styles.App_svg}>
        <circle cx={x()} cy={y()} r={3} fill="red" />
      </svg>
    </div>
  );
};

export default App;
