const KEY = 'ti_sesion';
export const sesionService = {
  async obtener() { return JSON.parse(localStorage.getItem(KEY) || 'null'); },
  async guardar(sesion) { localStorage.setItem(KEY, JSON.stringify(sesion)); return sesion; },
  async cerrar() { localStorage.removeItem(KEY); },
};
