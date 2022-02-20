import {
  createEffect, createSignal,
  Accessor, For, PropsWithChildren,
} from "solid-js";
import { createSpring } from "../../hooks/createSpring";
import { Point } from "../../math/Point";
import { Vector } from "../../math/Vector";

import styles from "./Explosion.module.css";

interface IAnimate {
  x: number;
  y: number;
  opacity: number;
  scale: number;
}

interface IItem {
  index: number;
  start: IAnimate;
  end: IAnimate;
}

export function Explosion(props: PropsWithChildren<{
  signal: Accessor<number>;
  condition?: (value: number) => boolean;
}>) {
  let ref!: HTMLElement;
  const [items, setItems] = createSignal<IItem[]>([]);

  createEffect(() => {
    const value = props.signal();
    if (props.condition && !props.condition(value)) return;

    const center = Point
      .create(ref.offsetLeft + ref.offsetWidth / 2, ref.offsetTop + ref.offsetHeight / 2);
    const addItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 10 + Math.random() * 20;
      const movement = Vector
        .fromAngleRad(angle)
        .scale(distance);

      const offsetX = value < 10 ? 10 : 0;
      return {
        index,
        start: {
          x: center.left - 5 + Math.random() * 10 + offsetX,
          y: center.top - 5 + Math.random() * 10,
          scale: 0.3 + Math.random() * 0.5,
          opacity: 0.4 + Math.random() * 0.3,
        },
        end: {
          x: center.left + movement.width - 5 + Math.random() * 10,
          y: center.top + movement.height - 5 + Math.random() * 10,
          scale: 1 + Math.random() * 0.5,
          opacity: -0.1,
        },
      };
    });
    setItems((prev) => prev.concat(addItems));
  });

  return (
    <span
      ref={ref}
      class="Explosion"
    >
      <For each={items()}>{(item) => {
        // Animate each dot out
        const [position, setPosition] = createSignal(item.start);
        const [current] = createSpring(position, {
          stiffness: 0.05,
          onComplete: () => {
            setItems([]);
          },
        });
        Promise.resolve().then(() => setPosition(item.end)).catch(() => undefined);

        return (
          <div
            class={styles.Explosion__dot}
            style={{
              transform: `translate(${current().x}px, ${current().y}px) scale(${current().scale})`,
              opacity: current().opacity,
            }}
          />
        );
      }}</For>
      {props.children}
    </span>
  );
}
