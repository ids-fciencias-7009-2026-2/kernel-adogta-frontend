const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false,
  variant = 'primary',
  fullWidth = false,
  loading = false,
  icon
}) => {
  // Clases base
  const baseClasses = "transition-all duration-300 font-semibold cursor-pointer rounded-full px-6 py-2 text-sm"
  
  const variants = {
    primary: "bg-adogta-secondary text-adogta-white hover:bg-orange-500 hover:scale-105 active:scale-95",
    secondary: "border border-adogta-border text-adogta-primary hover:bg-adogta-background hover:border-adogta-secondary hover:scale-102",
    danger: "bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95"
  }
  
  // Estado deshabilitado o cargando
  const stateClasses = (disabled || loading) 
    ? "bg-adogta-border text-adogta-primary cursor-not-allowed opacity-70 hover:scale-100" 
    : variants[variant]
  
  const widthClass = fullWidth ? "w-full" : "w-auto"

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${stateClasses} ${widthClass}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {loading ? 'Cargando...' : children}
    </button>
  );
};

export default Button;