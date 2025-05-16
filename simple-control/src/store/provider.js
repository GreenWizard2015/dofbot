"use client";

import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { useEffect, useState } from 'react';

export function ReduxProvider({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // During server-side rendering, just use the Provider without PersistGate
  if (!isClient) {
    return <Provider store={store}>{children}</Provider>;
  }

  // On the client side, dynamically import PersistGate to avoid SSR issues
  const PersistGate = require('redux-persist/integration/react').PersistGate;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
