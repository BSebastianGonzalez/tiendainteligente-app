import { createContext, useContext, useReducer, useEffect } from 'react';
import { appReducer, initialState } from './appReducer';
import { seed } from '../data/seed';
import { appService } from '../services/appService';
import { read, write } from '../services/storageService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    (async () => {
      // Carga datos de localStorage o seed inicial
      const productos = read('productos', readLegacy('productos', seed.productos));
      const ventas = read('ventas', readLegacy('ventas', []));
      const clientes = read('clientes', readLegacy('clientes', seed.clientes));
      const sesion = read('sesion', readLegacy('sesion', null));
      const ajustes = await appService.leerAjustes();
      const puntos = await appService.obtenerPuntos();
      const eventos = read('eventos', []);
      write('productos', productos);
      write('ventas', ventas);
      write('clientes', clientes);
      dispatch({ type: 'LOAD_DATA', payload: { productos, ventas, clientes, sesion, ajustes, puntos, eventos, textoScale: ajustes.textoScale } });
    })();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--text-scale', state.textoScale || 1);
  }, [state.textoScale]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

function readLegacy(key, fallback) {
  try {
    const value = localStorage.getItem(`ti_${key}`);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
}
