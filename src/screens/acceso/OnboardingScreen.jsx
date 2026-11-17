import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

export default function OnboardingScreen() {
  const navigate = useNavigate();
  return <div className="screen access-screen"><div className="screen__content"><div className="surface stack access-card">
    <span style={{fontSize:'3rem'}}>👋</span><h1>Hagamos tu primera venta</h1>
    <p>Elige un producto, revisa el total y toca “Cobrar en efectivo”. Puedes corregir o deshacer si te equivocas.</p>
    <Button onClick={() => navigate('/vender')}>Probar una venta</Button>
    <Button variant="ghost" onClick={() => navigate('/inicio')}>Ir al inicio</Button>
  </div></div></div>;
}
