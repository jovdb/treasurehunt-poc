export function ViewMask(props: {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
}) {
  // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Clipping_and_masking#masking
  return (
    <g class="view-mask">
      <defs>
        <radialGradient id="view-circle-gradient">
          <stop offset="0.9" stop-color="black" />
          <stop offset="1" stop-color="white" />
        </radialGradient>
        <mask id="view-circle-mask">
          <rect
            width="100%"
            height="100%"
            fill="white"
          />
          <ellipse
            cx={props.x}
            cy={props.y}
            rx={props.radiusX}
            ry={props.radiusY}
            fill="url('#view-circle-gradient')"
          />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        mask="url('#view-circle-mask')"
        fill="white"
      />
    </g>
  );
}
