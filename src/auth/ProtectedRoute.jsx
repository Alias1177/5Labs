import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

/**
 * Защита роута: если пользователь не залогинен — отправляем на /login
 * и сохраняем исходный путь в state, чтобы после логина можно было
 * вернуть обратно (пока не используем, но пригодится).
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
