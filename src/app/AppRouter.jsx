import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './AppLayout';
import BienvenidaScreen from '../screens/acceso/BienvenidaScreen';
import InicioScreen from '../screens/inicio/InicioScreen';
import VenderScreen from '../screens/vender/VenderScreen';
import InventarioScreen from '../screens/inventario/InventarioScreen';
import FiadosScreen from '../screens/fiados/FiadosScreen';
import SinConexionScreen from '../screens/estados/SinConexionScreen';

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/bienvenida" element={<BienvenidaScreen />} />
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/inicio" replace />} />
          <Route path="/inicio" element={<InicioScreen />} />
          <Route path="/vender" element={<VenderScreen />} />
          <Route path="/inventario" element={<InventarioScreen />} />
          <Route path="/fiados" element={<FiadosScreen />} />
          <Route path="/sin-conexion" element={<SinConexionScreen />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
