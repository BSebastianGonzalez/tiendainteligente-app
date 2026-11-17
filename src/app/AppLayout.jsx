import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppLayout() {
  return (
    <div className="phone-frame">
      <Outlet />
      <BottomNav />
    </div>
  );
}
