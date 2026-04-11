import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

/**
 * Componente de rutas.
 * 
 * Define las rutas públicas y protegidas del sistema.
 */
function App() {

  /**
   * Verifica si el usuario está autenticado.
   * 
   * @returns {boolean} true si el usuario tiene un token, false en caso contrario.
   */
  const isAuthenticated = () => {
    const token = sessionStorage.getItem('token');
    return token !== null && token !== '';
  };

  /**
   * Componente para rutas protegidas.
   * Redirige al login si el usuario no está autenticado.
   * 
   * @param {Object} props - Propiedades del componente
   * @param {React.ReactNode} props.children - Componente a renderizar si está autenticado
   * @returns {JSX.Element} la página protegida o redirige al login.
   */
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        {/* Rutas públicas: No requeren credenciales */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rutas protegidas: requeren una sesión. */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        /<Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        
        {/* Ruta por defecto: dashboard si está autenticado; eoc: al login */}
        <Route 
          path="/" 
          element={
            isAuthenticated() 
              ? <Navigate to="/dashboard" replace /> 
              : <Navigate to="/login" replace />
          } 
        />
        
        {/* Ruta para 404.*/}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;