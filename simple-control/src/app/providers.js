"use client";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/redux-store';
import { useEffect, useState } from 'react';
import { ApiProvider } from '../api/ApiContext';
import { PositionQueueProvider } from '../api/PositionQueueContext';

export function Providers({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // On first server render, don't show children to avoid hydration mismatch
  if (!isClient) {
    // Return a placeholder with the same structure but no content
    return (
      <Provider store={store}>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </Provider>
    );
  }

  // Once on the client, render with PersistGate, ApiProvider, and PositionQueueProvider
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApiProvider>
          <PositionQueueProvider>
            {children}
          </PositionQueueProvider>
        </ApiProvider>
      </PersistGate>
    </Provider>
  );
}
