export function ImageWaypoint(props: {
  imageUrl: string;
  x: number;
  y: number;
  size: number;
  opacity?: number;
}) {
  return <image
    style={{ transform: `translate(${props.x}px, ${props.y}px)`, opacity: props.opacity ?? 1 }}
    x={-(props.size ?? 30) / 2}
    y={-(props.size ?? 30) / 2}
    href={props.imageUrl}
    height={props.size}
    width={props.size}
  />;
}
