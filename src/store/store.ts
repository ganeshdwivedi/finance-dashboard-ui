import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import transactionsReducer from './slices/transactionsSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    transactions: transactionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
