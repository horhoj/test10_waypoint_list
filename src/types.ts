export interface Waypoint {
  title: string;
}

export interface WaypointsData {
  [keys: number]: Waypoint;
}

export type WaypointLocation = [number, number];

export type WaypointIdList = number[];
