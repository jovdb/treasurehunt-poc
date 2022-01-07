import type { Component } from "solid-js";
import { useMousePosition } from "./hooks/useMousePosition";

import styles from "./App.module.css";

const App: Component = () => {
  const [x, y] = useMousePosition();

  return (
    <div class={styles.App}>
      Position: {x()}, {y()}
    </div>
  );
};

export default App;
