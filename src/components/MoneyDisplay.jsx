import './components.css';
import { formatMoney } from './ProductCard';

export default function MoneyDisplay({ value, label }) {
  return (
    <div className="money-display">
      {label && <span className="money-display__label">{label}</span>}
      <strong>{formatMoney(value)}</strong>
    </div>
  );
}
