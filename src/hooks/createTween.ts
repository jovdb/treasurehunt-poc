import {
  createSignal, createEffect, onCleanup, on,
} from "solid-js";

/**
 * Creates a simple tween method.
 *
 * @param function Target to be modified
 * @param object Object representing the ease and duration
 * @returns Returns the tweening value
 *
 * @example
 * ```ts
 * const tweenedValue = createTween(myNumber, { duration: 500 });
 * ```
 */
export function createTween(
  target: () => number,
  {
    ease = (t: number) => t,
    duration = 100,
  } = {},
) {
  const [start, setStart] = createSignal(document.timeline.currentTime);
  const [current, setCurrent] = createSignal(target());
  const [isBusy, setIsBusy] = createSignal<boolean>(false);

  // Set Start time on change (no at initial run)
  createEffect(on(target, () => setStart(document.timeline.currentTime), { defer: true }));

  // Start interpolation
  createEffect(
    on([start], () => {
      // Start RAF until completed or a new value is received
      let cancelRafId = 0;
      function tick(t = 0) {
        const elapsed = t - (start() || 0) + 1;
        const isStillBusy = elapsed < duration;

        setIsBusy(isStillBusy);
        setCurrent((c: any) => (
          // If value does is not change, it will not trigger a new current update, so loop stops
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          elapsed < duration
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            ? (target() - c) * ease(elapsed / duration) + c
            : target()
        ));

        // Next tick
        if (elapsed < duration) {
          cancelRafId = requestAnimationFrame(tick);
        }
      }

      // Start animation loop
      tick();

      // On Cancel stop pending RAF
      onCleanup(() => {
        // TODO? setComplete(spring.completed);
        cancelAnimationFrame(cancelRafId);
      });
    }, { defer: true }),
  );

  return [current, isBusy] as const;
}
