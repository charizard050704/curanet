import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Main Pages
import Dashboard from './pages/Dashboard';
import PatientDashboard from './pages/patient/Dashboard';
import DoctorDashboard from './pages/doctor/Dashboard';
import HospitalDashboard from './pages/hospital/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Patient Pages
import PatientPrescriptions from './pages/patient/Prescriptions';
import MedicalRecords from './pages/patient/MedicalRecords';

// Appointment Pages
import BookAppointment from './pages/appointments/Book';

// Doctor Pages
import PatientDetail from './pages/doctor/PatientDetail';
import WritePrescription from './pages/doctor/WritePrescription';
import PatientDirectory from './pages/doctor/PatientDirectory';
import DoctorProfilePage from './pages/doctor/DoctorProfilePage';
import AppointmentsPage from './pages/doctor/AppointmentsPage';
import PrescriptionsPage from './pages/doctor/PrescriptionsPage';

// Hospital Pages
import PatientsNew from './pages/hospital/PatientsNew';
import AppointmentsNew from './pages/hospital/AppointmentsNew';
import PatientsPage from './pages/hospital/PatientsPage';
import HospitalAppointmentsPage from './pages/hospital/AppointmentsPage';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Protected Routes */}
        <Route element={<Layout />}>
          {/* Common Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Patient Routes */}
          <Route path="/patient" element={
            <ProtectedRoute requiredRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/patient/prescriptions" element={
            <ProtectedRoute requiredRole="patient">
              <PatientPrescriptions />
            </ProtectedRoute>
          } />
          
          <Route path="/patient/records" element={
            <ProtectedRoute requiredRole="patient">
              <MedicalRecords />
            </ProtectedRoute>
          } />
          
          <Route path="/appointments/book" element={
            <ProtectedRoute requiredRole="patient">
              <BookAppointment />
            </ProtectedRoute>
          } />
          
          {/* Doctor Routes */}
          <Route path="/doctor" element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route
            path="/doctor/patients"
            element={<ProtectedRoute requiredRole="doctor"><PatientDirectory /></ProtectedRoute>}
          />
          <Route
            path="/doctor/patients/:patientId"
            element={<ProtectedRoute requiredRole="doctor"><PatientDetail /></ProtectedRoute>}
          />
          <Route
            path="/doctor/write-prescription/:patientId"
            element={<ProtectedRoute requiredRole="doctor"><WritePrescription /></ProtectedRoute>}
          />
          <Route
            path="/doctor/profile"
            element={<ProtectedRoute requiredRole="doctor"><DoctorProfilePage /></ProtectedRoute>}
          />
          <Route
            path="/doctor/appointments"
            element={<ProtectedRoute requiredRole="doctor"><AppointmentsPage /></ProtectedRoute>}
          />
          <Route
            path="/doctor/prescriptions"
            element={<ProtectedRoute requiredRole="doctor"><PrescriptionsPage /></ProtectedRoute>}
          />
          
          {/* Hospital Routes */}
          <Route path="/hospital" element={
            <ProtectedRoute requiredRole="hospital">
              <HospitalDashboard />
            </ProtectedRoute>
          } />
          <Route path="/hospital/patients" element={
            <ProtectedRoute requiredRole="hospital">
              <PatientsPage />
            </ProtectedRoute>
          } />
          <Route path="/hospital/patients/new" element={
            <ProtectedRoute requiredRole="hospital">
              <PatientsNew />
            </ProtectedRoute>
          } />
          <Route path="/hospital/appointments" element={
            <ProtectedRoute requiredRole="hospital">
              <HospitalAppointmentsPage />
            </ProtectedRoute>
          } />
          <Route path="/hospital/appointments/new" element={
            <ProtectedRoute requiredRole="hospital">
              <AppointmentsNew />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
};

export default App;