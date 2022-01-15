/* eslint-disable @typescript-eslint/restrict-template-expressions */

import createResizeObserver from "@solid-primitives/resize-observer";
import { createMemo, createSignal, For } from "solid-js";
import { state } from "../../store/store";
import { Point } from "../../math/Point";
import { Rect } from "../../math/Rect";

import "../../math/features/fitInRect";
import "../../math/features/transformPoint";

import styles from "./TopView.module.css";
import { SignalLogger } from "../SignalLogger/SignalLogger";

export const TopView = () => {
  const [svgRect, setSvgRect] = createSignal(Rect.zero);

  const locationBounds = createMemo(() => Rect.fromPoints(state.waypoints.map((loc) => Point.create(loc.longitude, loc.latitude))));
  const transform = createMemo(() => svgRect().fitRectTransform(locationBounds()));

  const refCallback = createResizeObserver({
    onResize: (size) => setSvgRect(Rect.create(0, 0, size.width, size.height)),
  });

  return (
    <div
      class={styles.TopView}
      ref={refCallback}
    >
      <svg
        class={styles.TopView_svg}
      >
        <For each={state.waypoints}>{(waypoint) => {
          const point = createMemo(() => Point
            .create(waypoint.longitude, waypoint.latitude)
            .transform(transform()));

          return <circle cx={point().left} cy={point().top} r={10} fill="blue" />;
        }}</For>
      </svg>

      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <SignalLogger obj={{ svgRect, locationBounds, transform }} />
      </div>
    </div>
  );
};
