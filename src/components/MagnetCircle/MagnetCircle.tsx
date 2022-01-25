export function MagnetCircle(props: {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
}) {
  return (
    <>
      <defs>
        <radialGradient id="magnet-circle">
          <stop offset="0%" stop-color="rgba(0, 0, 255, 0.12)">
          </stop>
          <stop offset="60%" stop-color="rgba(0, 0, 255, 0.12)">
            <animate attributeName="offset" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite"></animate>
          </stop>
          <stop offset="90%" stop-color="rgba(0, 0, 255, 0.04)">
            <animate attributeName="offset" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite"></animate>
          </stop>
          <stop offset="100%" stop-color="rgba(0, 0, 255, 0.04)">
          </stop>
        </radialGradient>
      </defs>
      <ellipse
        cx={props.x}
        cy={props.y}
        rx={props.radiusX}
        ry={props.radiusY}
        fill="url('#magnet-circle')"
      >
      </ellipse>
    </>
  );
}
