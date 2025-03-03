import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];  // Specify the type for allowedRoles
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const userString = localStorage.getItem('usr');
  const user = userString ? JSON.parse(userString) : null;

  // Verifica si el usuario está autenticado y tiene el rol permitido
  if (!user) {
    return <Navigate to="/login" replace />;
  } else if (!allowedRoles.includes(user.tipo_usuario)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
