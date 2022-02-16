/* eslint-disable no-console */
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
  const [myLocation, setMyLocationLocal] = createSignal<ILocation>({
    longitude: 0,
    latitude: 0,
  });

  function getClosestWaypoint() {
    const closestLocation = findNearest(myLocation(), state.waypoints as unknown as ILocation[]) as ILocation;

    const index = state.waypoints.findIndex((waypoint) => waypoint.longitude === closestLocation.longitude && waypoint.latitude === closestLocation.latitude);
    return [state.waypoints[index], index] as const;
  }

  // Auto walk
  let walkingTimer = 0;
  const speed = 0.00002;
  const maxAngle = Math.PI / 2;
  let angle = -1;

  function moveRandom() {
    angle += Math.random() * maxAngle - maxAngle / 2;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;

    setMyLocationLocal((prev) => ({
      longitude: (prev?.longitude ?? 0) + dx,
      latitude: (prev?.latitude ?? 0) + dy,
    }));
    walkingTimer = setTimeout(moveRandom, 150 + Math.random() * 200) as unknown as number;
  }

  // Change location with keypresses (dragging won't help if we move the map)
  function onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "Home": {
        const { longitude, latitude } = state.waypoints[0];
        setMyLocationLocal({
          longitude,
          latitude,
        });
        break;
      }

      case "End": {
        const { longitude, latitude } = state.waypoints[state.waypoints.length - 1];
        setMyLocationLocal({
          longitude,
          latitude,
        });
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
        const { longitude, latitude } = state.waypoints[nextIndex];
        setMyLocationLocal({
          longitude,
          latitude,
        });
        break;
      }

      case "PageDown": {
        const [, index] = getClosestWaypoint();
        const prevIndex = Math.max(0, Math.min(state.waypoints.length - 1, index - 1));
        const { longitude, latitude } = state.waypoints[prevIndex];
        setMyLocationLocal({
          longitude,
          latitude,
        });
        break;
      }

      case "ArrowLeft":
        setMyLocationLocal((prev) => ({
          ...prev,
          longitude: prev.longitude - 0.00004,
        }));
        break;

      case "ArrowRight":
        setMyLocationLocal((prev) => ({
          ...prev,
          longitude: prev.longitude + 0.00004,
        }));
        break;

      case "ArrowUp":
        setMyLocationLocal((prev) => ({
          ...prev,
          latitude: prev.latitude + 0.00002,
        }));
        break;

      case "ArrowDown":
        setMyLocationLocal((prev) => ({
          ...prev,
          latitude: prev.latitude - 0.00002,
        }));
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

  // Get screen location from GPS location
  createMemo(() => {
    setMyLocationLocal({
      longitude: location()?.longitude || 0,
      latitude: location()?.latitude || 0,
    });
  });

  // Update state on location changex
  createMemo(() => {
    // Don't create a new object with the same values
    if (myLocation().longitude === state.me.location?.longitude && myLocation().latitude === state.me.location?.latitude) return;
    setMyLocation(myLocation(), locationError());
  });
}
