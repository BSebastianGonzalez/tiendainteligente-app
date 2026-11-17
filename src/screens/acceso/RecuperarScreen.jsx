import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import Keypad from '../../components/Keypad';
import { sesionService } from '../../services/sesionService';

export default function RecuperarScreen() {
  const navigate = useNavigate();
  const [celular, setCelular] = useState('');
  const [codigo, setCodigo] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const enviar = () => { setEnviado(true); setMensaje('Te enviamos un código de prueba: 1234.'); };
  const confirmar = async () => {
    if (codigo !== '1234') return setMensaje('El código no coincide.');
    const sesion = await sesionService.obtener();
    if (!sesion || sesion.celular !== celular) return setMensaje('No encontramos una cuenta con ese celular.');
    setMensaje('Listo. Ahora puedes entrar con tu PIN.');
    navigate('/bienvenida');
  };
  return <div className="screen access-screen"><div className="screen__content"><div className="surface stack access-card"><h1>Recuperar acceso</h1><p>Te enviaremos un código por SMS (simulado).</p><TextInput label="Celular" value={celular} onChange={e => setCelular(e.target.value)} /><Button disabled={!celular} onClick={enviar}>Enviar código</Button>{enviado && <><p className="alert">{mensaje}</p><Keypad value={codigo} onChange={setCodigo} /><Button onClick={confirmar}>Confirmar código</Button></>}<Button variant="ghost" onClick={() => navigate('/bienvenida')}>Volver</Button></div></div></div>;
}
