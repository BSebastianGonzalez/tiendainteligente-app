import { now, read, write } from './storageService';

export const syncService = {
  async encolar(tipo, payload) {
    const cola = read('cola_sync', []);
    cola.push({ id: `q${Date.now()}`, tipo, payload, creadoEn: now() });
    write('cola_sync', cola);
    return cola;
  },
  async pendientes() {
    return read('cola_sync', []);
  },
  async sincronizar() {
    const cola = await this.pendientes();
    write('ultima_sincronizacion', now());
    write('cola_sync', []);
    return { sincronizados: cola.length, fecha: now() };
  },
  async estado() {
    return { pendientes: (await this.pendientes()).length, ultima: read('ultima_sincronizacion', null) };
  },
};
