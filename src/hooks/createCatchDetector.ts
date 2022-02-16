/* eslint-disable no-plusplus */
import { batch, createMemo } from "solid-js";
import { getDistanceFromLine } from "geolib";

import { takeLast } from "../utils/signal-helpers";
import { state, isCaptured, setCaptured } from "../store/store";
import coinMp3Url from "../Audio/coin.mp3";

/** Create 2 audio instances, so we can play before the previous is finished */
function createAudio(mp3Url: string) {
  const audio = [new Audio(mp3Url), new Audio(mp3Url)];
  audio.forEach((a) => a.prepend());
  let count = 0;
  return {
    play() {
      return audio[count++ % 2].play();
    },
  };
}

const coinAudio = createAudio(coinMp3Url);

export function createCatcheDetector() {
  const location = createMemo(() => state.me?.location);
  const previousValues = takeLast(location, 2);

  createMemo(() => {
    const prev = previousValues()[0];
    const current = location();
    if (!prev || !current) return;
    const captureDistanceInMeter = state.me?.magnetDistanceInMeter ?? 10;

    const captured = state.waypoints
      .filter((waypoint) => !isCaptured(waypoint.id))
      .filter((waypoint) => getDistanceFromLine(waypoint, prev, current) <= captureDistanceInMeter);

    batch(() => {
      captured.forEach((waypoint) => {
        setCaptured(waypoint.id);

        if (waypoint.type === "coin") {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          coinAudio.play();
        }
      });
    });
  });
}
