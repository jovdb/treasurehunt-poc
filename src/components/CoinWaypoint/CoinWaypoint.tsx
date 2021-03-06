import { ImageWaypoint } from "../ImageWaypoint/ImageWaypoint";
import coinUrl from "./coin.gif";

export function CoinWaypoint(props: {
  x: number;
  y: number;
  opacity?: number;
}) {
  return <ImageWaypoint
    x={props.x}
    y={props.y}
    opacity={props.opacity}
    imageUrl={coinUrl}
    size={30}
  />;
}
