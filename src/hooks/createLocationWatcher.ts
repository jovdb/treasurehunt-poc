import { findNearest } from "geolib";

import { createGeolocationWatcher } from "@solid-primitives/geolocation";
import {
  Accessor, createMemo, createSignal, onCleanup, onMount,
} from "solid-js";

import { Point } from "../math/Point";
import { Transform } from "../math/Transform";
import { ILocation } from "../types/WayPoint";

import { setMyLocation, state } from "../store/store";
import { throttleSignals } from "../utils/signal-helpers";
import { createDragCoordinates } from "./createDragCoordinates";

export function createLocationWatcher(
  locationsToScreenTransform: Accessor<Transform>,
) {
  const [location, locationError] = createGeolocationWatcher(true);

  // Location to use (simulated or real geo location)
  const [myLon, setMyLon] = createSignal(0);
  const [myLat, setMyLat] = createSignal(0);

  function getClosestWaypoint() {
    const closestLocation = findNearest({
      latitude: myLat(),
      longitude: myLon(),
    }, state.waypoints as unknown as ILocation[]) as ILocation;

    const index = state.waypoints.findIndex((waypoint) => waypoint.longitude === closestLocation.longitude && waypoint.latitude === closestLocation.latitude);
    return [state.waypoints[index], index] as const;
  }

  // Change location with keypresses (dragging won't help if we move the map)
  function onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "Home": {
        const { longitude, latitude } = state.waypoints[0];
        setMyLon(longitude);
        setMyLat(latitude);
        break;
      }

      case "End": {
        const { longitude, latitude } = state.waypoints[state.waypoints.length - 1];
        setMyLon(longitude);
        setMyLat(latitude);
        break;
      }

      case "PageUp": {
        const [, index] = getClosestWaypoint();
        const nextIndex = Math.max(0, Math.min(state.waypoints.length - 1, index + 1));
        const nextWaypoint = state.waypoints[nextIndex];
        setMyLon(nextWaypoint.longitude);
        setMyLat(nextWaypoint.latitude);
        break;
      }

      case "PageDown": {
        const [, index] = getClosestWaypoint();
        const nextIndex = Math.max(0, Math.min(state.waypoints.length - 1, index - 1));
        const nextWaypoint = state.waypoints[nextIndex];
        setMyLon(nextWaypoint.longitude);
        setMyLat(nextWaypoint.latitude);
        break;
      }

      case "ArrowLeft":
        setMyLon((prev) => prev - 0.00005);
        break;

      case "ArrowRight":
        setMyLon((prev) => prev + 0.00005);
        break;

      case "ArrowUp":
        setMyLat((prev) => prev + 0.00003);
        break;

      case "ArrowDown":
        setMyLat((prev) => prev - 0.00003);
        break;

      default:
        break;
    }
  }

  onMount(() => {
    document.addEventListener("keydown", onKeyDown);
  });

  onCleanup(() => {
    document.addEventListener("keydown", onKeyDown);
  });

  // Get Geo position from Drag
  const [dragX, dragY] = createDragCoordinates();
  // Throttle position to simulate geo coordinates intervals
  const [throttledX, throttledY] = throttleSignals([dragX, dragY], 200) as [Accessor<number>, Accessor<number>];
  // Convert to Geo locations
  const simulatedLocation = createMemo(() => Point
    .create(throttledX(), throttledY())
    .transform(locationsToScreenTransform().inverse()));

  // Get screen location from GPS location
  createMemo(() => {
    setMyLon(location()?.longitude || 0);
    setMyLat((location()?.latitude || 0));
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
