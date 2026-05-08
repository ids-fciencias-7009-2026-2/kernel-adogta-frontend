import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import QuestionnairePage from './pages/QuestionnairePage';
import { useAuth } from './hooks/useAuth';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PublicarAnimalPage from "./pages/PublicarAnimalPage";


/**
 * Define y organiza las rutas de la aplicación.
 *
 * Se encarga de:
 * - Proteger rutas que requieren autenticación
 * - Redirigir al usuario según su estado de autenticación
 *
 * @component
 * @returns {JSX.Element} El sistema de rutas.
 */
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Rutas protegidas */}
      <Route
        path="/publicar"
        element={
          <ProtectedRoute>
            <PublicarAnimalPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cuestionario"
        element={
          <ProtectedRoute>
            <QuestionnairePage />
          </ProtectedRoute>
        }
      />

      {/* Ruta raíz (dashboard o login dependiendo de si está autenticado) */}
      <Route
        path="/"
        element={
          isAuthenticated()
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

      {/* En caso de 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/**
 * Componente principal.
 *
 * Es el punto de entrada del sistema de rutas.
 * Se encarga de envolver las rutas en el Router.
 *
 * @component
 * @returns {JSX.Element} La aplicación (con su sistema de rutas configurado).
 */
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
