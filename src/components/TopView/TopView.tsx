/* eslint-disable @typescript-eslint/restrict-template-expressions */

import createResizeObserver from "@solid-primitives/resize-observer";
import { For } from "solid-js";
import { state } from "../../store/store";

import styles from "./TopView.module.css";

export const TopView = () => {
  const refCallback = createResizeObserver({ onResize: (size) => console.log("SVG resized", size) });

  return (
    <div
      class={styles.TopView}
      ref={refCallback}
    >
      <svg
        class={styles.TopView_svg}
      >
        <For each={state.waypoints}>{(waypoint) => (
          <circle cx={waypoint.latitude} cy={waypoint.longitude} r={10} fill="blue" />
        )}</For>
      </svg>
    </div>
  );
};
