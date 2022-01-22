import coinUrl from "./coin.gif";

export function CoinWaypoint(props: {
  x: number;
  y: number;
  opacity?: number;
}) {
  const size = 30;
  return <image
    style={{ transform: `translate(${props.x}px, ${props.y}px)`, opacity: props.opacity ?? 1 }}
    x={-size / 2}
    y={-size / 2}
    href={coinUrl}
    height={size}
    width={size}
  />;
}
