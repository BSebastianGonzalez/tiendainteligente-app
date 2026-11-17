export const initialState = {
  productos: [],
  ventas: [],
  clientes: [],
  sesion: null,
  ultimaOperacion: null, // para deshacer (RF-08)
  textoScale: 1, // RF-45
  sinConexion: false,
  puntos: { total: 0 },
  ajustes: { textoScale: 1, ventanaVencimiento: 7, notificacionMatutina: true },
  eventos: [],
  ready: false,
};

export function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA': return { ...state, ...action.payload, ready: true };
    case 'SET_PRODUCTOS': return { ...state, productos: action.payload };
    case 'SET_VENTAS': return { ...state, ventas: action.payload };
    case 'SET_CLIENTES': return { ...state, clientes: action.payload };
    case 'SET_SESION': return { ...state, sesion: action.payload };
    case 'SET_ULTIMA_OPERACION': return { ...state, ultimaOperacion: action.payload };
    case 'SET_TEXTO_SCALE': return { ...state, textoScale: action.payload };
    case 'SET_CONEXION': return { ...state, sinConexion: action.payload };
    case 'SET_PUNTOS': return { ...state, puntos: action.payload };
    case 'SET_AJUSTES': return { ...state, ajustes: { ...state.ajustes, ...action.payload }, textoScale: action.payload.textoScale ?? state.textoScale };
    case 'SET_EVENTOS': return { ...state, eventos: action.payload };
    case 'RESET': return initialState;
    default: return state;
  }
}
