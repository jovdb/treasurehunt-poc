import maleUrl from "./male.png";
import femaleUrl from "./female.png";

export function MyWayPoint(props: {
  gender: "male" | "female";
  x: number;
  y: number;
}) {
  const imageUrl = props.gender === "female" ? femaleUrl : maleUrl;
  const size = 30;
  return <image
    style={{ transform: `translate(${props.x}px, ${props.y}px)` }}
    x={-size / 2}
    y={-size / 2}
    href={imageUrl}
    height={size}
    width={size}
  />;
}
