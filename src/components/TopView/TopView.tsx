/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import createResizeObserver from "@solid-primitives/resize-observer";
import {
  createMemo, createSignal, For, Show,
} from "solid-js";
import { getDistance } from "geolib";

import {
  isCaptured, setMagnetDistance, setMyInfo, state,
} from "../../store/store";
import { Point } from "../../math/Point";
import { Rect } from "../../math/Rect";

import "../../math/features/fitInRect";
import "../../math/features/transformPoint";
import "../../math/features/transformVector";

import { SignalLogger } from "../SignalLogger/SignalLogger";
import { createSpring, ISpringBehavior } from "../../hooks/createSpring";
import { MyWayPoint } from "../MyLocation/MyLocation";
import { CoinWaypoint } from "../CoinWaypoint/CoinWaypoint";

import styles from "./TopView.module.css";
import { GeoLocationError } from "../GeoLocationError";
import { createLocationWatcher } from "../../hooks/createLocationWatcher";
import { createCatcheDetector } from "../../hooks/createCatchDetector";
import { Grid } from "../Grid/Grid";
import { Vector } from "../../math/Vector";
import { Transform } from "../../math/Transform";
import { MagnetCircle } from "../MagnetCircle/MagnetCircle";

const springSettings: ISpringBehavior = {};
const magnetSpringSettings: ISpringBehavior = {};

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
  const [smoothGrid] = createSpring(gridRect, springSettings);

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
  const [mySmoothPosition] = createSpring(myLocationOnScreen, springSettings);

  // Magnet
  const magnetScreenSize = createMemo(() => {
    const radiusInMeter = state.me?.magnetDistanceInMeter ?? 10;
    const meterToScreen = Transform
      .identity
      .scaleByVector(location2MetersScale()) // Location to meter
      .inverse() // Meter to location
      .multiply(locationsToScreenTransform()); // Meter to screen

    const vector = Vector
      .create(radiusInMeter, radiusInMeter)
      .transform(meterToScreen);
    return Vector.create(Math.abs(vector.width), Math.abs(vector.height));
  });
  const [smoothMagnetSize] = createSpring(magnetScreenSize, springSettings);

  setMyInfo("male");
  setMagnetDistance(10);

  return (
    <div
      class={styles.TopView}
      ref={refCallback}
    >
      <GeoLocationError code={state.me?.locationError?.code || 0} >
        <svg
          class={styles.TopView_svg}
        >
          <Grid x={smoothGrid().left} y={smoothGrid().top} width={smoothGrid().width} height={smoothGrid().height} />
          <For each={state.waypoints}>{(waypoint) => {
            // When captured, fade out and fly to me
            const [opacity] = createSpring(createMemo(() => (isCaptured(waypoint.id) ? 0 : 1), magnetSpringSettings));

            const point = createMemo(() => {
              // When captured, fly to me (like a magnet) (if opacity === 0, also use fixed value)
              const lon = (!isCaptured(waypoint.id) || opacity() === 0) ? waypoint.longitude : state.me?.location?.longitude ?? waypoint.longitude;
              const lat = (!isCaptured(waypoint.id) || opacity() === 0) ? waypoint.latitude : state.me?.location?.latitude ?? waypoint.latitude;
              return Point
                .create(lon, lat)
                .transform(locationsToScreenTransform());
            });

            const [position] = createSpring(point, magnetSpringSettings);

            return (
              <Show when={opacity() > 0}>
                <CoinWaypoint x={position().left} y={position().top} opacity={opacity()}/>;
              </Show>
            );
          }}</For>

          <MagnetCircle x={mySmoothPosition().left} y={mySmoothPosition().top} radiusX={smoothMagnetSize().width} radiusY={smoothMagnetSize().height} />
          <MyWayPoint gender={state.me?.gender ?? "male"} x={mySmoothPosition().left} y={mySmoothPosition().top} />
        </svg>
      </GeoLocationError>

      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <SignalLogger obj={{
          svgRect,
          locationBounds,
          locationsToScreenTransform,
        }} />
      </div>
    </div>
  );
};
