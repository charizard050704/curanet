import { useState, useEffect, useContext } from 'react';
import { FaSearch, FaFilter, FaCalendarDay, FaUserMd, FaCheckCircle } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const AppointmentsPage = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [appointments, searchTerm, filterStatus, filterDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // This would be an API call in production
      // Mock appointments data with variety of dates
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const mockAppointments = [
        {
          id: 1,
          patientName: 'John Smith',
          patientId: 'P1001',
          date: today.toISOString().split('T')[0],
          time: '10:00 AM',
          status: 'completed',
          symptoms: 'Fever and headache',
          treatmentNotes: 'Prescribed paracetamol and rest',
          age: 45,
          gender: 'Male'
        },
        {
          id: 2,
          patientName: 'Sarah Johnson',
          patientId: 'P1002',
          date: today.toISOString().split('T')[0],
          time: '11:00 AM',
          status: 'pending',
          symptoms: 'Back pain',
          treatmentNotes: '',
          age: 35,
          gender: 'Female'
        },
        {
          id: 3,
          patientName: 'Robert Davis',
          patientId: 'P1003',
          date: tomorrow.toISOString().split('T')[0],
          time: '1:30 PM',
          status: 'pending',
          symptoms: 'Cough and congestion',
          treatmentNotes: '',
          age: 60,
          gender: 'Male'
        },
        {
          id: 4,
          patientName: 'Emma Wilson',
          patientId: 'P1004',
          date: yesterday.toISOString().split('T')[0],
          time: '3:00 PM',
          status: 'completed',
          symptoms: 'Skin rash',
          treatmentNotes: 'Prescribed antihistamines and topical cream',
          age: 28,
          gender: 'Female'
        },
        {
          id: 5,
          patientName: 'Michael Brown',
          patientId: 'P1005',
          date: yesterday.toISOString().split('T')[0],
          time: '4:15 PM',
          status: 'cancelled',
          symptoms: 'Stomach pain',
          treatmentNotes: '',
          age: 52,
          gender: 'Male'
        },
        {
          id: 6,
          patientName: 'Olivia Garcia',
          patientId: 'P1006',
          date: nextWeek.toISOString().split('T')[0],
          time: '9:30 AM',
          status: 'pending',
          symptoms: 'Annual checkup',
          treatmentNotes: '',
          age: 41,
          gender: 'Female'
        },
        {
          id: 7,
          patientName: 'William Taylor',
          patientId: 'P1007', 
          date: nextWeek.toISOString().split('T')[0],
          time: '2:00 PM',
          status: 'pending',
          symptoms: 'Joint pain',
          treatmentNotes: '',
          age: 67,
          gender: 'Male'
        }
      ];
      
      setAppointments(mockAppointments);
      setFilteredAppointments(mockAppointments);
      
      // Calculate stats
      const stats = {
        total: mockAppointments.length,
        completed: mockAppointments.filter(app => app.status === 'completed').length,
        pending: mockAppointments.filter(app => app.status === 'pending').length,
        cancelled: mockAppointments.filter(app => app.status === 'cancelled').length
      };
      setStats(stats);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...appointments];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(app => 
        app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(app => app.status === filterStatus);
    }
    
    // Apply date filter
    if (filterDate) {
      result = result.filter(app => app.date === filterDate);
    }
    
    setFilteredAppointments(result);
  };

  const handleCompleteAppointment = (id) => {
    // This would be an API call in production
    const updatedAppointments = appointments.map(app => 
      app.id === id ? { ...app, status: 'completed', treatmentNotes: 'Appointment completed successfully' } : app
    );
    
    setAppointments(updatedAppointments);
    
    // Update stats
    const stats = {
      total: updatedAppointments.length,
      completed: updatedAppointments.filter(app => app.status === 'completed').length,
      pending: updatedAppointments.filter(app => app.status === 'pending').length,
      cancelled: updatedAppointments.filter(app => app.status === 'cancelled').length
    };
    setStats(stats);
    
    toast.success('Appointment marked as completed');
  };

  const handleCancelAppointment = (id) => {
    // This would be an API call in production
    const updatedAppointments = appointments.map(app => 
      app.id === id ? { ...app, status: 'cancelled' } : app
    );
    
    setAppointments(updatedAppointments);
    
    // Update stats
    const stats = {
      total: updatedAppointments.length,
      completed: updatedAppointments.filter(app => app.status === 'completed').length,
      pending: updatedAppointments.filter(app => app.status === 'pending').length,
      cancelled: updatedAppointments.filter(app => app.status === 'cancelled').length
    };
    setStats(stats);
    
    toast.success('Appointment cancelled');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <FaCalendarDay className="text-blue-500" />
            </div>
            <div>
              <p className="text-gray-500">Total Appointments</p>
              <h3 className="text-2xl font-bold">{stats.total}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <FaCheckCircle className="text-green-500" />
            </div>
            <div>
              <p className="text-gray-500">Completed</p>
              <h3 className="text-2xl font-bold">{stats.completed}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <FaUserMd className="text-yellow-500" />
            </div>
            <div>
              <p className="text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold">{stats.pending}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <FaCalendarDay className="text-red-500" />
            </div>
            <div>
              <p className="text-gray-500">Cancelled</p>
              <h3 className="text-2xl font-bold">{stats.cancelled}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Filters & Search</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, ID or symptom"
              className="block w-full pl-10 pr-3 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarDay className="text-gray-400" />
            </div>
            <input
              type="date"
              className="block w-full pl-10 pr-3 py-2 border rounded-md"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Symptoms
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No appointments found matching your filters
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patientName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {appointment.patientId} | {appointment.age} years, {appointment.gender}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(appointment.date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">{appointment.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{appointment.symptoms}</div>
                    {appointment.treatmentNotes && (
                      <div className="text-sm text-gray-500">{appointment.treatmentNotes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {appointment.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleCompleteAppointment(appointment.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Complete
                        </button>
                        <button 
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {appointment.status === 'completed' && (
                      <span className="text-gray-500">Completed</span>
                    )}
                    {appointment.status === 'cancelled' && (
                      <span className="text-gray-500">Cancelled</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsPage; 