import oriCreateSpring from "lemonade-spring";

import {
  createSignal, createEffect, on, Accessor, onCleanup, batch,
} from "solid-js";

/** Get all key names of members that have not not specified type */
type OmitKeysOfType<T extends object, TOmit> = { [P in keyof T]: T[P] extends TOmit ? never : P }[keyof T];

/** Remove the members of an object with the specified name */
export type OmitType<T extends object, TOmit> = Pick<T, OmitKeysOfType<T, TOmit>>;

export type PickType<T extends object, TProp> = OmitType<{
  [P in keyof T]: T[P] extends TProp
    ? T[P]
    : never
}, never>;

export type SpringResult<T extends object | number | number[]> = Accessor<T extends number[] ? number[] : T extends object ? PickType<T, number> : T>

export interface ISpringBehavior {
  /** A number defining the mass of the spring. Default to 1 */
  mass?: number;
  /** A number defining the stiffness of the spring. Default to 0.1 */
  stiffness?: number;
  /** A number defining the damping of the spring. Default to 0.8 */
  damping?: number;
  /** A number defining the interval size in which the animation will considered completed. Default to 0.01. */
  precision?: number;
  /** A function that will be called after the update() call. Return the current value. */
}

export interface ISpringOptions<T extends object | number> {
  /** Can either be a number, or an simple object with no nesting (mutated) */
  startValue?: T;
  /** A function that will be called after the update() call. Return the current value. */
  onUpdate?: (newValue: SpringResult<T>) => void
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
 * @param function Accessor to be modified (number or object with number values)
 * @param object Object with the spring properties
 * @returns Returns the spring value with spring information
 *
 * @example
 * ```ts
 * const [springSignal] = createSpring(xSignal, { mass: 10 });
 * ```
 */
export function createSpring<T extends object | number[] | number>(
  target: Accessor<T>,
  options?: ISpringOptions<T> & ISpringBehavior,
) {
  const [current, setCurrent] = createSignal(target());
  const [isBusy, setIsBusy] = createSignal(false);

  // Create a spring value
  const spring = oriCreateSpring(target(), {
    ...options,
    onUpdate: (newValue: number) => {
      batch(() => {
        if (typeof newValue === "object") {
          setCurrent({ ...newValue as any }); // the library mutates the value, solids want a different immutable value
        } else if (Array.isArray(newValue)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          setCurrent([...newValue] as any); // the library mutates the value, solids want a different immutable value
        } else {
          setCurrent(newValue as any); // the library mutates the value, solids want a different immutable value
        }
        setIsBusy(!spring.completed);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (options?.onUpdate) options.onUpdate(newValue as any);
      });
    },
  }) as ISpring<T>;

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

  return [current as unknown as SpringResult<T>, isBusy, spring] as const;
}
