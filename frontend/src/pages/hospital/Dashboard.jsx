import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaCalendarAlt, FaFileMedical, FaChartLine, FaUserMd, FaAmbulance } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const HospitalDashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeAppointments: 0,
    pendingRecords: 0,
    emergencyRequests: 0
  });
  
  const [appointments, setAppointments] = useState([]);
  const [emergencyRequests, setEmergencyRequests] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, these would be separate API calls
        // For demo purposes, we're setting mock data
        
        // Simulate API call delay
        setTimeout(() => {
          setStats({
            totalPatients: 276,
            activeAppointments: 18,
            pendingRecords: 7,
            emergencyRequests: 2
          });
          
          setAppointments([
            {
              id: 1,
              patient: 'John Smith',
              patientId: 'P1001',
              doctor: 'Dr. Sarah Johnson',
              department: 'Cardiology',
              date: '2023-08-15',
              time: '10:30 AM',
              status: 'confirmed'
            },
            {
              id: 2,
              patient: 'Emma Wilson',
              patientId: 'P1042',
              doctor: 'Dr. Michael Chen',
              department: 'Neurology',
              date: '2023-08-15',
              time: '2:15 PM',
              status: 'in-progress'
            },
            {
              id: 3,
              patient: 'Robert Johnson',
              patientId: 'P1055',
              doctor: 'Dr. Jessica Martinez',
              department: 'Orthopedics',
              date: '2023-08-15',
              time: '3:00 PM',
              status: 'confirmed'
            },
            {
              id: 4,
              patient: 'Sarah Thompson',
              patientId: 'P1065',
              doctor: 'Dr. James Wilson',
              department: 'Dermatology',
              date: '2023-08-15',
              time: '4:30 PM',
              status: 'confirmed'
            },
            {
              id: 5,
              patient: 'David Brown',
              patientId: 'P1078',
              doctor: 'Dr. Elizabeth Lee',
              department: 'Ophthalmology',
              date: '2023-08-15',
              time: '5:15 PM',
              status: 'pending'
            }
          ]);
          
          setEmergencyRequests([
            {
              id: 1,
              patient: 'Michael Clark',
              patientId: 'P1023',
              symptoms: 'Severe chest pain, difficulty breathing',
              location: '123 Main St, Apt 4B, New York',
              requestTime: '2023-08-15 08:45 AM',
              status: 'pending'
            },
            {
              id: 2,
              patient: 'Lisa Rodriguez',
              patientId: 'P1089',
              symptoms: 'High fever, severe headache, disorientation',
              location: '456 Park Ave, New York',
              requestTime: '2023-08-15 07:30 AM',
              status: 'dispatched'
            }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge badge-blue">Confirmed</span>;
      case 'pending':
        return <span className="badge badge-yellow">Pending</span>;
      case 'in-progress':
        return <span className="badge badge-green">In Progress</span>;
      case 'completed':
        return <span className="badge badge-gray">Completed</span>;
      case 'dispatched':
        return <span className="badge badge-green">Dispatched</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-800">Hospital Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.name || 'Hospital Staff'}</p>
      </motion.div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="card-body flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <FaUsers className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Total Patients</p>
              <h3 className="text-2xl font-bold">{stats.totalPatients}</h3>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="card-body flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <FaCalendarAlt className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Today's Appointments</p>
              <h3 className="text-2xl font-bold">{stats.activeAppointments}</h3>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="card-body flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <FaFileMedical className="text-purple-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Pending Records</p>
              <h3 className="text-2xl font-bold">{stats.pendingRecords}</h3>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="card-body flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <FaAmbulance className="text-red-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Emergency Requests</p>
              <h3 className="text-2xl font-bold">{stats.emergencyRequests}</h3>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Emergency Requests Section */}
      {emergencyRequests.length > 0 && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaAmbulance className="mr-2 text-red-500" />
            Emergency Requests
          </h2>
          <div className="card bg-red-50 border border-red-100">
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-red-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                        Symptoms
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-200">
                    {emergencyRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {request.patient}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {request.patientId}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">
                            {request.symptoms}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">
                            {request.location}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {request.requestTime}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {request.status === 'pending' ? (
                            <button className="btn btn-danger btn-sm">
                              Dispatch
                            </button>
                          ) : (
                            <button className="btn btn-secondary btn-sm">
                              View Details
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Today's Appointments */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaCalendarAlt className="mr-2 text-blue-500" />
          Today's Appointments
        </h2>
        <div className="card">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patient}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {appointment.patientId}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.doctor}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.department}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.time}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(appointment.status)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button className="btn btn-primary btn-sm">
                          {appointment.status === 'confirmed' ? 'Check In' : 
                           appointment.status === 'in-progress' ? 'Complete' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaChartLine className="mr-2 text-blue-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/hospital/patients/new" className="card bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors">
            <div className="card-body flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <FaUserMd className="text-blue-500 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Add New Patient</h3>
                <p className="text-sm text-gray-600">Register a new patient</p>
              </div>
            </div>
          </Link>
          
          <Link to="/hospital/appointments/new" className="card bg-green-50 hover:bg-green-100 cursor-pointer transition-colors">
            <div className="card-body flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <FaCalendarAlt className="text-green-500 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Schedule Appointment</h3>
                <p className="text-sm text-gray-600">Book a new appointment</p>
              </div>
            </div>
          </Link>
          
          <Link to="/hospital/records" className="card bg-purple-50 hover:bg-purple-100 cursor-pointer transition-colors">
            <div className="card-body flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <FaFileMedical className="text-purple-500 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Update Records</h3>
                <p className="text-sm text-gray-600">Update patient records</p>
              </div>
            </div>
          </Link>
          
          <div className="card bg-yellow-50 hover:bg-yellow-100 cursor-pointer transition-colors">
            <div className="card-body flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <FaUsers className="text-yellow-500 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Manage Staff</h3>
                <p className="text-sm text-gray-600">Update staff information</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HospitalDashboard; 