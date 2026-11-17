const KEY = 'ti_clientes';
export const clientesService = {
  async listar() { return JSON.parse(localStorage.getItem(KEY) || '[]'); },
  async crear(cliente) {
    const lista = await this.listar();
    const nuevo = { ...cliente, id: `c${Date.now()}`, saldoFiado: 0 };
    lista.push(nuevo);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return nuevo;
  },
  async actualizar(id, cambios) {
    const lista = await this.listar();
    const idx = lista.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Cliente no encontrado');
    lista[idx] = { ...lista[idx], ...cambios };
    localStorage.setItem(KEY, JSON.stringify(lista));
    return lista[idx];
  },
};
