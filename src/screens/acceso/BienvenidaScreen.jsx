import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../state/AppContext';
import { sesionService } from '../../services/sesionService';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import Keypad from '../../components/Keypad';

export default function BienvenidaScreen() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [step, setStep] = useState('registro');
  const [form, setForm] = useState({nombre:'', tienda:'', celular:'', pin:''});
  const submit = async () => {
    const sesion = { ...form, pin: form.pin };
    await sesionService.guardar(sesion);
    dispatch({type:'SET_SESION', payload: sesion});
    navigate('/inicio');
  };
  return <div className="screen"><div className="screen__content">
    <div className="surface stack"><div style={{fontSize:'2.5rem'}}>🏪</div><h1>Bienvenido a TiendaInteligente</h1><p>Vende y lleva tus cuentas sin complicarte.</p>
    {step === 'registro' && <><TextInput label="Tu nombre" value={form.nombre} onChange={e => setForm({...form,nombre:e.target.value})} placeholder="Ej. Arturo" /><TextInput label="Nombre de la tienda" value={form.tienda} onChange={e => setForm({...form,tienda:e.target.value})} placeholder="Ej. La Esquina" /><TextInput label="Celular" type="tel" value={form.celular} onChange={e => setForm({...form,celular:e.target.value})} placeholder="300 000 0000" /><Button disabled={!form.nombre || !form.tienda || !form.celular} onClick={() => setStep('pin')}>Continuar</Button></>}
    {step === 'pin' && <><h2>Crea un PIN de 4 números</h2><div className="row"><span>PIN</span><strong>{'•'.repeat(form.pin.length)}</strong></div><Keypad value={form.pin} onChange={pin => setForm({...form,pin})} /><Button disabled={form.pin.length !== 4} onClick={submit}>Entrar a mi tienda</Button></>}
    </div>
  </div></div>;
}
