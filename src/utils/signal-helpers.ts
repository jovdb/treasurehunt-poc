/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Accessor,
  onCleanup, onMount,
  createEffect, createSignal, batch,
} from "solid-js";

export function throttleSignals<TSignals extends Accessor<any>[]>(
  signals: TSignals,
  intervalInMs: number,
): TSignals {
  let intervalId = 0;
  const changedIndexes: boolean[] = [];
  let lastValues: any[] = [];

  // initialze with signal values
  const throttledSignals = signals.map((signal) => createSignal(signal()));

  // Setup interval
  onMount(() => {
    lastValues = signals.map((signal) => signal());

    intervalId = setInterval(() => {
      batch(() => {
        throttledSignals.forEach(([, setSignal], i) => {
          if (changedIndexes[i]) {
            setSignal(lastValues[i]);
            changedIndexes[i] = false;
          }
        });
      });
    }, intervalInMs);
  });

  // Cleanup interval
  onCleanup(() => {
    clearInterval(intervalId);
  });

  // subscribe to signals and remember the new values
  signals.forEach((signal, i) => {
    createEffect(() => {
      changedIndexes[i] = true;
      lastValues[i] = signal();
    });
  });

  // Return the Accessors
  return throttledSignals.map((signal) => signal[0]) as TSignals;
}
