import { Match, Show, Switch } from "solid-js";
import { CoinWaypoint } from "../CoinWaypoint/CoinWaypoint";
import { BinocularWaypoint } from "../BinocularWaypoint/BinocularWaypoint";
import { Waypoints } from "../../types/WayPoint";

export function Waypoint(props: {
  waypoint: Waypoints;
  x: number,
  y: number,
  opacity: number;
}) {
  return (
    <Show when={props.opacity}>
      <Switch>
        <Match when={props.waypoint.type === "coin"}>
          <CoinWaypoint x={props.x} y={props.y} opacity={props.opacity}/>
        </Match>
        <Match when={props.waypoint.type === "binocular"}>
          <BinocularWaypoint x={props.x} y={props.y} opacity={props.opacity}/>
        </Match>
      </Switch>
    </Show>
  );
}
