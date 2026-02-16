import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export const ProtectedRoute = ({ children }) => {
  const { user, isInitialized } = useAuthStore();
  const location = useLocation();

  if (!isInitialized) return null; // Wait for auth check

  if (!user) {
    // Redirect to login but save where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};