import { buildInputClassName } from '../utils/classNames';

export function FormInput({
  id,
  type = 'text',
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  status = '',
  required = false,
  maxLength,
  disabled = false,
  size = 'lg',
}) {
  const inputClassName = buildInputClassName(size, status);

  return (
    <div className="mb-3">
      {label && <label htmlFor={id} className="form-label fw-bold">{label}</label>}
      <input
        type={type}
        className={inputClassName}
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        disabled={disabled}
      />
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
