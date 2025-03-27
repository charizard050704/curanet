import { useState, useContext, useEffect } from 'react';
import { FaCalendarCheck, FaFileMedical, FaHospital, FaChartLine } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext.jsx';

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    medicalRecords: 0,
    prescriptions: 0,
    hospitals: 0
  });
  
  const [appointments, setAppointments] = useState([]);
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: { value: 0, status: 'normal' },
    bloodPressure: { value: '', status: 'normal' },
    bloodSugar: { value: 0, status: 'normal' },
    temperature: { value: 0, status: 'normal' }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, these would be separate API calls
        // For demo purposes, we're setting mock data
        
        // Simulate API call delay
        setTimeout(() => {
          setStats({
            upcomingAppointments: ,
            medicalRecords: ,
            prescriptions: ,
            hospitals: 
          });
          
          setAppointments([
            
          ]);
          
          setHealthMetrics();
          
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

  const renderHealthStatus = (status) => {
    switch (status) {
      case 'critical':
        return <span className="health-status-critical">Critical</span>;
      case 'warning':
        return <span className="health-status-warning">Warning</span>;
      default:
        return <span className="health-status-normal">Normal</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name || 'Patient'}</h1>
        <p className="text-gray-600">Here's an overview of your health information</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-body flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <FaCalendarCheck className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Upcoming Appointments</p>
              <h3 className="text-2xl font-bold">{stats.upcomingAppointments}</h3>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <FaFileMedical className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Medical Records</p>
              <h3 className="text-2xl font-bold">{stats.medicalRecords}</h3>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <FaFileMedical className="text-purple-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Prescriptions</p>
              <h3 className="text-2xl font-bold">{stats.prescriptions}</h3>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <FaHospital className="text-yellow-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Connected Hospitals</p>
              <h3 className="text-2xl font-bold">{stats.hospitals}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Health Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaChartLine className="mr-2 text-blue-500" />
          Your Health Metrics
        </h2>
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border-r border-gray-200 pr-4 last:border-r-0">
                <p className="text-gray-500">Heart Rate</p>
                <p className="text-xl font-bold">{healthMetrics.heartRate.value} BPM</p>
                <p className="text-sm">{renderHealthStatus(healthMetrics.heartRate.status)}</p>
              </div>
              
              <div className="border-r border-gray-200 pr-4 last:border-r-0">
                <p className="text-gray-500">Blood Pressure</p>
                <p className="text-xl font-bold">{healthMetrics.bloodPressure.value}</p>
                <p className="text-sm">{renderHealthStatus(healthMetrics.bloodPressure.status)}</p>
              </div>
              
              <div className="border-r border-gray-200 pr-4 last:border-r-0">
                <p className="text-gray-500">Blood Sugar</p>
                <p className="text-xl font-bold">{healthMetrics.bloodSugar.value} mg/dL</p>
                <p className="text-sm">{renderHealthStatus(healthMetrics.bloodSugar.status)}</p>
              </div>
              
              <div>
                <p className="text-gray-500">Temperature</p>
                <p className="text-xl font-bold">{healthMetrics.temperature.value}°C</p>
                <p className="text-sm">{renderHealthStatus(healthMetrics.temperature.status)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upcoming Appointments */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaCalendarCheck className="mr-2 text-blue-500" />
          Upcoming Appointments
        </h2>
        <div className="card">
          <div className="card-body">
            {appointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hospital
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.doctor}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.department}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {appointment.hospital}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {appointment.date}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.time}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`badge ${appointment.status === 'confirmed' ? 'badge-green' : 'badge-yellow'}`}>
                            {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No upcoming appointments.
              </p>
            )}
            <div className="mt-4 text-center">
              <button className="btn btn-primary">
                Schedule New Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard; 
