/**
 * Layout para páginas públicas (login, register) - sin header ni footer
 * @param {ReactNode} children - Contenido de la página
 * @param {string} backgroundImage - Imagen de fondo
 */
const PublicLayout = ({ children, backgroundImage }) => {
    return (
      <div 
        className="fixed inset-0 flex flex-col items-center justify-center p-5 bg-cover bg-center bg-no-repeat overflow-auto"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Capa oscura sobre el fondo */}
        <div className="fixed inset-0 bg-black/50 z-[1]"></div>
        
        {/* Contenido (login/register) */}
        {children}
      </div>
    );
  };
  
  export default PublicLayout;