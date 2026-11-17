import './components.css';

export default function Keypad({ value = '', onChange, maxLength = 4 }) {
  const press = (key) => {
    if (key === '⌫') return onChange(value.slice(0, -1));
    if (value.length < maxLength) onChange(`${value}${key}`);
  };
  return (
    <div className="keypad" aria-label="Teclado numérico">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', ''].map((key, index) => (
        key ? <button type="button" key={key} className="keypad__key" onClick={() => press(key)}>{key}</button> : <span key={index} />
      ))}
    </div>
  );
}
