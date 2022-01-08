/* eslint-disable no-debugger */
import {
  Component, createMemo, createSignal, For,
} from "solid-js";

import { createMousePosition } from "./hooks/createMousePosition";
import { throttleSignals } from "./utils/signal-helpers";
import { createSpringValue } from "./hooks/createSpring";

import styles from "./App.module.css";
import { SignalLogger } from "./components/SignalLogger/SignalLogger";
import { state } from "./store/store";

const App: Component = () => {
  const [mouseX, mouseY, buttons] = createMousePosition();

  // Only use mouse cooredinates while mouse down
  const isMouseDown = createMemo(() => (buttons() === 1));
  const dragX = createMemo<number>((prev) => (isMouseDown() ? mouseX() : prev || 0));
  const dragY = createMemo<number>((prev) => (isMouseDown() ? mouseY() : prev || 0));
  // Throttle position to simulate geo coordinates
  const [throttledX, throttledY] = throttleSignals([dragX, dragY], 200);

  // Animate to the new location
  const [x] = createSpringValue(throttledX, { mass: 10 });
  const [y] = createSpringValue(throttledY, { mass: 10 });

  const [showCircles, setShowCircles] = createSignal(true);
  const opacityState = createMemo(() => (showCircles() ? 1 : 0));
  const [opacitySpringValue, opacityIsBusy] = createSpringValue(opacityState, { mass: 10 });

  return (
    <div class={styles.App}>
      {
        (opacitySpringValue() > 0) && (
          <svg class={styles.App_svg} style={{ opacity: opacitySpringValue() }}>
            <circle cx={dragX()} cy={dragY()} r={5} fill="rgba(0,128,0,0.2)" />
            <circle cx={throttledX()} cy={throttledY()} r={5} fill="rgba(0,0,255,0.2)" />
            <circle cx={x()} cy={y()} r={5} fill="rgba(255,0,0,0.4)" />
            <For each={state.waypoints}>{(waypoint) => (
              <circle cx={waypoint.latitude} cy={waypoint.longitude} r={10} fill="blue" />
            )}</For>
          </svg>
        )
      }
      <button
        onClick={() => {
          setShowCircles((p) => !p);
        }}
      >
        {showCircles() ? "Hide" : "Show"}
      </button>

      <SignalLogger
        obj={{
          showCircles, opacityState, opacitySpringValue, opacityIsBusy,
        }}
      />
    </div>
  );
};

export default App;
