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
import { createGeoSimulation } from "../../hooks/createGeoSimulation";
import { Waypoints } from "../../types/WayPoint";
import { WaypointId } from "../../types/WayPointId";
import { createSpringValue } from "../../hooks/createSpring";

export const TopView = () => {
  const [svgRect, setSvgRect] = createSignal(Rect.zero);
  const viewRect = createMemo(() => svgRect().grow(-20));

  const locationBounds = createMemo(() => Rect.fromPoints(state.waypoints.map((loc) => Point.create(loc.longitude, loc.latitude))));
  const locationsToScreenTransform = createMemo(() => viewRect().fitRectTransform(locationBounds()));

  // Simulate GPS location
  const [myX, myY] = createGeoSimulation();
  const myLocation = createMemo(() => Point
    .create(myX(), myY())
    .transform(locationsToScreenTransform().inverse())
    .toTuple());

  // Animate to new position
  const myLon = createMemo(() => myLocation()[0] || 0);
  const myLat = createMemo(() => myLocation()[1] || 0);
  const [smoothLon] = createSpringValue(myLon);
  const [smoothLat] = createSpringValue(myLat);

  const refCallback = createResizeObserver({
    onResize: (size) => setSvgRect(Rect.create(0, 0, size.width, size.height)),
  });

  const myWaypoint = createMemo<Waypoints>(() => ({
    id: WaypointId.fromString("me"),
    type: "test",
    longitude: smoothLon(),
    latitude: smoothLat(),
  }));

  return (
    <div
      class={styles.TopView}
      ref={refCallback}
    >
      <svg
        class={styles.TopView_svg}
      >
        <For each={[...state.waypoints, myWaypoint()]}>{(waypoint) => {
          const point = createMemo(() => Point
            .create(waypoint.longitude, waypoint.latitude)
            .transform(locationsToScreenTransform()));

          return <circle cx={point().left} cy={point().top} r={10} fill="blue" />;
        }}</For>
      </svg>

      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <SignalLogger obj={{
          svgRect,
          locationBounds,
          locationsToScreenTransform,
          myX,
          myLon,
          smoothLon,
          myWaypoint: createMemo(() => JSON.stringify(myWaypoint())),
        }} />
      </div>
    </div>
  );
};
