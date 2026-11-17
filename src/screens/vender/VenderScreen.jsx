import { useMemo, useState } from 'react';
import { useApp } from '../../state/AppContext';
import { productosService } from '../../services/productosService';
import { ventasService } from '../../services/ventasService';
import ProductCard from '../../components/ProductCard';
import MoneyDisplay from '../../components/MoneyDisplay';
import Button from '../../components/Button';

export default function VenderScreen() {
  const { state, dispatch } = useApp();
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [done, setDone] = useState(false);
  const products = useMemo(() => state.productos.filter(p => !p.archivado && p.nombre.toLowerCase().includes(query.toLowerCase())), [state.productos, query]);
  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const add = (product) => setCart((items) => {
    const found = items.find(item => item.id === product.id);
    if (found) return items.map(item => item.id === product.id ? {...item, cantidad: Math.min(item.cantidad + 1, product.stockActual)} : item);
    return [...items, {...product, cantidad: 1}];
  });
  const confirm = async () => {
    if (!cart.length) return;
    const venta = await ventasService.registrar({ tipo: 'contado', metodoPago: 'efectivo', total, items: cart });
    const productos = [...state.productos];
    for (const item of cart) {
      const actual = productos.find(p => p.id === item.id);
      const actualizado = await productosService.actualizar(item.id, { stockActual: actual.stockActual - item.cantidad });
      productos[productos.findIndex(p => p.id === item.id)] = actualizado;
    }
    dispatch({type:'SET_PRODUCTOS', payload: productos});
    dispatch({type:'SET_VENTAS', payload: [...state.ventas, venta]});
    dispatch({type:'SET_ULTIMA_OPERACION', payload: venta});
    setCart([]); setDone(true);
  };
  return <div className="screen"><div className="screen__content">
    <header className="screen__header"><div><p>RF-01 · RF-08</p><h1>Vender rápido</h1></div><span>💵</span></header>
    <input className="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busca un producto" aria-label="Buscar producto" />
    <div className="grid-2">{products.map(product => <ProductCard key={product.id} product={product} selected={cart.some(item => item.id === product.id)} onClick={() => add(product)} />)}</div>
    {cart.length > 0 && <div className="surface stack"><div className="row"><strong>Tu venta</strong><MoneyDisplay value={total} /></div>{cart.map(item => <div className="row" key={item.id}><span>{item.cantidad} × {item.nombre}</span><strong>{formatMoney(item.precio * item.cantidad)}</strong></div>)}<Button onClick={confirm}>Cobrar en efectivo</Button></div>}
    {done && <div className="alert" role="status"><strong>¡Venta registrada!</strong><p>Puedes deshacerla desde aquí durante 30 minutos.</p><Button variant="secondary" onClick={() => setDone(false)}>Listo</Button></div>}
  </div></div>;
}

function formatMoney(value) { return `$ ${Number(value || 0).toLocaleString('es-CO')}`; }
