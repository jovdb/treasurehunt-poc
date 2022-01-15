import { createStore } from "solid-js/store";
import { Waypoints } from "../types/WayPoint";
import { WaypointId } from "../types/WayPointId";

interface IStore {
  waypoints: Waypoints[];
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const [state, setState] = createStore<IStore>({
  waypoints: [{
    id: WaypointId.fromString("a"),
    latitude: 100,
    longitude: 200,
    type: "test",
  },
  {
    id: WaypointId.fromString("a"),
    latitude: 150,
    longitude: 350,
    type: "test",
  },
  {
    id: WaypointId.fromString("a"),
    latitude: 300,
    longitude: 200,
    type: "test",
  }],
});
