import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/Adogta_logo.png';

const Header = ({ 
  showBackButton = false, 
  backPath = '/dashboard',
  buttons = [],
  title
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Construir iniciales a partir del nombre y apellido paterno
  const iniciales = user
    ? (user.nombres?.charAt(0) || '') + (user.apellidoPaterno?.charAt(0) || '')
    : '';

  // Indicador visual si el cuestionario no se ha completado
  const mostrarIndicador = user && !user.envioFormulario;

  return (
    <header className="bg-white px-8 py-3 flex justify-between items-center shadow-sm border-b border-adogta-border relative z-10">
      {/* Logo y título */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Adogta" className="h-10 w-auto" />
        <span className="text-xl font-bold text-adogta-primary">
          {title || 'Adogta'}
        </span>
      </div>
      
      {/* Botones de la derecha */}
      <div className="flex gap-4 items-center">
        {/* Botón Volver */}
        {showBackButton && (
          <button
            onClick={() => navigate(backPath)}
            className="bg-transparent text-adogta-primary border border-adogta-border rounded-full px-4 py-1.5 text-sm cursor-pointer hover:bg-adogta-background hover:border-adogta-secondary transition-all"
          >
            ← Volver
          </button>
        )}
        
        {/* Botones dinámicos (se mantienen) */}
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className={`
              rounded-full px-4 py-1.5 text-sm font-semibold cursor-pointer transition-all duration-300
              ${button.variant === 'primary' 
                ? 'bg-adogta-secondary text-white hover:bg-orange-600 hover:scale-105' 
                : 'bg-transparent text-adogta-primary border border-adogta-border hover:bg-adogta-background hover:border-adogta-secondary'
              }
            `}
          >
            {button.icon && <span className="mr-2">{button.icon}</span>}
            {button.label}
          </button>
        ))}

        {/* Círculo de perfil con iniciales */}
        {user && (
          <div className="relative">
            <button
              onClick={() => navigate('/profile')}
              title="Mi Perfil"
              className="
                w-8 h-8 rounded-full bg-adogta-secondary text-white font-bold text-xs uppercase
                flex items-center justify-center
                hover:scale-105 transition-transform
              "
            >
              {iniciales}
            </button>
            {mostrarIndicador && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-adogta-secondary rounded-full border-2 border-white" />
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;