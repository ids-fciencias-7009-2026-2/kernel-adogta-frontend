const LoadingSpinner = ({ message = 'Cargando...', fullScreen = true }) => {
  // Estilos según si es pantalla completa o no
  const containerClasses = fullScreen 
    ? "fixed inset-0 flex flex-col justify-center items-center bg-adogta-background z-[1000]"
    : "flex flex-col justify-center items-center p-8"

  return (
    <div className={containerClasses}>
      {/* Spinner animado */}
      <div className="w-12 h-12 border-4 border-adogta-border border-t-adogta-secondary rounded-full animate-spin"></div>
      
      {/* Mensaje debajo */}
      <p className="mt-4 text-adogta-primary">{message}</p>
    </div>
  );
};

export default LoadingSpinner;