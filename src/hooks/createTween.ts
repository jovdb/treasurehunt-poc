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
    on([start, current], () => {
      const cancelId = requestAnimationFrame((t) => {
        const elapsed = t - (start() || 0) + 1;
        const isStillBusy = elapsed < duration;

        setIsBusy(isStillBusy);
        setCurrent((c: any) => (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          isStillBusy
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            ? (target() - c) * ease(elapsed / duration) + c
            : target()
        ));
      });

      onCleanup(() => cancelAnimationFrame(cancelId));
    }),
  );

  return [current, isBusy] as const;
}
