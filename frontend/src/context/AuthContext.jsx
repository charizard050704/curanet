import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Create the auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading] = useState(false); // Changed to false for dev purposes
  const [error, setError] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState(
    JSON.parse(localStorage.getItem('registeredUsers')) || []
  );
  
  const navigate = useNavigate();

  // TEMPORARY FOR DEVELOPMENT: Skip token verification
  useEffect(() => {
    // This is a mock implementation for development
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      setUser(JSON.parse(mockUser));
    }
  }, []);

  // eslint-disable-next-line no-unused-vars
  const login = async (username, password) => {
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check registered users first
      const registeredUser = registeredUsers.find(user => user.username === username);
      if (registeredUser) {
        const userData = {
          ...registeredUser,
          role: registeredUser.role || 'patient' // Default to patient if no role specified
        };
        
        const mockToken = `mock-token-${userData.role}`;
        localStorage.setItem('token', mockToken);
        localStorage.setItem('mockUser', JSON.stringify(userData));
        setToken(mockToken);
        setUser(userData);
        
        toast.success('Login successful');
        navigate(`/${userData.role}`);
        return true;
      }
      
      // If not found in registered users, check demo accounts
      if (username === 'patient') {
        const userData = {
          id: 1,
          username: 'patient',
          name: 'John Doe',
          email: 'patient@example.com',
          role: 'patient'
        };
        
        const mockToken = 'mock-token-patient';
        localStorage.setItem('token', mockToken);
        localStorage.setItem('mockUser', JSON.stringify(userData));
        setToken(mockToken);
        setUser(userData);
        
        toast.success('Login successful');
        navigate('/patient');
        return true;
      } 
      else if (username === 'doctor') {
        const userData = {
          id: 2,
          username: 'doctor',
          name: 'Dr. Sarah Johnson',
          email: 'doctor@example.com',
          role: 'doctor'
        };
        
        const mockToken = 'mock-token-doctor';
        localStorage.setItem('token', mockToken);
        localStorage.setItem('mockUser', JSON.stringify(userData));
        setToken(mockToken);
        setUser(userData);
        
        toast.success('Login successful');
        navigate('/doctor');
        return true;
      }
      else if (username === 'hospital') {
        const userData = {
          id: 3,
          username: 'hospital',
          name: 'City General Hospital',
          email: 'hospital@example.com',
          role: 'hospital'
        };
        
        const mockToken = 'mock-token-hospital';
        localStorage.setItem('token', mockToken);
        localStorage.setItem('mockUser', JSON.stringify(userData));
        setToken(mockToken);
        setUser(userData);
        
        toast.success('Login successful');
        navigate('/hospital');
        return true;
      }
      
      // If no match, show error
      const message = 'Invalid username or password';
      setError(message);
      toast.error(message);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.error || 'Login failed';
      setError(message);
      toast.error(message);
      return false;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if username already exists
      const userExists = registeredUsers.some(user => user.username === userData.username);
      if (userExists) {
        const message = 'Username already exists';
        setError(message);
        toast.error(message);
        return false;
      }
      
      // Add new user to registered users
      const newUser = {
        id: registeredUsers.length + 3, // Start from 3 since we have 2 demo users
        ...userData,
        role: userData.role || 'patient' // Default to patient if no role specified
      };
      
      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      toast.success('Registration successful. Please login.');
      navigate('/login');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.error || 'Registration failed';
      setError(message);
      toast.error(message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('mockUser');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // eslint-disable-next-line no-unused-vars
  const forgotPassword = async (email) => {
    setError(null);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password reset link sent to your email');
      return true;
    } catch (error) {
      console.error('Forgot password error:', error);
      const message = error.response?.data?.error || 'Failed to send reset link';
      setError(message);
      toast.error(message);
      return false;
    }
  };

  // eslint-disable-next-line no-unused-vars
  const resetPassword = async (token, newPassword) => {
    setError(null);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password has been reset successfully');
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      const message = error.response?.data?.error || 'Failed to reset password';
      setError(message);
      toast.error(message);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated: !!token,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 