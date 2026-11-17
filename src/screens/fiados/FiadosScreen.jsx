import { useMemo, useState } from 'react';
import { useApp } from '../../state/AppContext';
import { clientesService } from '../../services/clientesService';
import { ventasService } from '../../services/ventasService';
import { appService } from '../../services/appService';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import MoneyDisplay from '../../components/MoneyDisplay';

const blank = { nombre: '', celular: '', limiteFiado: '' };

export default function FiadosScreen() {
  const { state, dispatch } = useApp();
  const [selected, setSelected] = useState(null);
  const [abono, setAbono] = useState('');
  const [form, setForm] = useState(blank);
  const [creating, setCreating] = useState(false);
  const clients = useMemo(() => state.clientes.filter(c => !c.archivado), [state.clientes]);
  const history = selected ? state.ventas.filter(v => v.clienteId === selected.id && !v.anulada) : [];
  const saveClient = async () => {
    if (!form.nombre.trim()) return;
    const cliente = selected ? await clientesService.actualizar(selected.id, form) : await clientesService.crear(form);
    dispatch({ type:'SET_CLIENTES', payload: selected ? state.clientes.map(c => c.id === cliente.id ? cliente : c) : [...state.clientes, cliente] });
    setSelected(cliente); setCreating(false); setForm(blank);
  };
  const pay = async () => {
    const amount = Math.min(Number(abono), Number(selected.saldoFiado || 0));
    if (!amount) return;
    const movimiento = await ventasService.abonar(selected.id, amount);
    const updated = await clientesService.registrarMovimiento(selected.id, { delta: -amount });
    dispatch({type:'SET_CLIENTES', payload: state.clientes.map(c => c.id === updated.id ? updated : c)});
    dispatch({type:'SET_VENTAS', payload: [...state.ventas, movimiento]});
    await appService.registrarEvento('fiado', { clienteId: selected.id, tipo: 'abono', monto: amount });
    setSelected(updated); setAbono('');
  };
  const undoAbono = async movimiento => {
    if (!window.confirm('¿Anular este abono?')) return;
    await ventasService.anular(movimiento.id);
    const updated = await clientesService.registrarMovimiento(selected.id, { delta: Number(movimiento.total) });
    dispatch({type:'SET_CLIENTES', payload: state.clientes.map(c => c.id === updated.id ? updated : c)});
    dispatch({type:'SET_VENTAS', payload: state.ventas.map(v => v.id === movimiento.id ? {...v, anulada:true} : v)});
    setSelected(updated);
  };
  const remind = channel => {
    const message = encodeURIComponent(`Hola ${selected.nombre}, te recuerdo con cariño que tienes un fiado pendiente de $ ${Number(selected.saldoFiado || 0).toLocaleString('es-CO')} en la tienda.`);
    const url = channel === 'sms' ? `sms:${selected.celular || ''}?body=${message}` : `https://wa.me/${selected.celular || ''}?text=${message}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  if (creating) return <div className="screen"><div className="screen__content"><div className="surface stack"><h1>{selected ? 'Editar cliente' : 'Nuevo cliente'}</h1><TextInput label="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre:e.target.value})} /><TextInput label="Celular (opcional)" value={form.celular} onChange={e => setForm({...form, celular:e.target.value})} /><TextInput label="Límite de fiado (opcional)" type="number" value={form.limiteFiado} onChange={e => setForm({...form, limiteFiado:e.target.value})} /><Button onClick={saveClient}>Guardar cliente</Button><Button variant="ghost" onClick={() => setCreating(false)}>Cancelar</Button></div></div></div>;
  return <div className="screen"><div className="screen__content">
    <header className="screen__header"><div><h1>Fiados</h1></div><Button variant="secondary" onClick={() => {setSelected(null); setCreating(true);}}>Nuevo cliente</Button></header>
    {!clients.length ? <div className="empty"><div style={{fontSize:'2rem'}}>📒</div><strong>Aún no tienes clientes</strong><span>Agrega un cliente cuando hagas una venta fiada.</span></div> : <div className="stack">{clients.map(client => <button type="button" className="list-item" key={client.id} onClick={() => setSelected(client)}><div style={{textAlign:'left'}}><h3>{client.nombre}</h3><p>{client.celular || 'Sin celular'} · desde {client.creadoEn || 'hoy'}</p></div><MoneyDisplay value={client.saldoFiado} /></button>)}</div>}
    {selected && <div className="surface stack"><div className="row"><div><h2>{selected.nombre}</h2><p>{selected.celular || 'Sin celular'}</p></div><Button variant="ghost" onClick={() => setSelected(null)}>Cerrar</Button></div><MoneyDisplay value={selected.saldoFiado} label="Pendiente" />{selected.limiteFiado && Number(selected.saldoFiado) > Number(selected.limiteFiado) && <div className="alert">Este fiado supera el límite que definiste.</div>}<TextInput label="Abono" type="number" value={abono} onChange={e => setAbono(e.target.value)} placeholder="Ej. 10000" /><Button onClick={pay}>Registrar abono</Button><div className="screen__actions"><Button variant="secondary" onClick={() => remind('whatsapp')}>WhatsApp</Button><Button variant="secondary" onClick={() => remind('sms')}>SMS</Button><Button variant="ghost" onClick={() => {setForm(selected); setCreating(true);}}>Editar cliente</Button></div><h3>Movimientos</h3>{history.length ? history.map(item => <div className="row" key={item.id}><span>{item.tipo === 'abono' ? 'Abono' : 'Venta fiada'}</span><div className="screen__actions"><strong>{item.tipo === 'abono' ? '-' : ''}{formatMoney(item.total)}</strong>{item.tipo === 'abono' && <Button variant="danger" onClick={() => undoAbono(item)}>Anular</Button>}</div></div>) : <p className="field__label">Aún no hay movimientos.</p>}</div>}
  </div></div>;
}

function formatMoney(value) { return `$ ${Number(value || 0).toLocaleString('es-CO')}`; }
