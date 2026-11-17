import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useApp } from '../state/AppContext';

export default function AppLayout() {
  const { state } = useApp();
  return (
    <div className="phone-frame">
      {state.sinConexion && <div className="alert" style={{borderRadius:0, fontSize:'.875rem'}}>📴 Sin conexión · todo se guarda en tu celular</div>}
      <Outlet />
      <BottomNav />
    </div>
  );
}
