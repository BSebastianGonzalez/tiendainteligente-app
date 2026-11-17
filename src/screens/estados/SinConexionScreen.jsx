import { useApp } from '../../state/AppContext';
import { appService } from '../../services/appService';
import { syncService } from '../../services/syncService';
import Button from '../../components/Button';

export default function SinConexionScreen() {
  const { state, dispatch } = useApp();
  const sincronizar = async () => { const result = await syncService.sincronizar(); await appService.registrarEvento('sincronizacion', result); dispatch({type:'SET_CONEXION', payload:false}); };
  return <div className="screen"><div className="screen__content"><div className="surface stack"><div style={{fontSize:'3rem'}}>📴</div><h1>{state.sinConexion ? 'Estás sin conexión' : 'Conexión disponible'}</h1><p>{state.sinConexion ? 'Puedes seguir vendiendo. Guardaremos los cambios en este celular.' : 'Tus datos están listos para sincronizarse.'}</p><Button onClick={sincronizar}>{state.sinConexion ? 'Seguir trabajando' : 'Sincronizar ahora'}</Button></div></div></div>;
}
