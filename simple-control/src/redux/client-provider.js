"use client";

import { useEffect, useState } from 'react';
import { persistor } from './store';

export function ClientPersistGate({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During first render, don't render children to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  // Once mounted on client, render children directly if persistor isn't ready yet
  if (!persistor) {
    return <>{children}</>;
  }

  // Once persistor is ready, use PersistGate
  const PersistGate = require('redux-persist/integration/react').PersistGate;
  return (
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  );
}
