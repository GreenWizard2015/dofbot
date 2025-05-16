import { configureStore } from '@reduxjs/toolkit';
import robotReducer from './slices/robotSlice';

// Create a simple store without persistence for server-side rendering
export const store = configureStore({
  reducer: {
    robot: robotReducer,
  },
});

// Only create persistor on the client side
export let persistor = null;

// This code only runs on the client
if (typeof window !== 'undefined') {
  const { persistStore, persistReducer } = require('redux-persist');
  const storage = require('redux-persist/lib/storage').default;

  // Rehydrate the store on the client side
  const persistConfig = {
    key: 'root',
    storage,
    // You can blacklist specific reducers if you don't want to persist them
    // blacklist: ['someReducer']
  };

  // Manually apply the persisted state to our store
  persistor = persistStore(store);
}
