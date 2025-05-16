// This is a server component
import { Provider } from 'react-redux';
import { store } from './store';
import { ClientPersistGate } from './client-provider';

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <ClientPersistGate>
        {children}
      </ClientPersistGate>
    </Provider>
  );
}
