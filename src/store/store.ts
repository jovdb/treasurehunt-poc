import { createStore } from "solid-js/store";
import { Waypoints } from "../types/WayPoint";
import { WaypointId } from "../types/WayPointId";

interface IStore {
  waypoints: Waypoints[];
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const [state, setState] = createStore<IStore>({
  waypoints: [
  // Home
    {
      type: "coin",
      id: WaypointId.fromString(WaypointId.fromString("1")),
      latitude: 51.046671,
      longitude: 4.105638,
    },

    {
      type: "coin",
      id: WaypointId.fromString(WaypointId.fromString("2")),
      latitude: 51.046828,
      longitude: 4.106560,
    },

    {
      type: "coin",
      id: WaypointId.fromString("3"),
      latitude: 51.046875,
      longitude: 4.107493,
    },

    {
      type: "coin",
      id: WaypointId.fromString("4"),
      latitude: 51.046383,
      longitude: 4.107085,
    },

    {
      type: "coin",
      id: WaypointId.fromString("5"),
      latitude: 51.045738,
      longitude: 4.106535,
    },

    {
      type: "coin",
      id: WaypointId.fromString("6"),
      latitude: 51.045473,
      longitude: 4.106301,
    },

    {
      type: "coin",
      id: WaypointId.fromString("7"),
      latitude: 51.045760,
      longitude: 4.105258,
    },

    {
      type: "coin",
      id: WaypointId.fromString("8"),
      latitude: 51.046048,
      longitude: 4.105499,
    },

    {
      type: "coin",
      id: WaypointId.fromString("9"),
      latitude: 51.046107,
      longitude: 4.103996,
    },
    {
      type: "coin",
      id: WaypointId.fromString("10"),
      latitude: 51.046390,
      longitude: 4.103199,
    },
    {
      type: "coin",
      id: WaypointId.fromString("11"),
      latitude: 51.046605,
      longitude: 4.104639,
    }],
});
