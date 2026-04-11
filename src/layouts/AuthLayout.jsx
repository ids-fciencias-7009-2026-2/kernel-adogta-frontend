import Header from './Header';
import Footer from './Footer';

/**
 * Layout para páginas autenticadas (con header y footer)
 * @param {ReactNode} children        - Contenido de la página
 * @param {string} title              - Título del header
 * @param {Array} buttons             - Botones del header
 * @param {boolean} showBackButton    - Muestra botón volver
 * @param {string} backPath           - Ruta del botón volver
 * @param {string} backgroundImage    - Imagen de fondo
 */
const AuthLayout = ({ 
  children, 
  title, 
  buttons = [], 
  showBackButton = false, 
  backPath = '/dashboard',
  backgroundImage 
}) => {
  return (
    <div 
      className="fixed inset-0 flex flex-col overflow-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Capa beige semitransparente sobre el fondo */}
      <div className="fixed inset-0 bg-adogta-background/85 z-[1]"></div>
      
      {/* Header */}
      <Header 
        title={title} 
        buttons={buttons}
        showBackButton={showBackButton}
        backPath={backPath}
      />
      
      {/* Contenido principal centrado */}
      <main className="flex-1 flex items-center justify-center p-8 relative z-10">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AuthLayout;}