import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WaypointIdList, WaypointLocation, WaypointsData } from '../../types';
import {
  DEFAULT_LOCATION,
  DEFAULT_WAYPOINT_ID_LIST,
  DEFAULT_WAYPOINTS_DATA,
} from '../../config';

interface AppState {
  waypointIdList: WaypointIdList;
  waypointsData: WaypointsData;
  currentMapCenter: WaypointLocation;
}

const initialState: AppState = {
  waypointIdList: DEFAULT_WAYPOINT_ID_LIST,
  waypointsData: DEFAULT_WAYPOINTS_DATA,
  currentMapCenter: DEFAULT_LOCATION,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentMapCenter: (state, action: PayloadAction<WaypointLocation>) => {
      state.currentMapCenter = action.payload;
    },

    addWaypoint: (state, action: PayloadAction<string>) => {
      const currentMaxId = Math.max(...state.waypointIdList);
      let newId = 1;
      // так как Math.max может возвращать странные значения типа -Infinity и NaN,
      //то соответственно делаем проверку на эти значения
      if (!Number.isNaN(currentMaxId) && !(currentMaxId === -Infinity)) {
        newId = currentMaxId + 1;
      }

      state.currentMapCenter = [
        state.currentMapCenter[0],
        state.currentMapCenter[1] + 0.05,
      ];

      state.waypointsData[newId] = {
        title: action.payload,
        location: state.currentMapCenter,
      };
      state.waypointIdList.push(newId);
    },

    deleteWaypoint: (state, action: PayloadAction<number>) => {
      state.waypointIdList = state.waypointIdList.filter(
        (id) => id !== action.payload,
      );
      delete state.waypointsData[action.payload];
    },

    editWaypointTitle: (
      state,
      action: PayloadAction<{ id: number; newTitle: string }>,
    ) => {
      const { id, newTitle } = action.payload;
      state.waypointsData[id] = { ...state.waypointsData[id], title: newTitle };
    },

    editWaypointLocation: (
      state,
      action: PayloadAction<{
        id: number;
        newWaypointLocation: WaypointLocation;
      }>,
    ) => {
      const { id, newWaypointLocation } = action.payload;
      state.waypointsData[id].location = newWaypointLocation;
    },

    dragWaypoint: (
      state,
      action: PayloadAction<{ oldIndex: number; newIndex: number }>,
    ) => {
      const { oldIndex, newIndex } = action.payload;
      const moved = state.waypointIdList.splice(oldIndex, 1);
      state.waypointIdList.splice(newIndex, 0, ...moved);
    },
  },
});
