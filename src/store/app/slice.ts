import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WaypointsData } from '../../types';

interface AppState {
  waypointIdList: number[];
  waypointsData: WaypointsData;
}

const initialState: AppState = {
  waypointIdList: [1, 2, 3, 4],
  waypointsData: {
    1: { title: 'Точка маршрута 1' },
    2: { title: 'Точка маршрута 2' },
    3: { title: 'Точка маршрута 3' },
    4: { title: 'Точка маршрута 4' },
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addWaypoint: (state, action: PayloadAction<string>) => {
      const currentMaxId = Math.max(...state.waypointIdList);
      let newId = 1;
      // так как Math.max может возвращать странные значения типа -Infinity и NaN,
      //то соответственно делаем проверку на эти значения
      if (!Number.isNaN(currentMaxId) && !(currentMaxId === -Infinity)) {
        newId = currentMaxId + 1;
      }
      state.waypointsData[newId] = { title: action.payload };
      state.waypointIdList.push(newId);
    },

    deleteWaypoint: (state, action: PayloadAction<number>) => {
      state.waypointIdList = state.waypointIdList.filter(
        (id) => id !== action.payload,
      );
      delete state.waypointsData[action.payload];
    },

    editWaypoint: (
      state,
      action: PayloadAction<{ id: number; newTitle: string }>,
    ) => {
      const { id, newTitle } = action.payload;
      state.waypointsData[id] = { title: newTitle };
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
