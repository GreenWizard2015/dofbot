"use client";

import { configureStore } from '@reduxjs/toolkit';
import robotReducer from './slices/robotSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Configure persist options
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['positionQueue', 'isLooping', 'isPlaying', 'currentQueueIndex'],
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, robotReducer);

// Create the Redux store
export const store = configureStore({
  reducer: {
    robot: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);
