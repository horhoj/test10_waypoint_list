import { RootState } from '../types';
import { WaypointIdList, WaypointsData } from '../../types';

export const getWaypointIdList = (state: RootState): WaypointIdList =>
  state.app.waypointIdList;

export const getWaypointsData = (state: RootState): WaypointsData =>
  state.app.waypointsData;

export const getCurrentMapCenter = (state: RootState): [number, number] =>
  state.app.currentMapCenter;
