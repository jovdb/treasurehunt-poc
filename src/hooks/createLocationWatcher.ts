import { createGeolocationWatcher } from "@solid-primitives/geolocation";
import { Accessor, createMemo, createSignal } from "solid-js";

import { Point } from "../math/Point";
import { Transform } from "../math/Transform";
import { ILocation } from "../types/WayPoint";

import { setMyLocation } from "../store/store";
import { throttleSignals } from "../utils/signal-helpers";
import { createDragCoordinates } from "./createDragCoordinates";

export function createLocationWatcher(
  locationsToScreenTransform: Accessor<Transform>,
) {
  const [location, locationError] = createGeolocationWatcher(true);

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
    setMyLat((location()?.latitude || 0) * -1);
  });

  // When dragging, use it as target position
  createMemo(() => {
    setMyLon(simulatedLocation().left || 0);
    setMyLat(simulatedLocation().top || 0);
  });

  // Update state on location changex
  createMemo(() => {
    const newLocation: ILocation = {
      longitude: myLon(),
      latitude: myLat(),
    };
    setMyLocation(newLocation, locationError());
  });
}
