import { useMemo, useState } from 'react';
import { useApp } from '../../state/AppContext';
import { clientesService } from '../../services/clientesService';
import { productosService } from '../../services/productosService';
import { ventasService } from '../../services/ventasService';
import { appService } from '../../services/appService';
import ProductCard, { formatMoney } from '../../components/ProductCard';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';

export default function VenderScreen() {
  const { state, dispatch } = useApp();
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [mode, setMode] = useState('contado');
  const [partePagada, setPartePagada] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', celular: '' });
  const [quickAmount, setQuickAmount] = useState('');
  const [lastSale, setLastSale] = useState(null);
  const products = useMemo(() => state.productos.filter(p => !p.archivado && p.nombre.toLowerCase().includes(query.toLowerCase())), [state.productos, query]);
  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const remaining = Math.max(0, total - Number(partePagada || 0));

  const add = (product) => setCart(items => {
    const found = items.find(item => item.id === product.id);
    if (found) return items.map(item => item.id === product.id ? { ...item, cantidad: Math.min(item.cantidad + 1, product.stockActual) } : item);
    return [...items, { ...product, cantidad: 1 }];
  });
  const remove = (id) => setCart(items => items.filter(item => item.id !== id));
  const changeQuantity = (id, delta) => setCart(items => items.map(item => item.id === id ? { ...item, cantidad: Math.max(1, Math.min(item.cantidad + delta, item.stockActual)) } : item));

  const createClientIfNeeded = async () => {
    if (clienteId !== 'new') return clienteId;
    if (!nuevoCliente.nombre.trim()) throw new Error('Escribe el nombre del cliente.');
    const cliente = await clientesService.crear(nuevoCliente);
    dispatch({ type: 'SET_CLIENTES', payload: [...state.clientes, cliente] });
    return cliente.id;
  };

  const confirm = async () => {
    try {
      if (mode === 'rapida') {
        const totalRapida = Number(quickAmount);
        if (!totalRapida) return;
        const venta = await ventasService.registrarVentaRapida(totalRapida);
        await appService.sumarVenta();
        await appService.registrarEvento('venta', { ventaId: venta.id, tipo: 'rapida', total: totalRapida });
        dispatch({ type: 'SET_VENTAS', payload: [...state.ventas, venta] });
        dispatch({ type: 'SET_PUNTOS', payload: await appService.obtenerPuntos() });
        setLastSale(venta);
        setQuickAmount('');
        return;
      }
      if (!cart.length) return;
      const ventaBase = { total, items: cart, metodoPago: mode === 'fiada' ? 'fiado' : mode === 'mixta' ? 'mixto' : 'efectivo' };
      const idCliente = mode === 'contado' ? null : await createClientIfNeeded();
      if (mode !== 'contado' && !idCliente) throw new Error('Elige o crea un cliente para dejar la venta fiada.');
      const venta = mode === 'contado' ? await ventasService.registrar({ ...ventaBase, tipo: 'contado' }) : await ventasService.registrarFiada(ventaBase, idCliente, mode === 'mixta' ? Number(partePagada || 0) : 0);
      const productos = [...state.productos];
      for (const item of cart) {
        const actualizado = await productosService.ajustarStock(item.id, -item.cantidad);
        productos[productos.findIndex(p => p.id === item.id)] = actualizado;
      }
      let clientes = state.clientes;
      if (idCliente) {
        const cliente = clientes.find(item => item.id === idCliente);
        const actualizado = await clientesService.registrarMovimiento(idCliente, { delta: mode === 'mixta' ? remaining : total });
        clientes = cliente ? clientes.map(item => item.id === idCliente ? actualizado : item) : [...clientes, actualizado];
        dispatch({ type: 'SET_CLIENTES', payload: clientes });
      }
      await appService.sumarVenta();
      await appService.registrarEvento('venta', { ventaId: venta.id, tipo: venta.tipo, total: venta.total });
      dispatch({ type: 'SET_PRODUCTOS', payload: productos });
      dispatch({ type: 'SET_VENTAS', payload: [...state.ventas, venta] });
      dispatch({ type: 'SET_PUNTOS', payload: await appService.obtenerPuntos() });
      setCart([]); setLastSale(venta); setPartePagada(''); setClienteId('');
    } catch (error) {
      window.alert(error.message);
    }
  };

  const undo = async () => {
    if (!lastSale || (Date.now() - new Date(lastSale.fecha).getTime()) > 30 * 60 * 1000) return;
    await ventasService.anular(lastSale.id);
    for (const item of lastSale.items || []) await productosService.ajustarStock(item.id, item.cantidad);
    if (lastSale.clienteId) await clientesService.registrarMovimiento(lastSale.clienteId, { delta: -(lastSale.parteFiada || lastSale.total) });
    dispatch({ type: 'SET_VENTAS', payload: state.ventas.map(item => item.id === lastSale.id ? { ...item, anulada: true } : item) });
    setLastSale(null);
  };

  return <div className="screen"><div className="screen__content">
    <header className="screen__header"><div><p>RF-01 · RF-02 · RF-08 · RF-25 · RF-26 · RF-29</p><h1>Vender rápido</h1></div><span>💵</span></header>
    <div className="mode-switch" aria-label="Tipo de venta"><Button className="mode-switch__button" variant={mode === 'contado' ? 'primary' : 'secondary'} onClick={() => setMode('contado')}>Contado</Button><Button className="mode-switch__button" variant={mode === 'fiada' ? 'primary' : 'secondary'} onClick={() => setMode('fiada')}>Fiada</Button><Button className="mode-switch__button" variant={mode === 'mixta' ? 'primary' : 'secondary'} onClick={() => setMode('mixta')}>Mixta</Button><Button className="mode-switch__button" variant={mode === 'rapida' ? 'primary' : 'secondary'} onClick={() => setMode('rapida')}>Por monto</Button></div>
    {mode === 'rapida' ? <div className="surface stack"><h2>Venta rápida</h2><TextInput label="¿Cuánto cobras?" type="number" value={quickAmount} onChange={e => setQuickAmount(e.target.value)} placeholder="Ej. 5000" /><Button onClick={confirm}>Cobrar en efectivo</Button></div> : <><label className="field"><span className="field__label">Busca y toca un producto para agregarlo</span><input className="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Ej. arroz" aria-label="Buscar producto" /></label><div className="grid-2">{products.map(product => <ProductCard key={product.id} product={product} selected={cart.some(item => item.id === product.id)} onClick={() => add(product)} />)}</div>{cart.length > 0 && <div className="surface stack"><div className="cart-summary"><strong className="cart-summary__title">Tu venta</strong><div className="cart-total"><span className="field__label">Total</span><strong>{formatMoney(total)}</strong></div></div><div className="cart-items">{cart.map(item => <div className="cart-item" key={item.id}><span className="cart-item__name">{item.nombre}</span><div className="quantity-control"><Button className="button--compact button--icon" variant="secondary" onClick={() => changeQuantity(item.id, -1)} aria-label={`Quitar una unidad de ${item.nombre}`}>−</Button><strong className="quantity-control__value">{item.cantidad}</strong><Button className="button--compact button--icon" variant="secondary" onClick={() => changeQuantity(item.id, 1)} aria-label={`Agregar una unidad de ${item.nombre}`}>+</Button></div><Button className="cart-item__remove" variant="ghost" onClick={() => remove(item.id)}>Quitar producto</Button></div>)}</div>{mode !== 'contado' && <><label className="field"><span className="field__label">Cliente</span><select value={clienteId} onChange={e => setClienteId(e.target.value)}><option value="">Elige un cliente</option>{state.clientes.map(cliente => <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>)}<option value="new">+ Cliente nuevo</option></select></label>{clienteId === 'new' && <><TextInput label="Nombre" value={nuevoCliente.nombre} onChange={e => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })} /><TextInput label="Celular (opcional)" value={nuevoCliente.celular} onChange={e => setNuevoCliente({ ...nuevoCliente, celular: e.target.value })} /></>}{mode === 'mixta' && <TextInput label="Parte pagada" type="number" value={partePagada} onChange={e => setPartePagada(e.target.value)} placeholder={`Resta ${formatMoney(total)}`} />}<p className="field__label">Queda fiado: {formatMoney(mode === 'mixta' ? remaining : total)}</p></>}<div className="cart-actions"><Button onClick={confirm}>{mode === 'contado' ? 'Cobrar en efectivo' : 'Guardar venta'}</Button></div></div>}</>}
    {lastSale && <div className="alert" role="status"><strong>¡Venta registrada!</strong><p>Puedes deshacerla durante 30 minutos.</p><Button variant="secondary" onClick={undo}>Deshacer</Button></div>}
  </div></div>;
}
