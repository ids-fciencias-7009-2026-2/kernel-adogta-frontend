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
 * Componente que protege rutas que requieren autenticación.
 * Redirige al login si el usuario no está autenticado.
 *
 * @component
 * @param {boolean} isAuthenticated - Si el usuario está autenticado.
 * @param {JSX.Element} children - Componente a renderizar si está autenticado.
 * @returns {JSX.Element}
 */
function ProtectedRoute({ isAuthenticated, children }) {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

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
    const autenticado = isAuthenticated();

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
                    <ProtectedRoute isAuthenticated={autenticado}>
                        <PublicarAnimalPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute isAuthenticated={autenticado}>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute isAuthenticated={autenticado}>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/cuestionario"
                element={
                    <ProtectedRoute isAuthenticated={autenticado}>
                        <QuestionnairePage />
                    </ProtectedRoute>
                }
            />

            {/* Ruta raíz (dashboard o login dependiendo de si está autenticado) */}
            <Route
                path="/"
                element={
                    autenticado
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