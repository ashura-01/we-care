// routes/ProtectedRoutes.js
import { Navigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children, redirectIfAuthenticated = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (redirectIfAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  if (!redirectIfAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};