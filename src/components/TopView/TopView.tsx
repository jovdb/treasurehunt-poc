/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { For } from "solid-js";
import { state } from "../../store/store";

import styles from "./TopView.module.css";

export const TopView = () => (
  <svg
    class={styles.TopView_svg}
  >
    <rect x="10" y="20" width="200" height="100" />
    <For each={state.waypoints}>{(waypoint) => (
      <circle cx={waypoint.latitude} cy={waypoint.longitude} r={10} fill="blue" />
    )}</For>
  </svg>
);
