import { seed } from '../data/seed';
import { read, write } from './storageService';

const KEY = 'productos';
export const productosService = {
  async listar() {
    const guardados = read(KEY, null);
    if (guardados) return guardados;
    write(KEY, seed.productos);
    return seed.productos;
  },
  async crear(prod) {
    const lista = await this.listar();
    const nuevo = { ...prod, id: `p${Date.now()}`, archivado: false };
    lista.push(nuevo);
    write(KEY, lista);
    return nuevo;
  },
  async actualizar(id, cambios) {
    const lista = await this.listar();
    const idx = lista.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Producto no encontrado');
    lista[idx] = { ...lista[idx], ...cambios };
    write(KEY, lista);
    return lista[idx];
  },
  async archivar(id) {
    return this.actualizar(id, { archivado: true });
  },
  async reponer(id, cantidad, costo, vencimiento) {
    const lista = await this.listar();
    const idx = lista.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Producto no encontrado');
    const actual = lista[idx];
    lista[idx] = {
      ...actual,
      stockActual: Number(actual.stockActual || 0) + Number(cantidad),
      costo: Number(costo || actual.costo || 0),
      vencimiento: vencimiento || actual.vencimiento,
    };
    write(KEY, lista);
    return lista[idx];
  },
  async ajustarStock(id, delta) {
    const lista = await this.listar();
    const idx = lista.findIndex(producto => producto.id === id);
    if (idx === -1) throw new Error('Producto no encontrado');
    const nuevoStock = Number(lista[idx].stockActual || 0) + Number(delta);
    if (nuevoStock < 0) throw new Error('No hay suficiente stock');
    lista[idx] = { ...lista[idx], stockActual: nuevoStock };
    write(KEY, lista);
    return lista[idx];
  },
};
