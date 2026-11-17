import { now, read, write } from './storageService';

const KEY = 'ventas';
export const ventasService = {
  async listar() {
    return read(KEY, []);
  },
  async registrar(venta) {
    const lista = await this.listar();
    const nueva = { ...venta, id: `v${Date.now()}`, fecha: now(), anulada: false };
    lista.push(nueva);
    write(KEY, lista);
    return nueva;
  },
  async anular(id) {
    const lista = await this.listar();
    const idx = lista.findIndex(v => v.id === id);
    if (idx === -1) throw new Error('Venta no encontrada');
    lista[idx] = { ...lista[idx], anulada: true };
    write(KEY, lista);
    return lista[idx];
  },
  async abonar(clienteId, monto) {
    const lista = await this.listar();
    const nueva = {
      id: `v${Date.now()}`,
      fecha: now(),
      tipo: 'abono',
      clienteId,
      total: Number(monto),
      anulada: false,
    };
    lista.push(nueva);
    write(KEY, lista);
    return nueva;
  },
  async registrarVentaRapida(total) {
    return this.registrar({ tipo: 'rapida', metodoPago: 'efectivo', total: Number(total), items: [] });
  },
  async registrarFiada(venta, clienteId, partePagada = 0) {
    return this.registrar({ ...venta, tipo: 'fiada', clienteId, partePagada, parteFiada: Number(venta.total) - Number(partePagada) });
  },
};
