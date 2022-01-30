export function DirectionArrow(props: {
  x: number;
  y: number;
  distanceInMeter: number;
}) {
  const arrowSize = 10;
  const fontSize = "12px";

  return (
    <g
      class="direction-arrow"
      style={{ transform: `translate(${props.x}px, ${props.y}px)` }}
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
        fill="#666"
      >
        {Math.round(props.distanceInMeter)}m
      </text>
      <circle r="5" fill="blue"/>
    </g>
  );
}
