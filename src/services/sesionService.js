import { remove, read, write } from './storageService';

const KEY = 'sesion';
export const sesionService = {
  async obtener() { return read(KEY, null); },
  async guardar(sesion) {
    const dispositivo = read('dispositivo', null) || `d${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    write('dispositivo', dispositivo);
    return write(KEY, { ...sesion, dispositivo });
  },
  async cerrar() { remove(KEY); },
  async validarPin(pin) {
    const sesion = await this.obtener();
    return Boolean(sesion && sesion.pin === pin);
  },
};
