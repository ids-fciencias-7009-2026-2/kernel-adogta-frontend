import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { adminApi } from '../api/adminApi';
import { useAdminAuth } from '../hooks/useAdminAuth';
import dashboardBg from '../assets/Adogta_dashboard.png';

/**
 * Panel de administración: lista de reportes.
 * Las acciones de moderación se realizan desde la página de detalle del animal.
 */
const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { admin, loading: authLoading } = useAdminAuth();   // Sesión del admin
  const [reportes, setReportes] = useState([]);             // Lista de reportes
  const [cargando, setCargando] = useState(true);           // Estado de carga inicial
  const [error, setError] = useState('');                   // Error.

  // Carga los reportes inmediatamente al montar.
  useEffect(() => {
    cargarReportes();
  }, []);

  // Obtiene la lista de reportes con listarReportes.
  const cargarReportes = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await adminApi.listarReportes();
      setReportes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar reportes');
    } finally {
      setCargando(false);
    }
  };

  // Cerrar la sesión del administrador
  const handleLogout = async () => {
    await adminApi.logout();
    navigate('/admin/login');
  };

  // Pantalla de carga
  if (authLoading || cargando) return <LoadingSpinner message="Cargando panel..." />;

  return (
    <AuthLayout
      title="Panel de Administración"
      backgroundImage={dashboardBg}
      buttons={[
        { label: 'Cerrar sesión', onClick: handleLogout, variant: 'secondary' }
      ]}
    >
      <div className="w-full max-w-5xl space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-adogta-primary mb-4">
            Reportes pendientes
          </h1>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          {/* En caso de no haber reportes. */}
          {reportes.length === 0 ? (
            <p className="text-adogta-primary text-sm">No hay reportes pendientes.</p>
          ) : (
            /* Tabla de reportes */
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-adogta-border text-adogta-primary text-sm">
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Publicación</th>
                    <th className="py-2 px-3">Motivo</th>
                    <th className="py-2 px-3">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.map((reporte) => (
                    <tr key={reporte.idReporte} className="border-b border-gray-100 text-sm">
                      <td className="py-2 px-3 text-adogta-primary">{reporte.idReporte}</td>
                      <td className="py-2 px-3">
                        {/* Enlace a la página de detalleAnimal del administrador */}
                        <a
                          href={`/admin/animales/${reporte.idAnimal}?reporte=${reporte.idReporte}`}
                          className="text-adogta-secondary underline hover:text-orange-600"
                        >
                          {reporte.nombreAnimal} (#{reporte.idPublicacion})
                        </a>
                      </td>
                      <td className="py-2 px-3 text-adogta-primary">{reporte.motivo}</td>
                      <td className="py-2 px-3 text-adogta-primary">
                        {new Date(reporte.fecha).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default AdminDashboardPage;