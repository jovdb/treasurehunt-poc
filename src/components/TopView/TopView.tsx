/* eslint-disable @typescript-eslint/restrict-template-expressions */

import createResizeObserver from "@solid-primitives/resize-observer";
import { createGeolocationWatcher } from "@solid-primitives/geolocation";
import {
  Accessor,
  createMemo, createSignal, For,
} from "solid-js";

import { state } from "../../store/store";
import { Point } from "../../math/Point";
import { Rect } from "../../math/Rect";

import "../../math/features/fitInRect";
import "../../math/features/transformPoint";

import { SignalLogger } from "../SignalLogger/SignalLogger";
import { createDragCoordinates } from "../../hooks/createDragCoordinates";
import { createSpringValue, ISpringOptions } from "../../hooks/createSpring";
import { MyWayPoint } from "../MyLocation/MyLocation";
import { CoinWaypoint } from "../CoinWaypoint/CoinWaypoint";

import styles from "./TopView.module.css";
import { GeoLocationError } from "../GeoLocationError";
import { throttleSignals } from "../../utils/signal-helpers";

const springSettings: ISpringOptions = {
};

export const TopView = () => {
  // Size of svg
  const [svgRect, setSvgRect] = createSignal(Rect.zero);
  const refCallback = createResizeObserver({
    onResize: (size) => setSvgRect(Rect.create(0, 0, size.width, size.height)),
  });

  const viewRect = createMemo(() => svgRect().grow(-20));

  const locationBounds = createMemo(() => Rect
    .fromPoints(state.waypoints.map((loc) => Point.create(loc.longitude, loc.latitude))));
  const locationsToScreenTransform = createMemo(() => viewRect().fitRectTransform(locationBounds()));

  const [location, error] = createGeolocationWatcher(true);

  // Get Geo position from Drag
  const [dragX, dragY] = createDragCoordinates();
  // Throttle position to simulate geo coordinates intervals
  const [throttledX, throttledY] = throttleSignals([dragX, dragY], 200) as [Accessor<number>, Accessor<number>];
  // Convert to Geo locations
  const simulatedLocation = createMemo(() => Point
    .create(throttledX(), throttledY())
    .transform(locationsToScreenTransform().inverse()));

  // Location to use (simulated or real geo location)
  const [myLon, setMyLon] = createSignal(0);
  const [myLat, setMyLat] = createSignal(0);

  // Get screen location from GPS location
  createMemo(() => {
    setMyLon(location()?.longitude || 0);
    setMyLat(location()?.latitude || 0);
  });

  // When dragging, use it as target position
  createMemo(() => {
    setMyLon(simulatedLocation().left || 0);
    setMyLat(simulatedLocation().top || 0);
  });

  // Convert location to screen coordinates
  const myLocationOnScreen = createMemo(() => Point
    .create(myLon() || 0, myLat() || 0)
    .transform(locationsToScreenTransform()));
  const myX = createMemo(() => myLocationOnScreen().left);
  const myY = createMemo(() => myLocationOnScreen().top);

  // Animate to new values
  const [mySmoothX] = createSpringValue(myX, springSettings);
  const [mySmoothY] = createSpringValue(myY, springSettings);

  return (
    <div
      class={styles.TopView}
      ref={refCallback}
    >
      <GeoLocationError code={error()?.code || 0} >
        <svg
          class={styles.TopView_svg}
        >
          <For each={[...state.waypoints]}>{(waypoint) => {
            const point = createMemo(() => Point
              .create(waypoint.longitude, waypoint.latitude)
              .transform(locationsToScreenTransform()));

            return <CoinWaypoint x={point().left} y={point().top} />;
          }}</For>

          <MyWayPoint gender="male" x={mySmoothX()} y={mySmoothY()} />
        </svg>
      </GeoLocationError>

      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <SignalLogger obj={{
          svgRect,
          locationBounds,
          locationsToScreenTransform,
          dragX,
          simulatedLocation,
          location: createMemo(() => location()?.longitude),
          myLon,
          myX,
          mySmoothX,
        }} />
      </div>
    </div>
  );
};
