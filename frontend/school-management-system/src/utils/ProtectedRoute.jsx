import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles, allowedRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const allowed = allowedRoles ?? (allowedRole ? [allowedRole] : undefined);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (allowed && !allowed.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // All good
  return <Outlet />;
};

export default ProtectedRoute;