import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { clientesService } from '../../services/clientesService';
import { ventasService } from '../../services/ventasService';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import MoneyDisplay from '../../components/MoneyDisplay';

export default function FiadosScreen() {
  const { state, dispatch } = useApp();
  const [selected, setSelected] = useState(null);
  const [abono, setAbono] = useState('');
  const clients = state.clientes.filter(c => Number(c.saldoFiado || 0) > 0);
  const pay = async () => {
    const amount = Math.min(Number(abono), Number(selected.saldoFiado || 0));
    if (!amount) return;
    await ventasService.abonar(selected.id, amount);
    const updated = await clientesService.actualizar(selected.id, {saldoFiado: selected.saldoFiado - amount});
    dispatch({type:'SET_CLIENTES', payload: state.clientes.map(c => c.id === updated.id ? updated : c)});
    setSelected(updated); setAbono('');
  };
  const remind = (client) => {
    const text = encodeURIComponent(`Hola ${client.nombre}, te recuerdo con cariño que tienes un fiado pendiente de ${formatMoney(client.saldoFiado)} en la tienda.`);
    window.open(`https://wa.me/${client.celular || ''}?text=${text}`, '_blank', 'noopener,noreferrer');
  };
  return <div className="screen"><div className="screen__content">
    <header className="screen__header"><div><p>RF-06 · RF-07 · RF-10</p><h1>Fiados</h1></div><span>📒</span></header>
    {!clients.length ? <div className="empty"><div style={{fontSize:'2rem'}}>📒</div><strong>Aún no tienes fiados</strong><span>Cuando fíes una venta, aparecerá aquí.</span></div> : <div className="stack">{clients.map(client => <button type="button" className="list-item" key={client.id} onClick={() => setSelected(client)}><div style={{textAlign:'left'}}><h3>{client.nombre}</h3><p>{client.celular || 'Sin celular'}</p></div><MoneyDisplay value={client.saldoFiado} /></button>)}</div>}
    {selected && <div className="surface stack"><div className="row"><h2>{selected.nombre}</h2><Button variant="ghost" onClick={() => setSelected(null)}>Cerrar</Button></div><MoneyDisplay value={selected.saldoFiado} label="Pendiente" /><TextInput label="Abono" type="number" value={abono} onChange={e => setAbono(e.target.value)} placeholder="Ej. 10000" /><Button onClick={pay}>Registrar abono</Button><Button variant="secondary" onClick={() => remind(selected)}>Recordar por WhatsApp</Button></div>}
  </div></div>;
}

function formatMoney(value) { return `$ ${Number(value || 0).toLocaleString('es-CO')}`; }
