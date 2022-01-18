/* eslint-disable @typescript-eslint/restrict-template-expressions */

import createResizeObserver from "@solid-primitives/resize-observer";
import { createGeolocationWatcher } from "@solid-primitives/geolocation";
import {
  createMemo, createSignal, For, Match, Switch,
} from "solid-js";

import { state } from "../../store/store";
import { Point } from "../../math/Point";
import { Rect } from "../../math/Rect";
import "../../math/features/fitInRect";
import "../../math/features/transformPoint";

import { SignalLogger } from "../SignalLogger/SignalLogger";
import { createGeoSimulation } from "../../hooks/createGeoSimulation";
import { createSpringValue, ISpringOptions } from "../../hooks/createSpring";
import { MyWayPoint } from "../MyLocation/MyLocation";
import { CoinWaypoint } from "../CoinWaypoint/CoinWaypoint";

import styles from "./TopView.module.css";
import { GeoLocationError } from "../GeoLocationError";

const springSettings: ISpringOptions = {
};

export const TopView = () => {
  const [svgRect, setSvgRect] = createSignal(Rect.zero);
  const viewRect = createMemo(() => svgRect().grow(-20));

  const locationBounds = createMemo(() => Rect.fromPoints(state.waypoints.map((loc) => Point.create(loc.longitude, loc.latitude))));
  const locationsToScreenTransform = createMemo(() => viewRect().fitRectTransform(locationBounds()));

  const [location, error] = createGeolocationWatcher(true);

  // Get screen location at drag
  const [dragX, dragY] = createGeoSimulation();

  const refCallback = createResizeObserver({
    onResize: (size) => setSvgRect(Rect.create(0, 0, size.width, size.height)),
  });

  // Animate screen position, not the GPS coordinate
  const [myX, setMyX] = createSignal(0);
  const [myY, setMyY] = createSignal(0);

  // Get screen location from GPS location
  createMemo(() => {
    const myLocationOnScreen = Point
      .create(location()?.longitude || 0, location()?.latitude || 0)
      .transform(locationsToScreenTransform());

    setMyX(myLocationOnScreen.left);
    setMyY(myLocationOnScreen.top);
  });

  // When dragging, use it as target position
  createMemo(() => {
    setMyX(dragX() || 0);
    setMyY(dragY() || 0);
  });

  const [smoothX] = createSpringValue(myX, springSettings);
  const [smoothY] = createSpringValue(myY, springSettings);

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

          <MyWayPoint gender="male" x={smoothX()} y={smoothY()} />
        </svg>
      </GeoLocationError>

      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <SignalLogger obj={{
          svgRect,
          locationBounds,
          locationsToScreenTransform,
          dragX,
          myX,
          smoothX,
        }} />
      </div>
    </div>
  );
};
