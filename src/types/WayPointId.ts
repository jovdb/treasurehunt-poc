import { isString, OfType } from "./guards";

export type WaypointId = string & OfType<"WaypointId">;

export const WaypointId = {
  fromString(value: string): WaypointId {
    if (!isString(value)) throw new Error("WaypointId must be a string");
    if (value.length <= 0) throw new Error("WaypointId cannot be empty");
    return value as unknown as WaypointId; // The only cast
  },
};
