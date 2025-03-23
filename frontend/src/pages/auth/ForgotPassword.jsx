import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import AuthContext from '../../context/AuthContext.jsx';
import useForm from '../../hooks/useForm';
import { validateForgotPassword } from '../../utils/validation';

const ForgotPassword = () => {
  const { forgotPassword, error } = useContext(AuthContext);
  const [emailSent, setEmailSent] = useState(false);
  
  const { 
    values, 
    handleChange, 
    handleSubmit, 
    errors, 
    touched, 
    isSubmitting 
  } = useForm(
    { email: '' },
    validateForgotPassword,
    async (formValues) => {
      const success = await forgotPassword(formValues.email);
      if (success) {
        setEmailSent(true);
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
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {emailSent
              ? "We've sent you an email with instructions to reset your password."
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>
        
        {!emailSent ? (
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
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                className={`form-input ${touched.email && errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
              />
              {touched.email && errors.email && (
                <p className="form-error">{errors.email}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full flex justify-center"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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
              Check your email for the reset link. The link will expire in 1 hour.
            </p>
            <p className="text-center mt-4">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Return to Login
              </Link>
            </p>
          </motion.div>
        )}
        
        <div className="text-center">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 