import { useContext, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import AuthContext from '../../context/AuthContext.jsx';
import useForm from '../../hooks/useForm';
import { validateResetPassword } from '../../utils/validation';

const ResetPassword = () => {
  const { resetPassword, error } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
  
  const { 
    values, 
    handleChange, 
    handleSubmit, 
    errors, 
    touched, 
    isSubmitting 
  } = useForm(
    { 
      password: '',
      confirmPassword: ''
    },
    validateResetPassword,
    async (formValues) => {
      const success = await resetPassword(token, formValues.password);
      if (success) {
        setResetComplete(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    }
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <motion.h1 
            className="text-center text-3xl font-extrabold text-blue-600"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            CuraNet
          </motion.h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Reset Your Password
          </h2>
          {!resetComplete && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Please enter your new password
            </p>
          )}
        </div>
        
        {!resetComplete ? (
          <motion.form 
            className="mt-8 space-y-6" 
            onSubmit={handleSubmit}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="form-label">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange}
                  className={`form-input ${touched.password && errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="form-error">{errors.password}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={handleChange}
                className={`form-input ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirm new password"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="form-error">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full flex justify-center"
              >
                {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div 
            className="bg-green-50 border border-green-200 text-green-600 px-4 py-6 rounded-lg mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-center">
              Your password has been successfully reset!
            </p>
            <p className="text-center mt-2 text-sm">
              You will be redirected to the login page in a few seconds...
            </p>
            <p className="text-center mt-4">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Go to Login
              </Link>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword; 