import { createMemo } from "solid-js";
import { Point } from "../../math/Point";

export function WalkHistory(props: { points: Point[] }) {
  const path = createMemo(() => props.points.reduce((p, position, index) => {
    p += index ? "L" : "M";
    p += `${Math.round(position.left)} ${Math.round(position.top)} `;
    return p;
  }, ""));

  return (
    <path d={path()} fill="transparent" stroke="blue" stroke-with="5"></path>
  );
}
