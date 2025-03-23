import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login if not already there
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Patient-related API calls
export const patientAPI = {
  // Get patient details by medical ID
  getPatientByMedicalId: (medicalId) => api.get(`/patients/${medicalId}`),
  
  // Get patient records
  getPatientRecords: (patientId) => api.get(`/patients/${patientId}/records`),
  
  // Get patient prescriptions
  getPatientPrescriptions: (patientId) => api.get(`/patients/${patientId}/prescriptions`),
  
  // Get patient appointments
  getPatientAppointments: (patientId) => api.get(`/patients/${patientId}/appointments`),
  
  // Get patient health statistics
  getPatientStatistics: (patientId) => api.get(`/statistics/patient/${patientId}`),
};

// Hospital and doctor-related API calls
export const hospitalAPI = {
  // Get all hospitals
  getAllHospitals: () => api.get('/hospitals'),
  
  // Get doctors in a hospital
  getDoctorsByHospital: (hospitalId) => api.get(`/hospitals/${hospitalId}/doctors`),
  
  // Get doctor's schedule
  getDoctorSchedule: (doctorId) => api.get(`/doctors/${doctorId}/schedule`),
};

// Medical record management
export const recordsAPI = {
  // Create a new medical record
  createRecord: (recordData) => api.post('/records', recordData),
  
  // Create a new prescription
  createPrescription: (prescriptionData) => api.post('/prescriptions', prescriptionData),
};

// Appointment management
export const appointmentAPI = {
  // Schedule a new appointment
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  
  // Update appointment status
  updateAppointment: (appointmentId, updateData) => api.patch(`/appointments/${appointmentId}`, updateData),
};

// Emergency services
export const emergencyAPI = {
  // Request emergency services
  requestEmergency: (emergencyData) => api.post('/emergency', emergencyData),
  
  // Get active emergency requests (for staff)
  getActiveEmergencies: () => api.get('/emergency/active'),
  
  // Update emergency request status
  updateEmergencyStatus: (requestId, updateData) => api.patch(`/emergency/${requestId}`, updateData),
};

// Pharmacy services
export const pharmacyAPI = {
  // Place an order for medications
  placeOrder: (orderData) => api.post('/pharmacy/orders', orderData),
  
  // Get patient's pharmacy orders
  getPatientOrders: (patientId) => api.get(`/pharmacy/orders/${patientId}`),
};

// Search functionality
export const searchAPI = {
  // Search for patients, doctors, or records
  search: (type, keyword) => api.get(`/search?type=${type}&keyword=${keyword}`),
};

// Authentication
export const authAPI = {
  // User login
  login: (credentials) => api.post('/auth/login', credentials),
  
  // User registration
  register: (userData) => api.post('/auth/register', userData),
};

export default api; 