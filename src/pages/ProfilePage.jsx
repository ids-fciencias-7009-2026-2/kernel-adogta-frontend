import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import EditProfile from '../modals/EditProfile';
import { usuarioApi } from '../api/usuarioApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import perfilBackground from '../assets/Adogta_dashboard.png';

/**
 * Página de perfil de usuario
 * Muestra datos personales y permite editar o cerrar sesión
 */
const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Verifica token y carga los datos
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadUserData();
  }, [navigate]);

  /**
   * Carga los datos del usuario desde el backend
   */
  const loadUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await usuarioApi.getMe();
      setUser(userData);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('No se pudo cargar la información del usuario');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cierra sesión del usuario
   */
  const handleLogout = async () => {
    try {
      await usuarioApi.logout();
      navigate('/login');
    } catch (err) {
      console.error('Error during logout:', err);
      navigate('/login');
    }
  };

  /**
   * Actualiza los datos del usuario después de editar
   */
  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  // Pantalla de carga
  if (loading) {
    return <LoadingSpinner message="Cargando tu perfil..." />;
  }

  return (
    <>
      <AuthLayout 
        title="Mi Perfil"
        backgroundImage={perfilBackground}
        showBackButton={true}
        backPath="/dashboard"
      >
        {/* Tarjeta del perfil */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-[650px] w-full">
          
          {/* Avatar circular con la inicial del nombre */}
          <div className="bg-adogta-primary py-6 text-center rounded-t-2xl">
            <div className="w-20 h-20 bg-adogta-secondary rounded-full inline-flex items-center justify-center text-3xl font-bold text-white border-4 border-white shadow-md">
              {user?.nombres?.charAt(0)?.toUpperCase() || 
               user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>

          {/* Datos del usuario */}
          <div className="p-6">
            {/* Mensaje de error si existe */}
            {error && (
              <div className="bg-[#FEF2F0] text-adogta-secondary px-3 py-2.5 rounded-xl mb-6 text-[13px] text-center">
                {error}
              </div>
            )}
            
            {/* Lista de campos del perfil */}
            <div className="flex flex-col gap-2">
              {/* Nombre completo */}
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <label className="text-adogta-primary text-xs font-medium">Nombre completo</label>
                <p className="text-adogta-primary text-sm m-0 opacity-90">
                  {user?.nombres || user?.nombre || '—'} {user?.apellidoPaterno || ''} {user?.apellidoMaterno || ''}
                </p>
              </div>
              
              {/* Email */}
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <label className="text-adogta-primary text-xs font-medium">Correo electrónico</label>
                <p className="text-adogta-primary text-sm m-0 opacity-90">{user?.email || '—'}</p>
              </div>
              
              {/* Teléfono */}
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <label className="text-adogta-primary text-xs font-medium">Teléfono</label>
                <p className="text-adogta-primary text-sm m-0 opacity-90">{user?.telefono || '—'}</p>
              </div>
              
              {/* Código Postal */}
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <label className="text-adogta-primary text-xs font-medium">Código Postal</label>
                <p className="text-adogta-primary text-sm m-0 opacity-90">{user?.codigoPostal || '—'}</p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-center px-6 py-4 pb-6 border-t border-adogta-border bg-adogta-background rounded-b-2xl">
            <button 
              onClick={() => setShowEditModal(true)} 
              className="bg-adogta-secondary text-white rounded-full px-6 py-2 text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-orange-600 hover:scale-105 active:scale-95 flex-1 max-w-[180px]"
            >
              Editar Perfil
            </button>
            <button 
              onClick={handleLogout} 
              className="bg-red-600 text-white rounded-full px-6 py-2 text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-red-700 hover:scale-105 active:scale-95 flex-1 max-w-[180px]"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </AuthLayout>

      {/* Modal para editar perfil */}
      <EditProfile 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        userData={user}
        onUpdate={handleUpdateProfile}
      />
    </>
  );
};

export default ProfilePage;