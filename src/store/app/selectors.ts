import { RootState } from '../types';
import { WaypointsData } from '../../types';

export const getWaypointIdList = (state: RootState): number[] =>
  state.app.waypointIdList;

export const getWaypointsData = (state: RootState): WaypointsData =>
  state.app.waypointsData;
