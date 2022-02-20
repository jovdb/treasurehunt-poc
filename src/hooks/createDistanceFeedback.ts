import { Accessor, createEffect } from "solid-js";
import { remapRange } from "../math/lerp";

function ping(frequency: number) {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  oscillator.frequency.value = frequency;
  oscillator.type = "square";

  oscillator.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(0.03);
}

export function createDistanceFeedback(
  distance: Accessor<number>,
  magnetDistance: Accessor<number>,
) {
  let lastPingTime = Date.now();
  let timeoutId = 0;

  createEffect(() => {
    function schedulePing() {
      // Map distance: 10m -> 500m, 100ms -> 2000ms
      const distanceToCatch = Math.max(0, distance() - magnetDistance());
      const delay = remapRange(0, 100, 80, 4000, distanceToCatch, false);
      const frequency = remapRange(0, 100, 1200, 400, distanceToCatch, true);
      const timeToNextPing = Math.max(0, delay - (Date.now() - lastPingTime));

      // Don't beep when too far away
      if (distance() > 100 || distance() === 0) return;

      timeoutId = setTimeout(
        () => {
          // Gi²e feedback
          const now = Date.now();
          if (now - lastPingTime > 50) ping(frequency); // Still busy
          lastPingTime = now;

          schedulePing();
        },
        timeToNextPing,
      ) as unknown as number;
    }

    // First cancel any running timers
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = 0;
    }
    // Start a new Timer
    schedulePing();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = 0;
      }
    };
  });
}
