import { Link } from 'react-router-dom';
import { useApp } from '../../state/AppContext';
import { formatMoney } from '../../components/ProductCard';
import MoneyDisplay from '../../components/MoneyDisplay';
import Button from '../../components/Button';

export default function InicioScreen() {
  const { state, dispatch } = useApp();
  const ventasHoy = state.ventas.filter(v => !v.anulada && v.tipo !== 'abono' && new Date(v.fecha).toDateString() === new Date().toDateString());
  const total = ventasHoy.reduce((sum, venta) => sum + Number(venta.total || 0), 0);
  const ganancia = ventasHoy.reduce((sum, venta) => sum + (venta.items || []).reduce((itemSum, item) => itemSum + ((item.precio - (item.costo || 0)) * item.cantidad), 0), 0);
  const porVencer = state.productos.filter(p => p.vencimiento && (new Date(p.vencimiento) - new Date()) / 86400000 <= 7 && (new Date(p.vencimiento) - new Date()) >= 0);
  const stockBajo = state.productos.filter(p => p.stockActual <= p.stockMinimo);
  const pendientes = state.clientes.reduce((sum, c) => sum + Number(c.saldoFiado || 0), 0);
  const antiguos = state.clientes.filter(c => Number(c.saldoFiado || 0) > 0).sort((a, b) => String(a.creadoEn).localeCompare(String(b.creadoEn))).slice(0, 2);

  return <div className="screen"><div className="screen__content">
    <header className="screen__header"><div><p>Hola, Arturo</p><h1>Tu tienda hoy</h1></div><span aria-label="Conectado">🟢</span></header>
    <div className="surface"><div className="row"><Link to="/inicio/historial"><span>Ventas de hoy</span></Link><strong>{ventasHoy.length}</strong></div><MoneyDisplay value={total} label="Total vendido" /><Link to="/vender" className="button button--primary" style={{display:'inline-flex', alignItems:'center', justifyContent:'center', textDecoration:'none', marginTop:12}}>Nueva venta</Link></div>
    <div className="grid-2"><div className="surface"><MoneyDisplay value={ganancia} label="Ganancia est." /></div><div className="surface"><MoneyDisplay value={pendientes} label="Fiados pendientes" /></div></div>
    {(porVencer.length > 0 || stockBajo.length > 0) && <div className="alert"><strong>Revisa tu inventario</strong><p>{porVencer.length} por vencer · {stockBajo.length} con stock bajo</p><Link to="/inventario">Ver alertas</Link></div>}
    {state.ajustes.notificacionMatutina && antiguos.length > 0 && <div className="surface"><strong>Para hoy</strong><p>Recuerda estos fiados: {antiguos.map(c => c.nombre).join(', ')}.</p></div>}
    <div className="surface"><div className="row"><strong>Atajos</strong><div><Link to="/inicio/puntos">Puntos</Link> · <Link to="/inicio/ajustes">Ajustes</Link></div></div><div className="screen__actions" style={{marginTop:12}}><Button variant="secondary" onClick={() => dispatch({type:'SET_CONEXION', payload: !state.sinConexion})}>{state.sinConexion ? 'Conectar' : 'Simular sin conexión'}</Button></div></div>
  </div></div>;
}
