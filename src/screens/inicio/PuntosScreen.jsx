import { useApp } from '../../state/AppContext';
import { seed } from '../../data/seed';
import { formatMoney } from '../../components/ProductCard';
import Button from '../../components/Button';
import { appService } from '../../services/appService';
import { useState } from 'react';

export default function PuntosScreen() {
  const { state } = useApp();
  const [mensaje, setMensaje] = useState('');
  const solicitar = async premio => { await appService.registrarEvento('canje', { premioId: premio.id, puntos: premio.puntos }); setMensaje(`Registramos tu solicitud de ${premio.nombre}.`); };
  return <div className="screen"><div className="screen__content"><header className="screen__header"><div><p>RF-11 · RF-37</p><h1>Mis puntos</h1></div><span>⭐</span></header><div className="surface"><strong style={{fontSize:'2.25rem'}}>{state.puntos.total || 0}</strong><p>puntos acumulados</p></div>{mensaje && <div className="alert">{mensaje}</div>}<div className="stack">{seed.premios.map(premio => <div className="list-item" key={premio.id}><div><h3>{premio.nombre}</h3><p>{premio.descripcion}</p></div><div className="stack" style={{alignItems:'flex-end'}}><strong>{premio.puntos} puntos</strong><Button variant="secondary" disabled={(state.puntos.total || 0) < premio.puntos} onClick={() => solicitar(premio)}>Solicitar canje</Button></div></div>)}</div><p className="field__label">Ganas 1 punto por venta (máximo 30 al día) y 5 por actualizar inventario.</p></div></div>;
}
