import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../state/AppContext';
import { appService } from '../../services/appService';
import { sesionService } from '../../services/sesionService';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';

export default function AjustesScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [tienda, setTienda] = useState(state.sesion?.tienda || '');
  const [mensaje, setMensaje] = useState('');
  const guardar = async () => { await appService.guardarAjustes({ tienda, textoScale: state.textoScale }); dispatch({type:'SET_AJUSTES', payload:{tienda}}); setMensaje('Guardamos tus cambios.'); };
  const salir = async () => { await sesionService.cerrar(); dispatch({type:'SET_SESION', payload:null}); navigate('/bienvenida'); };
  const respaldo = async () => { const data = await appService.crearRespaldo(); await navigator.clipboard?.writeText(JSON.stringify(data)); setMensaje('Respaldo copiado. Guárdalo en un lugar seguro.'); };
  const restaurar = async event => { const file = event.target.files?.[0]; if (!file) return; try { const data = JSON.parse(await file.text()); await appService.restaurarRespaldo(data); setMensaje('Respaldo restaurado. Recarga la app para verlo.'); } catch { setMensaje('Ese archivo no parece un respaldo válido.'); } };
  return <div className="screen"><div className="screen__content"><header className="screen__header"><div><h1>Ajustes</h1></div><span>⚙️</span></header><div className="surface stack"><TextInput label="Nombre de la tienda" value={tienda} onChange={e => setTienda(e.target.value)} /><Button onClick={guardar}>Guardar datos</Button><div className="row"><span>Tamaño de letra</span><select value={state.textoScale} onChange={e => { const value = Number(e.target.value); appService.guardarAjustes({textoScale:value}); dispatch({type:'SET_AJUSTES', payload:{textoScale:value}}); }}><option value="1">Normal</option><option value="1.15">Grande</option><option value="1.3">Extra grande</option></select></div><div className="row"><span>Ventana de vencimiento</span><select value={state.ajustes.ventanaVencimiento} onChange={e => { const value = Number(e.target.value); appService.guardarAjustes({ventanaVencimiento:value}); dispatch({type:'SET_AJUSTES', payload:{ventanaVencimiento:value}}); }}><option value="7">7 días</option><option value="15">15 días</option><option value="30">30 días</option></select></div><Button variant="secondary" onClick={() => window.open('https://wa.me/573000000000?text=Necesito%20ayuda%20con%20TiendaInteligente', '_blank')}>Pedir ayuda por WhatsApp</Button><Button variant="secondary" onClick={respaldo}>Crear respaldo local</Button><label className="button button--secondary">Restaurar respaldo<input type="file" accept="application/json" onChange={restaurar} hidden /></label><p className="field__label">Los cambios se guardan en este celular y se pueden sincronizar cuando vuelva la conexión.</p><Button variant="danger" onClick={salir}>Cerrar sesión</Button>{mensaje && <p className="alert">{mensaje}</p>}</div></div></div>;
}
