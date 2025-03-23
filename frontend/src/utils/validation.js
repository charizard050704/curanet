/**
 * Validates user login credentials
 * @param {Object} values - Form values
 * @returns {Object} Error messages
 */
export const validateLogin = (values) => {
  const errors = {};
  
  if (!values.username) {
    errors.username = 'Username is required';
  }
  
  if (!values.password) {
    errors.password = 'Password is required';
  }
  
  return errors;
};

/**
 * Validates user registration form
 * @param {Object} values - Form values
 * @returns {Object} Error messages
 */
export const validateRegistration = (values) => {
  const errors = {};
  
  if (!values.username) {
    errors.username = 'Username is required';
  } else if (values.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }
  
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email is invalid';
  }
  
  if (!values.name) {
    errors.name = 'Full name is required';
  }
  
  if (!values.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  }
  
  if (!values.gender) {
    errors.gender = 'Please select your gender';
  }
  
  if (!values.contactNumber) {
    errors.contactNumber = 'Contact number is required';
  } else if (!/^\d{10,15}$/.test(values.contactNumber.replace(/\D/g, ''))) {
    errors.contactNumber = 'Contact number must be between 10-15 digits';
  }
  
  return errors;
};

/**
 * Validates medical record form
 * @param {Object} values - Form values
 * @returns {Object} Error messages
 */
export const validateMedicalRecord = (values) => {
  const errors = {};
  
  if (!values.patient_id) {
    errors.patient_id = 'Patient is required';
  }
  
  if (!values.diagnosis) {
    errors.diagnosis = 'Diagnosis is required';
  }
  
  if (!values.treatment) {
    errors.treatment = 'Treatment is required';
  }
  
  return errors;
};

/**
 * Validates prescription form
 * @param {Object} values - Form values
 * @returns {Object} Error messages
 */
export const validatePrescription = (values) => {
  const errors = {};
  
  if (!values.patient_id) {
    errors.patient_id = 'Patient is required';
  }
  
  if (!values.medication_name) {
    errors.medication_name = 'Medication name is required';
  }
  
  if (!values.dosage) {
    errors.dosage = 'Dosage is required';
  }
  
  if (!values.frequency) {
    errors.frequency = 'Frequency is required';
  }
  
  if (!values.duration) {
    errors.duration = 'Duration is required';
  }
  
  return errors;
};

/**
 * Validates appointment form
 * @param {Object} values - Form values
 * @returns {Object} Error messages
 */
export const validateAppointment = (values) => {
  const errors = {};
  
  if (!values.patient_id) {
    errors.patient_id = 'Patient is required';
  }
  
  if (!values.doctor_id) {
    errors.doctor_id = 'Doctor is required';
  }
  
  if (!values.hospital_id) {
    errors.hospital_id = 'Hospital is required';
  }
  
  if (!values.appointment_date) {
    errors.appointment_date = 'Appointment date is required';
  } else {
    const appointmentDate = new Date(values.appointment_date);
    const now = new Date();
    
    if (appointmentDate < now) {
      errors.appointment_date = 'Appointment date cannot be in the past';
    }
  }
  
  if (!values.reason) {
    errors.reason = 'Reason for appointment is required';
  }
  
  return errors;
};

/**
 * Validates emergency request form
 * @param {Object} values - Form values
 * @returns {Object} Error messages
 */
export const validateEmergencyRequest = (values) => {
  const errors = {};
  
  if (!values.patient_id) {
    errors.patient_id = 'Patient information is required';
  }
  
  if (!values.location) {
    errors.location = 'Location is required';
  }
  
  if (!values.emergency_type) {
    errors.emergency_type = 'Emergency type is required';
  }
  
  return errors;
};

/**
 * Validates pharmacy order form
 * @param {Object} values - Form values
 * @returns {Object} Error messages
 */
export const validatePharmacyOrder = (values) => {
  const errors = {};
  
  if (!values.patient_id) {
    errors.patient_id = 'Patient is required';
  }
  
  if (!values.prescription_id) {
    errors.prescription_id = 'Prescription is required';
  }
  
  if (!values.pharmacy_name) {
    errors.pharmacy_name = 'Pharmacy name is required';
  }
  
  if (!values.delivery_address) {
    errors.delivery_address = 'Delivery address is required';
  }
  
  return errors;
};

export const validateForgotPassword = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email is invalid';
  }

  return errors;
};

export const validateResetPassword = (values) => {
  const errors = {};

  if (!values.password) {
    errors.password = 'New password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your new password';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

/**
 * Validates profile form values
 * @param {Object} values - Form values
 * @returns {Object} Validation errors
 */
export const validateProfile = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'Full name is required';
  }

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email is invalid';
  }

  return errors;
}; 