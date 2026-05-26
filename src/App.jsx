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
import AnimalDetailPage from './pages/AnimalDetailPage';
import MapaPage from './pages/MapaPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { useAdminAuth } from './hooks/useAdminAuth';
import AdminAnimalDetailPage from './pages/AdminAnimalDetailPage';
import BannedPage from './pages/BannedPage';

function ProtectedRoute({ isAuthenticated, children }) {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function ProtectedAdminRoute({ children }) {
    const token = sessionStorage.getItem('adminToken');
    if (!token) return <Navigate to="/admin/login" replace />;
    return children;
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
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/banned" element={<BannedPage />} />
            

            {/* Rutas protegidas */}
            <Route
                path="/publicar"
                element={
                    <ProtectedRoute isAuthenticated={autenticado}>
                        <PublicarAnimalPage />
                    </ProtectedRoute>
                }
            />
            {/* Dashboar: para ver todas las publicaciones activas. */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute isAuthenticated={autenticado}>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            {/* Perfil del usuario. */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute isAuthenticated={autenticado}>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            {/* Cuestionario de estilo de vida. */}
            <Route
                path="/cuestionario"
                element={
                    <ProtectedRoute isAuthenticated={autenticado}>
                        <QuestionnairePage />
                    </ProtectedRoute>
                }
            />
            {/* edicion de publicaciones */}
            <Route
                path="/editar-animal/:idAnimal"
                element={
                    <ProtectedRoute isAuthenticated={autenticado}>
                        <EditarAnimalPage />
                    </ProtectedRoute>
                }
            />
            {/* Detalles de un animal. */}
            <Route
                path="/animales/:idAnimal"
                element={
                    <ProtectedRoute isAuthenticated={autenticado}>
                        <AnimalDetailPage />
                    </ProtectedRoute>
                }
            />
            {/* Ruta Mapa */}
            <Route
                path="/mapa"
                element={
                    <ProtectedRoute isAuthenticated={autenticado}>
                        <MapaPage />
                    </ProtectedRoute>
                }
            />
            {/* Panel de administracion. */}
            <Route
            path="/admin/dashboard"
            element={
                <ProtectedAdminRoute>
                    <AdminDashboardPage />
                </ProtectedAdminRoute>
            }
            />

            <Route
            path="/admin/animales/:idAnimal"
            element={
                <ProtectedAdminRoute>
                <AdminAnimalDetailPage />
                </ProtectedAdminRoute>
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