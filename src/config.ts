import { WaypointIdList, WaypointLocation, WaypointsData } from './types';

export const DEFAULT_LOCATION: WaypointLocation = [55.75, 37.57];

export const DEFAULT_WAYPOINTS_DATA: WaypointsData = {
  1: { title: 'Точка 1', location: [55.65, 37.17] },
  2: { title: 'Точка 2', location: [55.55, 37.27] },
  3: { title: 'Точка 3', location: [55.75, 37.37] },
  4: { title: 'Точка 4', location: [55.7, 37.79] },
};

export const DEFAULT_WAYPOINT_ID_LIST: WaypointIdList = [1, 2, 3, 4];
