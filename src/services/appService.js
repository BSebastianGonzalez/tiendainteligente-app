import { dayKey, now, read, write } from './storageService';

export const appService = {
  async registrarEvento(tipo, payload = {}) {
    const eventos = read('eventos', []);
    eventos.push({ id: `e${Date.now()}`, tipo, payload, fecha: now() });
    write('eventos', eventos.slice(-500));
    return eventos[eventos.length - 1];
  },
  async obtenerPuntos() {
    return read('puntos', { total: 0, dias: {}, inventarioActualizado: {} });
  },
  async sumarVenta() {
    const puntos = await this.obtenerPuntos();
    const dia = dayKey();
    const actuales = Number(puntos.dias[dia] || 0);
    puntos.dias[dia] = Math.min(30, actuales + 1);
    puntos.total += actuales < 30 ? 1 : 0;
    write('puntos', puntos);
    return puntos;
  },
  async sumarInventario() {
    const puntos = await this.obtenerPuntos();
    const dia = dayKey();
    if (!puntos.inventarioActualizado[dia]) {
      puntos.inventarioActualizado[dia] = true;
      puntos.total += 5;
      write('puntos', puntos);
    }
    return puntos;
  },
  async guardarAjustes(ajustes) {
    return write('ajustes', { ...read('ajustes', {}), ...ajustes });
  },
  async leerAjustes() {
    return read('ajustes', { textoScale: 1, ventanaVencimiento: 7, notificacionMatutina: true });
  },
  async crearRespaldo() {
    return {
      productos: read('productos', []),
      ventas: read('ventas', []),
      clientes: read('clientes', []),
      sesion: read('sesion', null),
      puntos: read('puntos', { total: 0 }),
      exportadoEn: now(),
    };
  },
  async restaurarRespaldo(respaldo) {
    ['productos', 'ventas', 'clientes', 'sesion', 'puntos'].forEach(key => {
      if (respaldo[key] !== undefined) write(key, respaldo[key]);
    });
    return true;
  },
};
