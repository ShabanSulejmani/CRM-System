import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const { user, isLoggedIn } = useAuth();

  // Om användaren inte är inloggad, omdirigera till inloggningssidan
  if (!isLoggedIn) {
    return <Navigate to="/staff/login" replace />;
  }

  // Om en specifik roll krävs och användaren inte har den, omdirigera till startsidan
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Om autentiserad och har krävd roll (eller ingen specifik roll krävs), rendera children
  return children;
}

export default ProtectedRoute;