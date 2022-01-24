/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import createResizeObserver from "@solid-primitives/resize-observer";
import {
  createMemo, createSignal, For, Show,
} from "solid-js";
import { getDistance } from "geolib";

import {
  isCaptured, setMyInfo, state,
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
import { createCatcheDetector } from "../../hooks/createCatchDetector";
import { Grid } from "../Grid/Grid";
import { Vector } from "../../math/Vector";
import { Transform } from "../../math/Transform";

const springSettings: ISpringOptions = {
};

export const TopView = () => {
  // Size of svg
  const [svgRect, setSvgRect] = createSignal(Rect.zero);
  const refCallback = createResizeObserver({
    onResize: (size) => setSvgRect(Rect.create(0, 0, size.width, size.height)),
  });

  // Temp: randomly scale field
  const [m, setM] = createSignal(-20);
  createMemo(() => {
    setInterval(() => setM(Math.random() * -350), 500);
  });
  const viewRect = createMemo(() => svgRect().grow(m()));

  const locationBounds = createMemo(() => Rect
    .fromPoints(state.waypoints.map((loc) => Point.create(loc.longitude, loc.latitude))));

  const location2MetersScale = createMemo(() => {
    const distance = 0.5;
    const center = locationBounds().getCenter();
    const lngToMeter = getDistance({ longitude: center.left - distance, latitude: center.top }, { longitude: center.left + distance, latitude: center.top });
    const latToMeter = getDistance({ longitude: center.left, latitude: center.top - distance }, { longitude: center.left, latitude: center.top + distance });

    return Vector.create(lngToMeter, latToMeter);
  });

  const locationsToScreenTransform = createMemo(() => {
    const locationTransform = Transform
      .scale(1, location2MetersScale().width / location2MetersScale().height) // Coordinates are on a sphere, make square
      .scale(1, -1); // Reverse direction of latitude because northem hemisphere

    const targetRect = locationBounds()
      .transform(locationTransform.inverse()) // Scale waypoints
      .normalize();

    return locationTransform
      .inverse()
      .multiply(
        viewRect().fitRectTransform(targetRect),
      );
  });

  // Calcultate Grid
  const gridSizeInMeters = 10;
  const gridRect = createMemo(() => Rect
    .create(state.waypoints[0].longitude, state.waypoints[0].latitude, gridSizeInMeters / location2MetersScale().width, gridSizeInMeters / location2MetersScale().height)
    .transform(locationsToScreenTransform())
    .normalize());

  // Animate Grid
  const [gridX] = createSpringValue(createMemo(() => gridRect().left), springSettings);
  const [gridY] = createSpringValue(createMemo(() => gridRect().top), springSettings);
  const [gridWidth] = createSpringValue(createMemo(() => gridRect().width), springSettings);
  const [gridHeight] = createSpringValue(createMemo(() => gridRect().height), springSettings);

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

  // Animate my location
  const myX = createMemo(() => myLocationOnScreen().left);
  const myY = createMemo(() => myLocationOnScreen().top);
  const [mySmoothX] = createSpringValue(myX, springSettings);
  const [mySmoothY] = createSpringValue(myY, springSettings);

  setMyInfo("male");

  const magnetSpringSettings = { stiffness: 10, mass: 10, damping: 10 };

  return (
    <div
      class={styles.TopView}
      ref={refCallback}
    >
      <GeoLocationError code={state.me?.locationError?.code || 0} >
        <svg
          class={styles.TopView_svg}
        >
          <Grid x={gridX()} y={gridY()} width={gridWidth()} height={gridHeight()} />
          <For each={state.waypoints}>{(waypoint) => {
            const point = createMemo(() => {
              // When captured, fly to me (like a magnet)
              const lon = !isCaptured(waypoint.id) ? waypoint.longitude : state.me?.location?.longitude ?? waypoint.longitude;
              const lat = !isCaptured(waypoint.id) ? waypoint.latitude : state.me?.location?.latitude ?? waypoint.latitude;
              return Point
                .create(lon, lat)
                .transform(locationsToScreenTransform());
            });

            // When captured, fade out and fly to me
            const [opacity] = createSpringValue(createMemo(() => (isCaptured(waypoint.id) ? 0 : 1), magnetSpringSettings));
            const [x] = createSpringValue(createMemo(() => point().left, magnetSpringSettings));
            const [y] = createSpringValue(createMemo(() => point().top, magnetSpringSettings));

            return (
              <Show when={opacity() > 0}>
                <CoinWaypoint x={x()} y={y()} opacity={opacity()}/>;
              </Show>
            );
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
