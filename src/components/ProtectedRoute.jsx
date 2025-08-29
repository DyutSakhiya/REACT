// components/ProtectedRoute.jsx
import { useAuth } from './admin/context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { currentUser, token } = useAuth();
  
  if (!token || !currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

export default ProtectedRoute;