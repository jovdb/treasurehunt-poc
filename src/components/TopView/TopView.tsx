/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-console */

import createResizeObserver from "@solid-primitives/resize-observer";
import {
  createMemo, createSignal, For, onCleanup, onMount, Show,
} from "solid-js";
import { getDistance } from "geolib";

import {
  getNextWaypoint,
  getViewDistanceInMeter,
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
import { createCatcheDetector } from "../../hooks/createCatchDetector";
import { Grid } from "../Grid/Grid";
import { Vector } from "../../math/Vector";
import { Transform } from "../../math/Transform";
import { MagnetCircle } from "../MagnetCircle/MagnetCircle";
import { ViewMask } from "../ViewMask/ViewMask";
import { WalkTrail } from "../WalkTrail/WalkTrail";
import { DirectionArrow } from "../DirectionArrow/DirectionArrow";
import { takeLast } from "../../utils/signal-helpers";

const springSettings: ISpringBehavior = {
  stiffness: 0.1,
};
const magnetSpringSettings: ISpringBehavior = {};

function createViewDistanceChanger() {
  // Change location with keypresses (dragging won't help if we move the map)
  const viewDistanceInMeter = getViewDistanceInMeter();

  function onKeyDown(e: KeyboardEvent) {
    // eslint-disable-next-line default-case
    switch (e.key) {
      case "+": {
        setViewDistance(viewDistanceInMeter + 10);
        break;
      }

      case "-": {
        setViewDistance(viewDistanceInMeter - 10);
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

  const viewRect = createMemo(() => svgRect().grow(-50));

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
    const viewDistanceInMeter = getViewDistanceInMeter();
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

  // Calculate Grid
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
      .transform(locationsToScreenTransform())
      .normalize();

    // TODO: fix, seems to have a bug?
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
  const lastPositions = takeLast(createMemo(() => state.me?.location), 50);

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

  /** offset to the next waypoint in geo location */
  const nextLocationOffset = createMemo(() => {
    const nextWaypoint = getNextWaypoint();
    if (!nextWaypoint) return Vector.create(0, 0);
    return Vector.create(
      nextWaypoint.longitude - (state.me?.location?.longitude ?? 0),
      nextWaypoint.latitude - (state.me?.location?.latitude ?? 0),
    ); // Use Vector because it has angle methods
  });

  const distanceToNextWaypoint = createMemo(() => nextLocationOffset()
    .scaleByVector(location2MetersScale())
    .getLength());

  // Use angle so we can animate as circle, and not in a straight line to new location
  const directionArrowRad = createMemo<number>((prev) => {
    const newValue = nextLocationOffset().getAngleRad();
    if (prev === undefined) return newValue;
    let delta = (newValue - prev) % (Math.PI * 2);
    if (delta > Math.PI) delta -= Math.PI * 2;
    else if (delta < -Math.PI) delta += Math.PI * 2;
    return prev + delta;
  });

  const [smoothDirectionArrowRad] = createSpring(directionArrowRad, {
    mass: 10,
    damping: 2.5,
    precision: 0.0001,
  });

  // Work in geo coordinates
  const arrowMarginPx = 30;
  const directionArrowPosition = createMemo(() => Point
    .fromObject(mySmoothPosition())
    .transform(Transform.fromObject(locationsToScreenTransform()).inverse()) // Back to geo coordinates

    // Add offset to viewDistance
    .addPoint(
      Point
        .fromTuple(Vector
          .fromAngleRad(smoothDirectionArrowRad())
          .scale(getViewDistanceInMeter()) // vector with distance = viewDistance in meter
          .scaleByVector(location2MetersScale().inverse()) // vector with distance = viewDistance in geoCoordinates
          .toTuple()), // Vector to Point
    )
    .transform(locationsToScreenTransform())

    // Add offset margin
    .addPoint(
      Point
        .fromTuple(Vector
          .fromAngleRad(smoothDirectionArrowRad())
          .scale(arrowMarginPx, -arrowMarginPx)
          .toTuple()), // Vector to Point
    ));

  return (
    <div
      class={styles.TopView}
      ref={refCallback}
    >
      <GeoLocationError code={state.me?.locationError?.code || 0} >
        <svg
          class={styles.TopView_svg}
        >
          <rect width="100%" height="100%" fill="#f8f8f8" />
          <MagnetCircle x ={mySmoothPosition().left} y={mySmoothPosition().top} radiusX={smoothMagnetSize().width} radiusY={smoothMagnetSize().height} />
          <WalkTrail points={positions()}/>
          <Grid x={smoothGrid().left} y={smoothGrid().top} width={smoothGrid().width} height={smoothGrid().height} />
          <g class="items">
            <For each={state.waypoints}>{(waypoint) => {
              const location = createMemo(() => {
                // When captured, fly to me (like a magnet)
                const lon = (!isCaptured(waypoint.id)) ? waypoint.longitude : state.me?.location?.longitude ?? waypoint.longitude;
                const lat = (!isCaptured(waypoint.id)) ? waypoint.latitude : state.me?.location?.latitude ?? waypoint.latitude;
                return Point.create(lon, lat);
              });

              const show = createMemo(() => {
                if (isCaptured(waypoint.id)) return false;

                // Only show items within the viewable distance
                const distanceInMeter = Vector
                  .create(
                    (state.me?.location?.longitude ?? 0) - location().left,
                    (state.me?.location?.latitude ?? 0) - location().top,
                  )
                  .transform(Transform.identity.scaleByVector(location2MetersScale()))
                  .getLength();
                if (distanceInMeter > (state.me?.viewDistanceInMeter ?? Infinity)) return false;
                return true;
              });

              // When captured, fade out and fly to me
              const [smoothOpacity] = createSpring(createMemo(() => (show() ? 1 : 0), magnetSpringSettings));
              const position = createMemo(() => location().transform(locationsToScreenTransform()));
              const [smoothPosition] = createSpring(position, magnetSpringSettings);

              return (
                <Show when={smoothOpacity()}>
                  <CoinWaypoint x={smoothPosition().left} y={smoothPosition().top} opacity={smoothOpacity()}/>;
                </Show>
              );
            }}</For>
          </g>

          <MyWayPoint gender={state.me?.gender ?? "male"} x={mySmoothPosition().left} y={mySmoothPosition().top} />
          <ViewMask x={smoothViewMask().x} y={smoothViewMask().y} radiusX={smoothViewMask().radiusX} radiusY={smoothViewMask().radiusY} />
          <DirectionArrow x={directionArrowPosition().left} y={directionArrowPosition().top} distanceInMeter={distanceToNextWaypoint()} angle={smoothDirectionArrowRad()}/>
        </svg>
      </GeoLocationError>

      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <SignalLogger obj={{
          smoothNextOffset: nextLocationOffset,
        }} />
      </div>
    </div>
  );
};
