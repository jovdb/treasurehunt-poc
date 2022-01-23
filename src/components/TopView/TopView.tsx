/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import createResizeObserver from "@solid-primitives/resize-observer";
import {
  Accessor, createMemo, createSignal, For, Show,
} from "solid-js";
import { getDistanceFromLine } from "geolib";

import {
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
import { createCatcheDetector } from "../../hooks/createCatchDetector";

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
