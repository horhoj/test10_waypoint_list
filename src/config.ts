import { WaypointIdList, WaypointLocation, WaypointsData } from './types';

export const DEFAULT_LOCATION: WaypointLocation = [55.75, 37.57];

export const DEFAULT_WAYPOINTS_DATA: WaypointsData = {
  1: { title: 'Точка маршрута 1', location: [55.65, 37.17] },
  2: { title: 'Точка маршрута 2', location: [55.55, 37.27] },
  3: { title: 'Точка маршрута 3', location: [55.75, 37.37] },
  4: { title: 'Точка маршрута 4', location: [55.72, 37.47] },
};

export const DEFAULT_WAYPOINT_ID_LIST: WaypointIdList = [1, 2, 3, 4];
