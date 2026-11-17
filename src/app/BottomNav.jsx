import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const tabs = [
  { to: '/inicio', label: 'Inicio', icon: '🏠' },
  { to: '/vender', label: 'Vender', icon: '🛒' },
  { to: '/inventario', label: 'Inventario', icon: '📦' },
  { to: '/fiados', label: 'Fiados', icon: '📋' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {tabs.map(({ to, label, icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `bottom-nav__tab${isActive ? ' bottom-nav__tab--active' : ''}`}>
          <span className="bottom-nav__icon" aria-hidden="true">{icon}</span>
          <span className="bottom-nav__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
