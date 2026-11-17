import { useMemo, useState } from 'react';
import { useApp } from '../../state/AppContext';
import { productosService } from '../../services/productosService';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';

export default function InventarioScreen() {
  const { state, dispatch } = useApp();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [cantidad, setCantidad] = useState('5');
  const products = useMemo(() => state.productos.filter(p => !p.archivado && p.nombre.toLowerCase().includes(query.toLowerCase())), [state.productos, query]);
  const replenish = async () => {
    const updated = await productosService.reponer(selected.id, cantidad, selected.costo, selected.vencimiento);
    dispatch({type:'SET_PRODUCTOS', payload: state.productos.map(p => p.id === updated.id ? updated : p)});
    setSelected(null);
  };
  return <div className="screen"><div className="screen__content">
    <header className="screen__header"><div><p>RF-03 · RF-05 · RF-23 · RF-24</p><h1>Inventario</h1></div><span>📦</span></header>
    <input className="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busca un producto" aria-label="Buscar producto" />
    <div className="stack">{products.map(product => {
      const low = product.stockActual <= product.stockMinimo;
      const expiring = product.vencimiento && (new Date(product.vencimiento) - new Date()) / 86400000 <= 7;
      return <div className="list-item" key={product.id}><div><h3>{product.nombre}</h3><p>{product.stockActual} disponibles · {product.vencimiento ? `vence ${product.vencimiento}` : 'sin vencimiento'}</p><div className="screen__actions">{low && <span className="pill pill--danger">Stock bajo</span>}{expiring && <span className="pill pill--warning">Vence pronto</span>}</div></div><Button variant="secondary" onClick={() => setSelected(product)}>Reponer</Button></div>;
    })}</div>
    {selected && <div className="surface stack"><h2>Reponer {selected.nombre}</h2><TextInput label="Cantidad" type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} /><Button onClick={replenish}>Guardar reposición</Button><Button variant="ghost" onClick={() => setSelected(null)}>Cancelar</Button></div>}
  </div></div>;
}
