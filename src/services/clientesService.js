import { seed } from '../data/seed';
import { dayKey, now, read, write } from './storageService';

const KEY = 'clientes';
export const clientesService = {
  async listar() {
    const clientes = read(KEY, null);
    if (clientes) return clientes;
    return write(KEY, seed.clientes);
  },
  async crear(cliente) {
    const lista = await this.listar();
    const nuevo = { ...cliente, id: `c${Date.now()}`, saldoFiado: 0, creadoEn: dayKey() };
    lista.push(nuevo);
    write(KEY, lista);
    return nuevo;
  },
  async actualizar(id, cambios) {
    const lista = await this.listar();
    const idx = lista.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Cliente no encontrado');
    lista[idx] = { ...lista[idx], ...cambios };
    write(KEY, lista);
    return lista[idx];
  },
  async eliminar(id) {
    const lista = await this.listar();
    const actualizada = lista.filter(cliente => cliente.id !== id);
    write(KEY, actualizada);
    return actualizada;
  },
  async registrarMovimiento(id, movimiento) {
    const lista = await this.listar();
    const idx = lista.findIndex(cliente => cliente.id === id);
    if (idx === -1) throw new Error('Cliente no encontrado');
    lista[idx] = { ...lista[idx], saldoFiado: Math.max(0, Number(lista[idx].saldoFiado || 0) + Number(movimiento.delta || 0)), actualizadoEn: now() };
    write(KEY, lista);
    return lista[idx];
  },
};
