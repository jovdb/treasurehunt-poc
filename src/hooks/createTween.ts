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
export function createTween<T extends number>(
  target: () => T,
  { ease = (t: T) => t, duration = 100 },
) {
  const [start, setStart] = createSignal(document.timeline.currentTime);
  const [current, setCurrent] = createSignal<T>(target());
  createEffect(on(target, () => setStart(document.timeline.currentTime), { defer: true }));
  createEffect(
    on([start, current], () => {
      const cancelId = requestAnimationFrame((t) => {
        const elapsed = t - (start() || 0) + 1;
        setCurrent((c) => (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          elapsed < duration
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            ? (target() - c) * ease((elapsed / duration) as T) + c
            : target()
        ));
      });
      onCleanup(() => cancelAnimationFrame(cancelId));
    }),
  );
  return current;
}
