import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from '../features/moviesSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
  },
});

// Infer the `RootState` and `AppDispatch` from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
