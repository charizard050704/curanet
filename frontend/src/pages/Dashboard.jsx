import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on user role
      if (user.role === 'patient') {
        navigate('/patient');
      } else if (user.role === 'hospital') {
        navigate('/hospital');
      }
    }
  }, [user, loading, navigate]);

  // Show loading while checking role
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return null; // This won't render as users will be redirected in the useEffect
};

export default Dashboard; 