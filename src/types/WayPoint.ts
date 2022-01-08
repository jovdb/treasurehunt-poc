import { WaypointId } from "./WayPointId";

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IWaypoint<TType extends string> extends ILocation {
  type: TType;
  id: WaypointId;
}

export type Waypoints = IWaypoint<"test">;
