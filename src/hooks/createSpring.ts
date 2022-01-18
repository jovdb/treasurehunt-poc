/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  createSignal, createEffect, on, Accessor, onCleanup, batch,
} from "solid-js";

import createSpring from "lemonade-spring";

export interface ISpringOptions {
  /** Can either be a number, an array (mutated) or an simple object with no nesting (mutated) */
  startValue?: number;
  /** A number defining the mass of the spring. Default to 1 */
  mass?: number;
  /** A number defining the stiffness of the spring. Default to 0.1 */
  stiffness?: number;
  /** A number defining the damping of the spring. Default to 0.8 */
  damping?: number;
  /** A number defining the interval size in which the animation will considered completed. Default to 0.01. */
  precision?: number;
  /** A function that will be called after the update() call. Return the current value. */
  onUpdate?: (newValue: number) => void
  /** A function that will be called once the destValue is in range [destValue-precision, destValue+precision] */
  onComplete?: () => void
}

interface ISpring<T> {
  /** Get current value */
  getValue(): T
  /** Set destination value without animation */
  setValue(newValue: T): void;
  /** Is animation completed within the precision */
  completed: boolean;
  /** Animate to this target value */
  target(destination: T): void;
  /** Call typically in a requestAnimationFrame callback to fire onUpdate with a new value */
  update(): void;
}

/**
 * Creates a simple spring method.
 *
 * @param function Accessor to be modified
 * @param object Object with the spring properties
 * @returns Returns the spring value with spring information
 *
 * @example
 * ```ts
 * const [springSignal] = createSpring(xSignal, { mass: 10 });
 * ```
 */
export function createSpringValue(
  target: Accessor<number>,
  options?: ISpringOptions,
) {
  const [current, setCurrent] = createSignal(target());
  const [isBusy, setIsBusy] = createSignal(false);

  // Create a spring value
  const spring = createSpring(target(), {
    ...options,
    onUpdate: (newValue: number) => {
      batch(() => {
        setCurrent(newValue as any);
        setIsBusy(!spring.completed);
        if (options?.onUpdate) options.onUpdate(newValue);
      });
    },
  }) as ISpring<number>;

  // If target value changes, animate with spring
  createEffect(on(target, () => {
    // Set new target
    spring.target(target());

    // Start RAF until completed or a new value is received
    let cancelRafId = 0;
    function tick() {
      spring.update();
      if (!spring.completed) {
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
  }, { defer: true })); // Don't animate from initial value

  return [current, isBusy, spring] as const;
}

// TODO: support object // array
