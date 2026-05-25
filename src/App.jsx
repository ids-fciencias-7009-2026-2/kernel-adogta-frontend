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
import EditarAnimalPage from './pages/EditarAnimalPage';
import MisSolicitudesPage from './pages/MisSolicitudesPage';
import AnimalDetailPage from './pages/AnimalDetailPage';

function ProtectedRoute({ isAuthenticated, children }) {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

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
            {/* NUEVA RUTA (de feature/edicion-publicaciones) */}
            <Route
                path="/editar-animal/:idAnimal"
                element={
                    <ProtectedRoute isAuthenticated={autenticado}>
                        <EditarAnimalPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/animales/:idAnimal"
                element={
                    <ProtectedRoute isAuthenticated={autenticado}>
                        <AnimalDetailPage />
                    </ProtectedRoute>
                }
            />

            {/* Ruta para checar las solicitudes de adopcion */ }
            <Route
                path="/mis-solicitudes"
                element={
                    <ProtectedRoute isAuthenticated={autenticado}>
                        <MisSolicitudesPage />
                    </ProtectedRoute>
                }
            />

            {/* Ruta raíz */}
            <Route
                path="/"
                element={
                    autenticado
                        ? <Navigate to="/dashboard" replace />
                        : <Navigate to="/login" replace />
                }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;