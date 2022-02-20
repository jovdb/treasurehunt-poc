import { ImageWaypoint } from "../ImageWaypoint/ImageWaypoint";
import binocularUrl from "./binocular4.png";

export function BinocularWaypoint(props: {
  x: number;
  y: number;
  opacity?: number;
}) {
  return <ImageWaypoint
    x={props.x}
    y={props.y}
    opacity={props.opacity}
    imageUrl={binocularUrl}
    size={40}
  />;
}
