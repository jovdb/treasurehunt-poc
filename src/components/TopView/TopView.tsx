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

  // Simulate GPS location
  const [myX, myY] = createGeoSimulation();
  const myLocation = createMemo(() => Point
    .create(myX(), myY())
    .transform(locationsToScreenTransform().inverse())
    .toTuple());

  // Animate to new position
  const myLon = createMemo(() => myLocation()[0] || 0);
  const myLat = createMemo(() => myLocation()[1] || 0);
  const [smoothLon] = createSpringValue(myLon, springSettings);
  const [smoothLat] = createSpringValue(myLat, springSettings);

  const refCallback = createResizeObserver({
    onResize: (size) => setSvgRect(Rect.create(0, 0, size.width, size.height)),
  });

  const myPosition = createMemo(() => Point
    .create(smoothLon(), smoothLat())
    .transform(locationsToScreenTransform()));

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

          <MyWayPoint gender="male" x={myPosition().left} y={myPosition().top} />
        </svg>
      </GeoLocationError>

      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <SignalLogger obj={{
          svgRect,
          locationBounds,
          locationsToScreenTransform,
          myX,
          myLon,
          myLocation,
          smoothLon,
        }} />
        LOC: {location()?.longitude}
      </div>
    </div>
  );
};
