import { createMemo } from "solid-js";

export function DirectionArrow(props: {
  x: number;
  y: number;
  distanceInMeter: number;
  angle: number;
}) {
  const arrowSize = 20;
  const fontSize = "14px";

  // Orientate test so it stays readable
  const textTransform = createMemo(() => {
    if (props.angle > 0) {
      return (props.angle % (Math.PI * 2)) < Math.PI ? `rotateZ(180deg) translateY(-${fontSize})` : "";
    }
    return (props.angle % (Math.PI * 2)) < -Math.PI ? `rotateZ(180deg) translateY(-${fontSize})` : "";
  });

  return (
    <g
      class="direction-arrow"
      style={{ transform: `translate(${props.x}px, ${props.y}px) rotate(${props.angle + Math.PI / 2}rad)` }}
    >
      <defs>
        <linearGradient id="direction-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(0, 0, 255, 0.5)"/>
          <stop offset="100%" stop-color="rgba(0, 0, 255, 0)"/>
        </linearGradient>
      </defs>

      <path
        d={`M ${-arrowSize / 2} 0 L${arrowSize / 2} 0 L 0 ${-arrowSize * 0.8} L${-arrowSize / 2} 0`}
        fill="url(#direction-gradient)"
      />
      <text
        x={0}
        y={0}
        font-size={fontSize}
        text-anchor="middle"
        dominant-baseline="hanging"
        fill="#99f"
        style={{ "font-weight": "bold", transform: textTransform() }}
      >
        {Math.round(props.distanceInMeter)}m
      </text>
    </g>
  );
}
