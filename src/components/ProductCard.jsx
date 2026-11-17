import './components.css';

export default function ProductCard({ product, selected = false, onClick }) {
  return (
    <button type="button" className={`product-card${selected ? ' product-card--selected' : ''}`} onClick={onClick}>
      <span className="product-card__emoji" aria-hidden="true">🛍️</span>
      <strong>{product.nombre}</strong>
      <span className="product-card__price">{formatMoney(product.precio)}</span>
      <span className="product-card__stock">{product.stockActual} disponibles</span>
      {selected && <span className="product-card__count">✓</span>}
    </button>
  );
}

export function formatMoney(value) {
  return `$ ${Number(value || 0).toLocaleString('es-CO')}`;
}
