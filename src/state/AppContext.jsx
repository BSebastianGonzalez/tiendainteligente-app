import { createContext, useContext, useReducer, useEffect } from 'react';
import { appReducer, initialState } from './appReducer';
import { seed } from '../data/seed';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Carga datos de localStorage o seed inicial
    const productos = JSON.parse(localStorage.getItem('ti_productos') || 'null') || seed.productos;
    const ventas = JSON.parse(localStorage.getItem('ti_ventas') || '[]');
    const clientes = JSON.parse(localStorage.getItem('ti_clientes') || '[]');
    const sesion = JSON.parse(localStorage.getItem('ti_sesion') || 'null');
    dispatch({ type: 'LOAD_DATA', payload: { productos, ventas, clientes, sesion } });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
}
