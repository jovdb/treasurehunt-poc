import { WaypointId } from "./WayPointId";

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IWaypoint<TType extends string> extends ILocation {
  type: TType;
  id: WaypointId;
}

export interface ICoinWaypoint extends IWaypoint<"coin"> {
}
export interface IBInocularWaypoint extends IWaypoint<"binocular"> {
}

export type Waypoints = ICoinWaypoint | IBInocularWaypoint;
