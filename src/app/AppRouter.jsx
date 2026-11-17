import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './AppLayout';
import BienvenidaScreen from '../screens/acceso/BienvenidaScreen';
import OnboardingScreen from '../screens/acceso/OnboardingScreen';
import RecuperarScreen from '../screens/acceso/RecuperarScreen';
import InicioScreen from '../screens/inicio/InicioScreen';
import HistorialScreen from '../screens/inicio/HistorialScreen';
import PuntosScreen from '../screens/inicio/PuntosScreen';
import AjustesScreen from '../screens/inicio/AjustesScreen';
import VenderScreen from '../screens/vender/VenderScreen';
import InventarioScreen from '../screens/inventario/InventarioScreen';
import FiadosScreen from '../screens/fiados/FiadosScreen';
import SinConexionScreen from '../screens/estados/SinConexionScreen';
import ErrorScreen from '../screens/estados/ErrorScreen';
import PanelInternoScreen from '../screens/interno/PanelInternoScreen';

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/bienvenida" element={<BienvenidaScreen />} />
        <Route path="/recuperar" element={<RecuperarScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/inicio" replace />} />
          <Route path="/inicio" element={<InicioScreen />} />
          <Route path="/inicio/historial" element={<HistorialScreen />} />
          <Route path="/inicio/puntos" element={<PuntosScreen />} />
          <Route path="/inicio/ajustes" element={<AjustesScreen />} />
          <Route path="/vender" element={<VenderScreen />} />
          <Route path="/inventario" element={<InventarioScreen />} />
          <Route path="/fiados" element={<FiadosScreen />} />
          <Route path="/sin-conexion" element={<SinConexionScreen />} />
          <Route path="/error" element={<ErrorScreen />} />
          <Route path="/interno" element={<PanelInternoScreen />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
