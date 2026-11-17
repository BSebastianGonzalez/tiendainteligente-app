import { useApp } from '../../state/AppContext';
import { dayKey } from '../../services/storageService';

export default function PanelInternoScreen() {
  const { state } = useApp();
  const dias = new Set(state.eventos.map(evento => evento.fecha.slice(0, 10)));
  const ventas = state.eventos.filter(evento => evento.tipo === 'venta');
  return <div className="screen"><div className="screen__content"><header className="screen__header"><div><p>RF-43 · solo demo local</p><h1>Panel interno</h1></div><span>📊</span></header><div className="grid-2"><div className="surface"><strong>{ventas.length}</strong><p>ventas registradas</p></div><div className="surface"><strong>{dias.size}</strong><p>días activos</p></div></div><div className="surface"><strong>Hoy: {dayKey()}</strong><p>Este panel usa los eventos guardados en el celular para la demo.</p></div></div></div>;
}
