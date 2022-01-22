/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import createResizeObserver from "@solid-primitives/resize-observer";
import {
  Accessor, createMemo, createSignal, For,
} from "solid-js";
import { getDistanceFromLine } from "geolib";

import {
  getUncapturedWaypoints,
  isCaptured, setCaptured, setMyInfo, state,
} from "../../store/store";
import { Point } from "../../math/Point";
import { Rect } from "../../math/Rect";

import "../../math/features/fitInRect";
import "../../math/features/transformPoint";

import { SignalLogger } from "../SignalLogger/SignalLogger";
import { createSpringValue, ISpringOptions } from "../../hooks/createSpring";
import { MyWayPoint } from "../MyLocation/MyLocation";
import { CoinWaypoint } from "../CoinWaypoint/CoinWaypoint";

import styles from "./TopView.module.css";
import { GeoLocationError } from "../GeoLocationError";
import { createLocationWatcher } from "../../hooks/createLocationWatcher";

const springSettings: ISpringOptions = {
};

function createLastValues<T>(accessor: Accessor<T>, length = 10) {
  return createMemo<T[]>((prev) => ([...prev, accessor()].slice(-length)), []);
}

function createCatcheDetector() {
  const location = createMemo(() => state.me?.location);
  const previousValues = createLastValues(location, 2);
  createMemo(() => {
    const prev = previousValues()[0];
    const current = location();
    if (!prev || !current) return;
    const captureDistanceInMeter = 10;

    const captured = state.waypoints
      .filter((waypoint) => !isCaptured(waypoint.id))
      .filter((waypoint) => getDistanceFromLine(waypoint, prev, current) <= captureDistanceInMeter);

    captured.forEach((waypoint) => {
      setCaptured(waypoint.id);
    });
  });
}

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

  // Set Location
  createLocationWatcher(locationsToScreenTransform);

  createCatcheDetector();

  // Convert location to screen coordinates
  const myLocationOnScreen = createMemo(() => {
    const mylocation = state.me?.location;
    return Point
      .create(mylocation?.longitude || 0, mylocation?.latitude || 0)
      .transform(locationsToScreenTransform());
  });

  // Animate to new values
  const myX = createMemo(() => myLocationOnScreen().left);
  const myY = createMemo(() => myLocationOnScreen().top);
  const [mySmoothX] = createSpringValue(myX, springSettings);
  const [mySmoothY] = createSpringValue(myY, springSettings);

  setMyInfo("male");

  return (
    <div
      class={styles.TopView}
      ref={refCallback}
    >
      <GeoLocationError code={state.me?.locationError?.code || 0} >
        <svg
          class={styles.TopView_svg}
        >
          <For each={getUncapturedWaypoints()}>{(waypoint) => {
            const point = createMemo(() => Point
              .create(waypoint.longitude, waypoint.latitude)
              .transform(locationsToScreenTransform()));

            return <CoinWaypoint x={point().left} y={point().top} />;
          }}</For>

          <MyWayPoint gender={state.me?.gender ?? "male"} x={mySmoothX()} y={mySmoothY()} />
        </svg>
      </GeoLocationError>

      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <SignalLogger obj={{
          svgRect,
          locationBounds,
          locationsToScreenTransform,
          myX,
          mySmoothX,
        }} />
      </div>
    </div>
  );
};
