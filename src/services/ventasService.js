const KEY = 'ti_ventas';
export const ventasService = {
  async listar() {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  },
  async registrar(venta) {
    const lista = await this.listar();
    const nueva = { ...venta, id: `v${Date.now()}`, fecha: new Date().toISOString(), anulada: false };
    lista.push(nueva);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return nueva;
  },
  async anular(id) {
    const lista = await this.listar();
    const idx = lista.findIndex(v => v.id === id);
    if (idx === -1) throw new Error('Venta no encontrada');
    lista[idx] = { ...lista[idx], anulada: true };
    localStorage.setItem(KEY, JSON.stringify(lista));
    return lista[idx];
  },
  async abonar(clienteId, monto) {
    const lista = await this.listar();
    const nueva = {
      id: `v${Date.now()}`,
      fecha: new Date().toISOString(),
      tipo: 'abono',
      clienteId,
      total: Number(monto),
      anulada: false,
    };
    lista.push(nueva);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return nueva;
  },
};
