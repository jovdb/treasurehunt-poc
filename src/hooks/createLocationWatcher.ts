import { findNearest } from "geolib";

import { createGeolocationWatcher } from "@solid-primitives/geolocation";
import {
  createMemo, createSignal, onCleanup, onMount,
} from "solid-js";

import { ILocation } from "../types/WayPoint";

import { setMyLocation, state } from "../store/store";

export function createLocationWatcher() {
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

  // Auto walk
  let walkingTimer = 0;
  const speed = 0.00005;
  const maxAngle = Math.PI / 2;
  let angle = -1;

  function moveRandom() {
    angle += Math.random() * maxAngle - maxAngle / 2;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;

    setMyLon((prev) => prev + dx);
    setMyLat((prev) => prev + dy);
    walkingTimer = setTimeout(moveRandom, 300 + Math.random() * 200) as unknown as number;
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

      case " ": {
        if (walkingTimer) {
          console.log("Stop walking.");
          clearInterval(walkingTimer);
          walkingTimer = 0;
        } else {
          console.log("Start walking, press Space to stop.");
          moveRandom();
        }
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
        console.log("unmapped key:", e.key);
        break;
    }
  }

  onMount(() => {
    document.addEventListener("keydown", onKeyDown);
  });

  onCleanup(() => {
    document.addEventListener("keydown", onKeyDown);
  });

  // Get screen location from GPS location
  createMemo(() => {
    setMyLon(location()?.longitude || 0);
    setMyLat((location()?.latitude || 0));
  });

  // Update state on location changex
  createMemo(() => {
    // Don't create a new object with the same values
    if (myLon() === state.me?.location?.longitude && myLat() === state.me?.location?.latitude) return;

    const newLocation: ILocation = {
      longitude: myLon(),
      latitude: myLat(),
    };

    setMyLocation(newLocation, locationError());
  });
}
