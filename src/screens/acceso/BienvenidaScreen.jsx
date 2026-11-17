import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../state/AppContext';
import { sesionService } from '../../services/sesionService';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import Keypad from '../../components/Keypad';

export default function BienvenidaScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [step, setStep] = useState(state.sesion ? 'ingreso' : 'registro');
  const [form, setForm] = useState({nombre:'', tienda:'', celular:'', pin:''});
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState('');
  const submit = async () => {
    if (!acepta) return;
    const sesion = { ...form, pin: form.pin };
    await sesionService.guardar(sesion);
    dispatch({type:'SET_SESION', payload: sesion});
    navigate('/onboarding');
  };
  const ingresar = async () => {
    const valido = await sesionService.validarPin(form.pin);
    if (!valido) return setError('Ese PIN no coincide. Inténtalo otra vez.');
    dispatch({type:'SET_SESION', payload: await sesionService.obtener()});
    navigate('/inicio');
  };
  return <div className="screen"><div className="screen__content">
    <div className="surface stack"><div style={{fontSize:'2.5rem'}}>🏪</div><h1>Bienvenido a TiendaInteligente</h1><p>Vende y lleva tus cuentas sin complicarte.</p>
    {step === 'registro' && <><TextInput label="Tu nombre" value={form.nombre} onChange={e => setForm({...form,nombre:e.target.value})} placeholder="Ej. Arturo" /><TextInput label="Nombre de la tienda" value={form.tienda} onChange={e => setForm({...form,tienda:e.target.value})} placeholder="Ej. La Esquina" /><TextInput label="Celular" type="tel" value={form.celular} onChange={e => setForm({...form,celular:e.target.value})} placeholder="300 000 0000" /><Button disabled={!form.nombre || !form.tienda || !form.celular} onClick={() => setStep('pin')}>Continuar</Button></>}
    {step === 'registro' && <><label className="row" style={{alignItems:'flex-start'}}><input type="checkbox" checked={acepta} onChange={e => setAcepta(e.target.checked)} /><span>Acepto los términos y la política de tratamiento de datos.</span></label><p className="field__label">Tus datos se guardan en este celular para que puedas trabajar sin internet.</p><Button variant="ghost" onClick={() => setStep('ingreso')}>Ya tengo una cuenta</Button></>}
    {step === 'pin' && <><h2>Crea un PIN de 4 números</h2><div className="row"><span>PIN</span><strong>{'•'.repeat(form.pin.length)}</strong></div><Keypad value={form.pin} onChange={pin => setForm({...form,pin})} /><Button disabled={form.pin.length !== 4 || !acepta} onClick={submit}>Entrar a mi tienda</Button></>}
    {step === 'ingreso' && <><h2>Ingresa con tu PIN</h2><div className="row"><span>PIN</span><strong>{'•'.repeat(form.pin.length)}</strong></div><Keypad value={form.pin} onChange={pin => { setError(''); setForm({...form,pin}); }} /><Button disabled={form.pin.length !== 4} onClick={ingresar}>Entrar</Button>{error && <div className="alert">{error}</div>}<Button variant="ghost" onClick={() => navigate('/recuperar')}>Olvidé mi PIN</Button><Button variant="ghost" onClick={() => setStep('registro')}>Crear cuenta</Button></>}
    </div>
  </div></div>;
}
