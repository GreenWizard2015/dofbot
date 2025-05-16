"use client";

import { createContext, useContext, useRef } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import robotReducer from './slices/robotSlice';

// Create a context to hold our store
const StoreContext = createContext(null);

// Configure persist
const persistConfig = {
  key: 'root',
  storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, robotReducer);

// Create the Redux store
const createReduxStore = () => {
  const store = configureStore({
    reducer: {
      robot: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
  });
  
  const persistor = persistStore(store);
  return { store, persistor };
};

// Provider component
export function ReduxProviderClient({ children }) {
  // Create the store only once using useRef
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = createReduxStore();
  }
  
  return (
    <StoreContext.Provider value={storeRef.current}>
      <Provider store={storeRef.current.store}>
        <PersistGate loading={null} persistor={storeRef.current.persistor}>
          {children}
        </PersistGate>
      </Provider>
    </StoreContext.Provider>
  );
}

// Hook to access the store
export function useStore() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a ReduxProviderClient');
  }
  return store;
}
