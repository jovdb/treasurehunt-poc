import { Accessor, createMemo } from "solid-js";
import { getDistanceFromLine } from "geolib";

import { state, isCaptured, setCaptured } from "../store/store";

function createLastValues<T>(accessor: Accessor<T>, length = 10) {
  return createMemo<T[]>((prev) => ([...prev, accessor()].slice(-length)), []);
}

export function createCatcheDetector() {
  const location = createMemo(() => state.me?.location);
  const previousValues = createLastValues(location, 2);
  createMemo(() => {
    const prev = previousValues()[0];
    const current = location();
    if (!prev || !current) return;
    const captureDistanceInMeter = 10;

    const captured = state.waypoints
      .filter((waypoint) => !isCaptured(waypoint.id))
      .filter((waypoint) => getDistanceFromLine(waypoint, prev, current) <= captureDistanceInMeter);

    captured.forEach((waypoint) => {
      setCaptured(waypoint.id);
    });
  });
}
