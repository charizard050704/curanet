import { useState } from 'react';

/**
 * A custom hook for handling form state, validation, and submission
 * @param {Object} initialValues - Initial form values
 * @param {Function} validate - Validation function
 * @param {Function} onSubmit - Form submission handler
 * @returns {Object} Form state and handlers
 */
const useForm = (initialValues, validate, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setValues({
      ...values,
      [name]: value
    });
    
    setTouched({
      ...touched,
      [name]: true
    });
    
    if (validate) {
      const validationErrors = validate({
        ...values,
        [name]: value
      });
      
      setErrors(validationErrors);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched({
      ...touched,
      [name]: true
    });
    
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      
      const hasErrors = Object.keys(validationErrors).length > 0;
      if (hasErrors) {
        // Mark all fields as touched to show all errors
        const allTouched = {};
        Object.keys(values).forEach(key => {
          allTouched[key] = true;
        });
        setTouched(allTouched);
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  /**
   * Set a specific field value
   * @param {string} name - Field name
   * @param {any} value - Field value
   */
  const setFieldValue = (name, value) => {
    setValues({
      ...values,
      [name]: value
    });
    
    if (validate) {
      const validationErrors = validate({
        ...values,
        [name]: value
      });
      
      setErrors(validationErrors);
    }
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue
  };
};

export default useForm; 