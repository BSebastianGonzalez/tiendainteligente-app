import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

export default function ErrorScreen() {
  const navigate = useNavigate();
  return <div className="screen"><div className="screen__content"><div className="surface stack"><div style={{fontSize:'3rem'}}>😕</div><h1>Algo no salió bien</h1><p>Guarda lo que puedas y vuelve a intentar. Si el problema sigue, pide ayuda.</p><Button onClick={() => navigate('/inicio')}>Volver al inicio</Button><Button variant="secondary" onClick={() => window.open('https://wa.me/573000000000?text=Necesito%20ayuda%20con%20un%20error', '_blank')}>Pedir ayuda</Button></div></div></div>;
}
