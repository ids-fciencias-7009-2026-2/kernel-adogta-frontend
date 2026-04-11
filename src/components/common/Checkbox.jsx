const Checkbox = ({ 
  name, 
  checked, 
  onChange, 
  label, 
  linkText,
  onLinkClick,
  required = false,
  disabled = false,
  error
}) => {
  return (
    <div className="mb-4">
      <label className={`flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        {/* Checkbox personalizado */}
        <div className="relative inline-block">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className="absolute opacity-0 w-[18px] h-[18px] cursor-pointer z-[1] disabled:cursor-not-allowed"
            disabled={disabled}
          />
          <div className={`
            w-[18px] h-[18px] border-2 rounded mr-2.5 flex items-center justify-center transition-all duration-200
            ${checked 
              ? 'bg-adogta-secondary border-adogta-secondary' 
              : 'bg-white border-adogta-border'
            }
          `}>
            {checked && (
              <span className="text-white text-xs font-bold">✓</span>
            )}
          </div>
        </div>
        <span className={`text-xs ${disabled ? 'text-adogta-border' : 'text-adogta-primary'}`}>
          {label}
          {linkText && (
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onLinkClick?.();
              }}
              className="text-adogta-secondary no-underline font-medium"
            >
              {linkText}
            </a>
          )}
          {required && <span className="text-adogta-secondary ml-0.5">*</span>}
        </span>
      </label>
      {error && (
        <div className="text-adogta-secondary text-[11px] mt-1 ml-7">
          {error}
        </div>
      )}
    </div>
  );
};

export default Checkbox;