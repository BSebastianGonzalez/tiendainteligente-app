import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './state/AppContext';
import AppRouter from './app/AppRouter';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <AppRouter />
    </AppProvider>
  </React.StrictMode>
);
