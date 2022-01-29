/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import createResizeObserver from "@solid-primitives/resize-observer";
import {
  createMemo, createSignal, For, onCleanup, onMount, Show,
} from "solid-js";
import { getDistance } from "geolib";

import {
  isCaptured, setMagnetDistance, setMyInfo, setViewDistance, state,
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
import { createCatcheDetector, createLastValues } from "../../hooks/createCatchDetector";
import { Grid } from "../Grid/Grid";
import { Vector } from "../../math/Vector";
import { Transform } from "../../math/Transform";
import { MagnetCircle } from "../MagnetCircle/MagnetCircle";
import { ViewMask } from "../ViewMask/ViewMask";
import { WalkTrail } from "../WalkTrail/WalkTrail";

const springSettings: ISpringBehavior = {
  stiffness: 0.1,
};
const magnetSpringSettings: ISpringBehavior = {};

function createViewDistanceChanger() {
  // Change location with keypresses (dragging won't help if we move the map)
  function onKeyDown(e: KeyboardEvent) {
    // eslint-disable-next-line default-case
    switch (e.key) {
      case "+": {
        setViewDistance((state.me?.viewDistanceInMeter ?? 50) + 5);
        break;
      }

      case "-": {
        setViewDistance((state.me?.viewDistanceInMeter ?? 50) - 5);
        break;
      }
    }
  }

  onMount(() => {
    document.addEventListener("keydown", onKeyDown);
  });

  onCleanup(() => {
    document.addEventListener("keydown", onKeyDown);
  });
}

export const TopView = () => {
  // Size of svg
  const [svgRect, setSvgRect] = createSignal(Rect.zero);
  const refCallback = createResizeObserver({
    onResize: (size) => setSvgRect(Rect.create(0, 0, size.width, size.height)),
  });

  // Temp: randomly scale field
  const viewRect = createMemo(() => svgRect().grow(-20));

  const locationBounds = createMemo(() => Rect
    .fromPoints(state.waypoints.map((loc) => Point.create(loc.longitude, loc.latitude))));

  const location2MetersScale = createMemo(() => {
    const distance = 0.5;
    const center = locationBounds().getCenter();
    const lngToMeter = getDistance({ longitude: center.left - distance, latitude: center.top }, { longitude: center.left + distance, latitude: center.top });
    const latToMeter = getDistance({ longitude: center.left, latitude: center.top - distance }, { longitude: center.left, latitude: center.top + distance });

    return Vector.create(lngToMeter, latToMeter);
  });

  /** Visible rectangle in geoCoordinates */
  const viewBox = createMemo(() => {
    const viewDistanceInMeter = state.me?.viewDistanceInMeter ?? 50;
    const viewLongitudeDistance = viewDistanceInMeter / location2MetersScale().width;
    const viewLatitudeDistance = viewDistanceInMeter / location2MetersScale().height;
    return Rect
      .create(
        (state.me?.location?.longitude ?? 0) - viewLongitudeDistance,
        (state.me?.location?.latitude ?? 0) - viewLatitudeDistance,
        viewLongitudeDistance * 2,
        viewLatitudeDistance * 2,
      );
  });

  const locationsToScreenTransform = createMemo(() => {
    const locationTransform = Transform
      .scale(1, location2MetersScale().width / location2MetersScale().height) // Coordinates are on a sphere, make square
      .scale(1, -1); // Reverse direction of latitude because northem hemisphere

    const targetRect = viewBox()
      .transform(locationTransform.inverse()) // Scale waypoints
      .normalize();

    return locationTransform
      .inverse()
      .multiply(
        viewRect().fitRectTransform(targetRect),
      );
  });
  const [smoothLocationToScreenTransform] = createSpring(locationsToScreenTransform, springSettings);

  // Calcultate Grid
  const gridSizeInMeters = 10;
  const smoothGrid = createMemo(() => Rect
    .create(state.waypoints[0].longitude, state.waypoints[0].latitude, gridSizeInMeters / location2MetersScale().width, gridSizeInMeters / location2MetersScale().height)
    .transform(smoothLocationToScreenTransform() as Transform)
    .normalize());

  // Set Location
  createLocationWatcher();

  createCatcheDetector();
  createViewDistanceChanger();

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
  const smoothMagnetSize = createMemo(() => {
    const radiusInMeter = state.me?.magnetDistanceInMeter ?? 10;
    const meterToScreen = Transform
      .identity
      .scaleByVector(location2MetersScale()) // Location to meter
      .inverse() // Meter to location
      .multiply(smoothLocationToScreenTransform()); // Meter to screen

    const vector = Vector
      .create(radiusInMeter, radiusInMeter)
      .transform(meterToScreen);
    return Vector.create(Math.abs(vector.width), Math.abs(vector.height));
  });

  // ViewMask
  const viewMask = createMemo(() => {
    const { left, top } = viewBox()
      .getCenter()
      .transform(locationsToScreenTransform());
    const size = viewBox()
      .transform(locationsToScreenTransform());
    const radiusX = size.width / 2;
    const radiusY = size.height / 2;

    return {
      x: left,
      y: top,
      radiusX,
      radiusY,
    };
  });
  const [smoothViewMask] = createSpring(viewMask, springSettings);

  // Trail
  const lastPositions = createLastValues(createMemo(() => state.me?.location), 50);

  // Create flat number so we can animate them
  const flatTrailValues = createMemo(() => lastPositions().reduce<number[]>((p, location) => {
    if (!location) return p;
    const position = Point
      .create(location.longitude, location.latitude)
      .transform(smoothLocationToScreenTransform());

    p.push(Math.round(position.left * 10) / 10); // Use decimals for high density displays
    p.push(Math.round(position.top * 10) / 10);
    return p;
  }, []));

  // Convert flat numbers bac to point
  const positions = createMemo(() => {
    let prev = 0;
    // eslint-disable-next-line no-debugger
    return flatTrailValues().reduce<Point[]>((p, value, index) => {
      if (index % 2 === 0) {
        prev = value;
      } else {
        p.push(Point.create(prev, value));
      }
      return p;
    }, []);
  });

  setMyInfo("male");
  setMagnetDistance(10);
  setViewDistance(50);

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

          <WalkTrail points={positions()}/>
          <MagnetCircle x={mySmoothPosition().left} y={mySmoothPosition().top} radiusX={smoothMagnetSize().width} radiusY={smoothMagnetSize().height} />
          <MyWayPoint gender={state.me?.gender ?? "male"} x={mySmoothPosition().left} y={mySmoothPosition().top} />
          <ViewMask x={smoothViewMask().x} y={smoothViewMask().y} radiusX={smoothViewMask().radiusX} radiusY={smoothViewMask().y} />
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
