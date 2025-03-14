// File: src/main.tsx (example)

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/store';
import { OrgProvider } from './contexts/OrgContext';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
        <OrgProvider>
        <App />
        </OrgProvider>  
        </BrowserRouter>
      </PersistGate>
    </Provider>
  
);
