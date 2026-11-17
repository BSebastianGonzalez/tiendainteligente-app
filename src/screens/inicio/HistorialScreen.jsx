import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { ventasService } from '../../services/ventasService';
import { productosService } from '../../services/productosService';
import { clientesService } from '../../services/clientesService';
import { formatMoney } from '../../components/ProductCard';
import Button from '../../components/Button';

export default function HistorialScreen() {
  const { state, dispatch } = useApp();
  const [dia, setDia] = useState('');
  const ventas = state.ventas.filter(venta => venta.tipo !== 'abono' && !venta.anulada && (!dia || venta.fecha.slice(0, 10) === dia));
  const anular = async (venta) => {
    if (!window.confirm('¿Quieres anular esta venta? Se devolverá el stock.')) return;
    await ventasService.anular(venta.id);
    for (const item of venta.items || []) await productosService.ajustarStock(item.id, item.cantidad);
    if (venta.clienteId) {
      const cliente = state.clientes.find(c => c.id === venta.clienteId);
      if (cliente) await clientesService.registrarMovimiento(cliente.id, { delta: -Number(venta.parteFiada || venta.total) });
    }
    dispatch({ type: 'SET_VENTAS', payload: state.ventas.map(item => item.id === venta.id ? { ...item, anulada: true } : item) });
  };
  return <div className="screen"><div className="screen__content"><header className="screen__header"><div><h1>Historial de ventas</h1></div><span>🧾</span></header><input className="search" type="date" value={dia} onChange={e => setDia(e.target.value)} />{!ventas.length ? <div className="empty"><strong>No hay ventas en este día</strong><span>Cuando registres una, aparecerá aquí.</span></div> : <div className="stack">{ventas.map(venta => <div className="list-item" key={venta.id}><div><h3>{venta.tipo === 'rapida' ? 'Venta rápida' : 'Venta de contado'}</h3><p>{new Date(venta.fecha).toLocaleString('es-CO')} · {(venta.items || []).length} productos</p></div><div className="stack" style={{alignItems:'flex-end'}}><strong>{formatMoney(venta.total)}</strong><Button variant="danger" onClick={() => anular(venta)}>Anular</Button></div></div>)}</div>}</div></div>;
}
