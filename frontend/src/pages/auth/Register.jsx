import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AuthContext from '../../context/AuthContext.jsx';
import useForm from '../../hooks/useForm';
import { validateRegistration } from '../../utils/validation';

const Register = () => {
  const { register, error } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const initialValues = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
    dateOfBirth: null,
    gender: '',
    contactNumber: '',
    role: 'patient', // Default role
  };
  
  const { 
    values, 
    handleChange, 
    handleSubmit, 
    errors, 
    touched, 
    isSubmitting,
    setFieldValue 
  } = useForm(
    initialValues,
    validateRegistration,
    async (formValues) => {
      const success = await register(formValues);
      if (success) {
        navigate('/login');
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
            Create a new account
          </h2>
        </div>
        
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
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                className={`form-input ${touched.name && errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter your full name"
              />
              {touched.name && errors.name && (
                <p className="form-error">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={values.username}
                onChange={handleChange}
                className={`form-input ${touched.username && errors.username ? 'border-red-500' : ''}`}
                placeholder="Choose a username"
              />
              {touched.username && errors.username && (
                <p className="form-error">{errors.username}</p>
              )}
            </div>
            
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateOfBirth" className="form-label">
                  Date of Birth
                </label>
                <DatePicker
                  id="dateOfBirth"
                  selected={values.dateOfBirth}
                  onChange={(date) => setFieldValue('dateOfBirth', date)}
                  className={`form-input w-full ${touched.dateOfBirth && errors.dateOfBirth ? 'border-red-500' : ''}`}
                  placeholderText="Select date"
                  dateFormat="yyyy-MM-dd"
                  maxDate={new Date()}
                  showYearDropdown
                  dropdownMode="select"
                />
                {touched.dateOfBirth && errors.dateOfBirth && (
                  <p className="form-error">{errors.dateOfBirth}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="gender" className="form-label">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={values.gender}
                  onChange={handleChange}
                  className={`form-input ${touched.gender && errors.gender ? 'border-red-500' : ''}`}
                >
                  <option value="">Select gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
                {touched.gender && errors.gender && (
                  <p className="form-error">{errors.gender}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="contactNumber" className="form-label">
                Contact Number
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                value={values.contactNumber}
                onChange={handleChange}
                className={`form-input ${touched.contactNumber && errors.contactNumber ? 'border-red-500' : ''}`}
                placeholder="Enter your contact number"
              />
              {touched.contactNumber && errors.contactNumber && (
                <p className="form-error">{errors.contactNumber}</p>
              )}
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange}
                  className={`form-input ${touched.password && errors.password ? 'border-red-500' : ''}`}
                  placeholder="Create a password"
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
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={handleChange}
                className={`form-input ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirm your password"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="form-error">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full flex justify-center"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </motion.form>
        
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 