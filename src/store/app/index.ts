import * as selectors from './selectors';
import { appSlice } from './slice';

export const appSelectors = selectors;

export const { actions: appActions, reducer: appReducer } = appSlice;
