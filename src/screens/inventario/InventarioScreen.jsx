import { useMemo, useState } from 'react';
import { useApp } from '../../state/AppContext';
import { appService } from '../../services/appService';
import { productosService } from '../../services/productosService';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';

const blank = { nombre: '', precio: '', costo: '', unidad: 'unidad', stockActual: 0, stockMinimo: 1, vencimiento: '' };

export default function InventarioScreen() {
  const { state, dispatch } = useApp();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(blank);
  const [cantidad, setCantidad] = useState('5');
  const [tab, setTab] = useState('lista');
  const [mostrarSugerencia, setMostrarSugerencia] = useState(true);
  const products = useMemo(() => state.productos.filter(p => !p.archivado && p.nombre.toLowerCase().includes(query.toLowerCase())), [state.productos, query]);
  const windowDays = Number(state.ajustes.ventanaVencimiento || 7);
  const isExpiring = product => product.vencimiento && (new Date(product.vencimiento) - new Date()) / 86400000 <= windowDays && new Date(product.vencimiento) >= new Date();
  const openEdit = product => { setSelected(product); setForm({ ...product }); setTab('form'); };
  const save = async () => {
    if (!form.nombre || !form.precio) return;
    const updated = selected ? await productosService.actualizar(selected.id, { ...form, precio: Number(form.precio), costo: Number(form.costo || 0), stockActual: Number(form.stockActual), stockMinimo: Number(form.stockMinimo) }) : await productosService.crear({ ...form, precio: Number(form.precio), costo: Number(form.costo || 0), stockActual: Number(form.stockActual), stockMinimo: Number(form.stockMinimo) });
    dispatch({ type: 'SET_PRODUCTOS', payload: selected ? state.productos.map(p => p.id === updated.id ? updated : p) : [...state.productos, updated] });
    await appService.sumarInventario();
    setSelected(null); setForm(blank); setTab('lista');
  };
  const replenish = async () => {
    const updated = await productosService.reponer(selected.id, cantidad, selected.costo, selected.vencimiento);
    dispatch({ type: 'SET_PRODUCTOS', payload: state.productos.map(p => p.id === updated.id ? updated : p) });
    await appService.sumarInventario();
    setSelected(null); setTab('lista');
  };
  const adjust = async (delta) => {
    try {
      const updated = await productosService.ajustarStock(selected.id, delta);
      dispatch({ type: 'SET_PRODUCTOS', payload: state.productos.map(p => p.id === updated.id ? updated : p) });
      await appService.sumarInventario();
      setSelected(updated);
    } catch (error) { window.alert(error.message); }
  };
  if (tab === 'form') return <div className="screen"><div className="screen__content"><header className="screen__header"><div><p>RF-19 · RF-20</p><h1>{selected ? 'Editar producto' : 'Nuevo producto'}</h1></div></header><div className="surface stack"><TextInput label="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} /><TextInput label="Precio de venta" type="number" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} /><TextInput label="Costo de compra" type="number" value={form.costo} onChange={e => setForm({ ...form, costo: e.target.value })} /><TextInput label="Unidad" value={form.unidad} onChange={e => setForm({ ...form, unidad: e.target.value })} /><TextInput label="Stock actual" type="number" value={form.stockActual} onChange={e => setForm({ ...form, stockActual: e.target.value })} /><TextInput label="Stock mínimo" type="number" value={form.stockMinimo} onChange={e => setForm({ ...form, stockMinimo: e.target.value })} /><TextInput label="Vencimiento (opcional)" type="date" value={form.vencimiento || ''} onChange={e => setForm({ ...form, vencimiento: e.target.value })} /><Button onClick={save}>Guardar producto</Button><Button variant="ghost" onClick={() => setTab('lista')}>Cancelar</Button></div></div></div>;
  return <div className="screen"><div className="screen__content">
    <header className="screen__header"><div><p>RF-03 · RF-04 · RF-05 · RF-19 a RF-24</p><h1>Inventario</h1></div><span>📦</span></header>
    <div className="screen__actions"><Button onClick={() => { setSelected(null); setForm(blank); setTab('form'); }}>Agregar producto</Button><input className="search" style={{flex:1}} value={query} onChange={e => setQuery(e.target.value)} placeholder="Busca un producto" aria-label="Buscar producto" /></div>
    <div className="stack">{products.map(product => { const low = product.stockActual <= product.stockMinimo; const expiring = isExpiring(product); return <div className="list-item" key={product.id}><button className="button button--ghost" style={{padding:0, minHeight:0, textAlign:'left'}} onClick={() => { setSelected(product); setForm({ ...product }); }}><h3>{product.nombre}</h3><p>{product.stockActual} {product.unidad} · mínimo {product.stockMinimo}</p><div className="screen__actions">{low && <span className="pill pill--danger">Stock bajo</span>}{expiring && <span className="pill pill--warning">Vence pronto</span>}<span className="pill">Sugerencia disponible</span></div></button><Button variant="secondary" onClick={() => openEdit(product)}>Editar</Button></div>; })}</div>
    {selected && <div className="surface stack"><div className="row"><h2>{selected.nombre}</h2><Button variant="ghost" onClick={() => setSelected(null)}>Cerrar</Button></div>{mostrarSugerencia && <div className="alert"><strong>Sugerencia de marca</strong><p>Pregunta por una presentación familiar de este producto para tu próxima compra.</p><Button variant="ghost" onClick={() => setMostrarSugerencia(false)}>Descartar</Button></div>}<p>{selected.costo ? 'Ganancia calculada con costo registrado.' : 'Falta costo: la ganancia no se suma.'}</p><div className="screen__actions"><Button variant="secondary" onClick={() => adjust(-1)}>− 1</Button><strong>{selected.stockActual}</strong><Button variant="secondary" onClick={() => adjust(1)}>+ 1</Button></div><TextInput label="Cantidad a reponer" type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} /><Button onClick={replenish}>Reponer mercancía</Button><Button variant="danger" onClick={async () => { await productosService.archivar(selected.id); dispatch({ type:'SET_PRODUCTOS', payload: state.productos.map(p => p.id === selected.id ? {...p, archivado:true} : p) }); setSelected(null); }}>Archivar producto</Button></div>}
  </div></div>;
}
