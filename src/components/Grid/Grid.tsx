export function Grid(props: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  return (
    <g class="grid">
      <defs>
        <pattern
          id="grid"
          x={props.x}
          y={props.y}
          width={props.width}
          height={props.height}
          patternUnits="userSpaceOnUse"
        >
          <path d={`M ${props.width} 0 L 0 0 0 ${props.height}`} fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </g>
  );
}
