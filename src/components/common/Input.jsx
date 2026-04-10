const Input = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  type = 'text',
  disabled = false,
  maxLength,
  icon,
  error
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1.5 font-medium text-adogta-primary text-xs">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
          {required && <span className="text-adogta-secondary ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-3 py-1.5 text-sm text-adogta-primary bg-white 
          border rounded-xl outline-none transition-all duration-200
          ${error 
            ? 'border-adogta-secondary' 
            : 'border-adogta-border hover:border-adogta-secondary'
          }
          focus:border-adogta-secondary focus:ring-2 focus:ring-adogta-secondary/20 focus:scale-[1.01]
          disabled:bg-adogta-border disabled:cursor-not-allowed disabled:opacity-70
        `}
        disabled={disabled}
        maxLength={maxLength}
      />
      {error && (
        <div className="text-adogta-secondary text-[11px] mt-1 ml-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;