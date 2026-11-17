const KEY = 'ti_productos';
export const productosService = {
  async listar() {
    return JSON.parse(localStorage.getItem(KEY) || 'null') || [];
  },
  async crear(prod) {
    const lista = await this.listar();
    const nuevo = { ...prod, id: `p${Date.now()}`, archivado: false };
    lista.push(nuevo);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return nuevo;
  },
  async actualizar(id, cambios) {
    const lista = await this.listar();
    const idx = lista.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Producto no encontrado');
    lista[idx] = { ...lista[idx], ...cambios };
    localStorage.setItem(KEY, JSON.stringify(lista));
    return lista[idx];
  },
  async archivar(id) {
    return this.actualizar(id, { archivado: true });
  },
};
