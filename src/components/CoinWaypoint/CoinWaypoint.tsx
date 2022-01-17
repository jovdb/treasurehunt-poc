import coinUrl from "./coin.gif";

export function CoinWaypoint(props: {
  x: number;
  y: number;
}) {
  const size = 30;
  return <image
    style={{ transform: `translate(${props.x}px, ${props.y}px)` }}
    x={-size / 2}
    y={-size / 2}
    href={coinUrl}
    height={size}
    width={size}
  />;
}
