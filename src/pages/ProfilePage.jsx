import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import EditProfile from '../modals/EditProfile';
import { usuarioApi } from '../api/usuarioApi';
import { formularioApi } from '../api/formularioApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import perfilBackground from '../assets/Adogta_dashboard.png';
import Campo from '../components/common/Campo';
import QuestionnaireModal from '../modals/QuestionnaireModal';
import { preguntasCuestionario } from '../utils/questionnaire';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorCuestionario, setErrorCuestionario] = useState('');
  const [showCuestionario, setShowCuestionario] = useState(false);
  const [ultimoFormulario, setUltimoFormulario] = useState(null);
  const [cargandoFormulario, setCargandoFormulario] = useState(false);
  const [validandoCuestionario, setValidandoCuestionario] = useState(false);
  const [puedeActualizar, setPuedeActualizar] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeSection, setActiveSection] = useState('datos');

  // Carga de datos.
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadUserData();
  }, [navigate]);

  const loadUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await usuarioApi.getMe();
      setUser(userData);
    } catch (err) {
      setError('No se pudo cargar la información del usuario');
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // Cargamos la última respuesta al formulario por parte del usuario.
  useEffect(() => {
    if (activeSection === 'cuestionario' && user?.envioFormulario && !ultimoFormulario) {
      setCargandoFormulario(true);
      formularioApi.obtenerUltimo()
        .then(data => setUltimoFormulario(data))
        .catch(() => {})
        .finally(() => setCargandoFormulario(false));
    }
  }, [activeSection, user, ultimoFormulario]);

  // CHecamos si puede actualizar el cuestionario
  useEffect(() => {
    if (activeSection === 'cuestionario' && user?.envioFormulario) {
      setValidandoCuestionario(true);
      formularioApi.puedeResponder()
        .then(() => {
          setPuedeActualizar(true);
          setErrorCuestionario('');
        })
        .catch((err) => {
          if (err.response?.status === 409) {
            setPuedeActualizar(false);
            const mensaje = err.response?.data?.error || err.response?.data?.mensaje;
            setErrorCuestionario(mensaje || 'Aún no ha pasado un año desde tu último cuestionario.');
          } else {
            setErrorCuestionario('No se pudo validar el cuestionario. Intenta nuevamente.');
          }
        })
        .finally(() => setValidandoCuestionario(false));
    }
  }, [activeSection, user]);

  //logout.
  const handleLogout = async () => {
    try {
      await usuarioApi.logout();
      navigate('/login');
    } catch (err) {
      navigate('/login');
    }
  };

  const handleUpdateProfile = (updatedUser) => setUser(updatedUser);

  const handleGoToQuestionnaire = async () => {
    setShowCuestionario(true);
  };

  if (loading) return <LoadingSpinner message="Cargando tu perfil..." />;

  //panel izquierdo de items.
  const menuItems = [
    { key: 'datos', label: 'Mis Datos' },
    { key: 'cuestionario', label: 'Cuestionario' },
    { key: 'publicaciones', label: 'Publicaciones' },
  ];

  //render del panel derecho y lo que se muestra en cada caso.
  const renderSection = () => {
    switch (activeSection) {
      //datos del usuario.
      case 'datos':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-adogta-primary">Mis Datos</h2>
            {error && (
              <div className="bg-adogta-error text-adogta-secondary px-3 py-2.5 rounded-xl text-[13px] text-center">
                {error}
              </div>
            )}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
              <Campo label="Nombre completo" valor={`${user?.nombres || '—'} ${user?.apellidoPaterno || ''} ${user?.apellidoMaterno || ''}`} />
              <Campo label="Correo electrónico" valor={user?.email || '—'} />
              <Campo label="Teléfono" valor={user?.telefono || '—'} />
              <Campo label="Código Postal" valor={user?.codigoPostal || '—'} />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowEditModal(true)} className="bg-adogta-secondary text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-orange-600 transition-colors">
                Editar Perfil
              </button>
              <button onClick={handleLogout} className="bg-red-600 text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-red-700 transition-colors">
                Cerrar Sesión
              </button>
            </div>
          </div>
        );

      //manejo del cuestionario.
      case 'cuestionario':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-adogta-primary">Cuestionario</h2>
            {user?.envioFormulario ? (
              cargandoFormulario ? (
                <p className="text-adogta-primary text-sm">Cargando respuestas...</p>
              ) : ultimoFormulario ? (
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                  <p className="text-adogta-primary text-sm">
                    Completaste el cuestionario el{' '}
                    <strong>{new Date(ultimoFormulario.fechaEnvio).toLocaleDateString('es-MX', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}</strong>.
                  </p>
                  <div className="space-y-2">
                    <h3 className="text-adogta-primary font-semibold text-sm">Tus respuestas:</h3>
                    {preguntasCuestionario.map((pregunta) => {
                      const valorBackend = ultimoFormulario[pregunta.id];
                      const opcion = pregunta.options.find(o => o.value === valorBackend);
                      const etiqueta = opcion?.label || valorBackend;
                      return (
                        <div key={pregunta.id} className="flex justify-between text-sm border-b border-gray-100 py-1">
                          <span className="text-adogta-primary/80">{pregunta.label}</span>
                          <span className="text-adogta-primary font-medium">
                            {etiqueta}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {puedeActualizar ? (
                    <button
                      onClick={handleGoToQuestionnaire}
                      className="bg-adogta-primary text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-adogta-secondary transition-colors"
                    >
                      Actualizar cuestionario
                    </button>
                  ) : (
                    errorCuestionario && (
                      <div className="bg-adogta-error text-adogta-secondary px-4 py-2 rounded-xl text-[13px] text-center border border-adogta-secondary/30">
                        {errorCuestionario}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
                  <p className="text-adogta-primary text-sm">Ya completaste el cuestionario de adopción.</p>
                  {puedeActualizar && (
                    <button onClick={handleGoToQuestionnaire} className="bg-adogta-primary text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-adogta-secondary transition-colors">
                      Actualizar cuestionario
                    </button>
                  )}
                </div>
              )
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
                <p className="text-adogta-primary text-sm">Aún no has completado el cuestionario de adopción.</p>
                <button
                  onClick={handleGoToQuestionnaire}
                  className="bg-adogta-secondary text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-orange-600 transition-colors"
                >
                  Completar cuestionario
                </button>
              </div>
            )}
          </div>
        );

      //publicaciones del usuario.
      case 'publicaciones':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-adogta-primary">Publicaciones</h2>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-adogta-primary text-sm">Próximamente</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <AuthLayout
        title="Mi Perfil"
        backgroundImage={perfilBackground}
        showBackButton={true}
        backPath="/dashboard"
      >
        <div className="flex w-full max-w-6xl gap-8 items-start self-start">
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl shadow-sm p-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors
                    ${activeSection === item.key ? 'bg-adogta-secondary text-white' : 'text-adogta-primary hover:bg-adogta-background'}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="flex-1">
            {renderSection()}
          </main>
        </div>
      </AuthLayout>

      {/**Modal de editar perfil */}
      <EditProfile 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        userData={user} 
        onUpdate={handleUpdateProfile}
      />
      
      {/**Modal de contestra cuestionario */}
      <QuestionnaireModal
        isOpen={showCuestionario}
        onClose={() => setShowCuestionario(false)}
        onSuccess={() => {
          loadUserData();
          setUltimoFormulario(null);
          setPuedeActualizar(false);
        }}
      />
    </>
  );
};

export default ProfilePage;