import './components.css';

export default function TextInput({ label, value, onChange, placeholder, type = 'text', ...props }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input value={value} onChange={onChange} placeholder={placeholder} type={type} {...props} />
    </label>
  );
}
