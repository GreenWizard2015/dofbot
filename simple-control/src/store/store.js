'use client';

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import robotReducer from './robotSlice';

// Create a simple version of the store without persistence for SSR
const makeStore = () => {
  if (typeof window === 'undefined') {
    // During SSR, return a simple store without persistence
    return configureStore({
      reducer: {
        robot: robotReducer,
      },
    });
  } else {
    // On client side, use redux-persist
    const { persistStore, persistReducer } = require('redux-persist');
    const storage = require('redux-persist/lib/storage').default;

    // Configure persist options
    const persistConfig = {
      key: 'root',
      storage,
      // You can blacklist specific reducers if you don't want to persist them
      // blacklist: ['someReducer']

      // Or whitelist only specific reducers to persist
      // whitelist: ['robot']
    };

    // Combine all reducers
    const rootReducer = combineReducers({
      robot: robotReducer,
      // Add more reducers here as your app grows
    });

    // Create persisted reducer
    const persistedReducer = persistReducer(persistConfig, rootReducer);

    // Create store with persisted reducer
    const store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            // Ignore these action types since they might contain non-serializable values
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          },
        }),
    });

    // Create persistor
    const persistor = persistStore(store);

    return { store, persistor };
  }
};

// Create the store
const storeInstance = makeStore();

// Export store and persistor
export const store = typeof window === 'undefined' ? storeInstance : storeInstance.store;
export const persistor = typeof window === 'undefined' ? null : storeInstance.persistor;
