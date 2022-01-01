import { configureStore } from '@reduxjs/toolkit';
import { appReducer } from './app';

export const store = configureStore({
  devTools: true,
  reducer: {
    app: appReducer,
  },
});
