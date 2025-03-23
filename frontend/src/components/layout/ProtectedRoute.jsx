import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';

/**
 * A route wrapper that protects routes based on authentication status and user roles
 * 
 * @param {Object} props 
 * @param {String} props.requiredRole - Role required to access the route
 * @param {React.ReactNode} props.children - The components to render if access is granted
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  
  // If still loading, don't do anything
  if (loading) {
    return null;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If no specific role is required, allow any authenticated user
  if (!requiredRole) {
    return children;
  }
  
  // Check if user has the required role
  if (user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user's role
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  // If authenticated and role matches or no specific role required, render children
  return children;
};

export default ProtectedRoute; 