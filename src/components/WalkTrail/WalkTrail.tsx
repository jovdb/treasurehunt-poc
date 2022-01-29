import { For } from "solid-js";
import { Point } from "../../math/Point";

export function WalkTrail(props: { points: Point[]}) {
  return (
    <g class="walk-trail" style={{ "mix-blend-mode": "multiply" }}>
      <For each={props.points}>{(point, index) => {
        const prevPoint = props.points[index() - 1];
        if (!prevPoint || (prevPoint.top === 0 && prevPoint.left === 0)) return null;
        const amount = index() / props.points.length;
        // Used lines because it was not possible to change gradients in the path
        return <line x1={prevPoint.left} y1={prevPoint.top} x2={point.left} y2={point.top} stroke={`rgba(${255 - amount * 32}, ${255 - amount * 32}, 255)`} stroke-width={10 * amount} stroke-linecap="round" />;
      }}</For>
    </g>
  );
}
