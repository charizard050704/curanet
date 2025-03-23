import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarPlus, FaSearch, FaFilter, FaEdit, FaCheckCircle, FaTimes, FaClock } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AppointmentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    dateFrom: null,
    dateTo: null
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, appointments]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate dates
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      // Mock appointments data
      const mockAppointments = [
        {
          id: 1,
          patientName: 'John Smith',
          patientId: 'P1001',
          doctorName: 'Dr. Sarah Johnson',
          department: 'Cardiology',
          date: today.toISOString().split('T')[0],
          time: '10:00 AM',
          status: 'confirmed',
          notes: 'Regular check-up',
          createdAt: '2023-08-01'
        },
        {
          id: 2,
          patientName: 'Emma Wilson',
          patientId: 'P1042',
          doctorName: 'Dr. Michael Chen',
          department: 'Neurology',
          date: today.toISOString().split('T')[0],
          time: '2:15 PM',
          status: 'in-progress',
          notes: 'Follow-up after MRI',
          createdAt: '2023-08-05'
        },
        {
          id: 3,
          patientName: 'Robert Davis',
          patientId: 'P1055',
          doctorName: 'Dr. Lisa Anderson',
          department: 'Orthopedics',
          date: tomorrow.toISOString().split('T')[0],
          time: '11:30 AM',
          status: 'confirmed',
          notes: 'Post-surgery follow-up',
          createdAt: '2023-08-10'
        },
        {
          id: 4,
          patientName: 'Sarah Thompson',
          patientId: 'P1065',
          doctorName: 'Dr. James Wilson',
          department: 'Dermatology',
          date: tomorrow.toISOString().split('T')[0],
          time: '4:30 PM',
          status: 'confirmed',
          notes: 'Skin condition assessment',
          createdAt: '2023-08-12'
        },
        {
          id: 5,
          patientName: 'David Brown',
          patientId: 'P1078',
          doctorName: 'Dr. Jennifer White',
          department: 'Ophthalmology',
          date: nextWeek.toISOString().split('T')[0],
          time: '9:15 AM',
          status: 'pending',
          notes: 'Vision test and prescription update',
          createdAt: '2023-08-13'
        },
        {
          id: 6,
          patientName: 'Michael Clark',
          patientId: 'P1023',
          doctorName: 'Dr. Sarah Johnson',
          department: 'Cardiology',
          date: yesterday.toISOString().split('T')[0],
          time: '3:00 PM',
          status: 'completed',
          notes: 'Annual heart checkup',
          createdAt: '2023-07-28'
        },
        {
          id: 7,
          patientName: 'Jessica Martinez',
          patientId: 'P1089',
          doctorName: 'Dr. William Davis',
          department: 'General Medicine',
          date: yesterday.toISOString().split('T')[0],
          time: '1:30 PM',
          status: 'completed',
          notes: 'Flu symptoms',
          createdAt: '2023-08-02'
        },
        {
          id: 8,
          patientName: 'Amanda Clark',
          patientId: 'P1090',
          doctorName: 'Dr. Michael Chen',
          department: 'Neurology',
          date: nextWeek.toISOString().split('T')[0],
          time: '10:45 AM',
          status: 'pending',
          notes: 'Recurring headaches',
          createdAt: '2023-08-14'
        },
        {
          id: 9,
          patientName: 'Robert Wilson',
          patientId: 'P1095',
          doctorName: 'Dr. Lisa Anderson',
          department: 'Orthopedics',
          date: today.toISOString().split('T')[0],
          time: '4:00 PM',
          status: 'confirmed',
          notes: 'Knee pain assessment',
          createdAt: '2023-08-10'
        },
        {
          id: 10,
          patientName: 'Sophia Lee',
          patientId: 'P1100',
          doctorName: 'Dr. James Wilson',
          department: 'Dermatology',
          date: tomorrow.toISOString().split('T')[0],
          time: '2:00 PM',
          status: 'confirmed',
          notes: 'Eczema treatment follow-up',
          createdAt: '2023-08-13'
        }
      ];
      
      setAppointments(mockAppointments);
      setFilteredAppointments(mockAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...appointments];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(appointment => 
        appointment.patientName.toLowerCase().includes(term) || 
        appointment.doctorName.toLowerCase().includes(term) || 
        appointment.patientId.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(appointment => appointment.status === filters.status);
    }
    
    // Apply department filter
    if (filters.department) {
      filtered = filtered.filter(appointment => appointment.department === filters.department);
    }
    
    // Apply date range filter
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      from.setHours(0, 0, 0, 0);
      filtered = filtered.filter(appointment => {
        const appDate = new Date(appointment.date);
        return appDate >= from;
      });
    }
    
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter(appointment => {
        const appDate = new Date(appointment.date);
        return appDate <= to;
      });
    }
    
    setFilteredAppointments(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, name) => {
    setFilters(prev => ({ ...prev, [name]: date }));
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      department: '',
      dateFrom: null,
      dateTo: null
    });
    setSearchTerm('');
  };

  // Get unique departments for filter dropdown
  const departments = [...new Set(appointments.map(appointment => appointment.department))];

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
      case 'cancelled':
        return <span className="badge badge-red">Cancelled</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  const getActionButton = (appointment) => {
    switch (appointment.status) {
      case 'confirmed':
        return (
          <button className="btn btn-primary btn-sm flex items-center">
            <FaClock className="mr-1" /> Check In
          </button>
        );
      case 'in-progress':
        return (
          <button className="btn btn-success btn-sm flex items-center">
            <FaCheckCircle className="mr-1" /> Complete
          </button>
        );
      case 'pending':
        return (
          <button className="btn btn-warning btn-sm flex items-center">
            <FaEdit className="mr-1" /> Confirm
          </button>
        );
      case 'completed':
        return (
          <Link to={`/hospital/appointments/${appointment.id}`} className="btn btn-secondary btn-sm flex items-center">
            View Details
          </Link>
        );
      default:
        return (
          <Link to={`/hospital/appointments/${appointment.id}`} className="btn btn-secondary btn-sm flex items-center">
            View Details
          </Link>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Appointments</h1>
        <Link 
          to="/hospital/appointments/new" 
          className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 inline-flex items-center"
        >
          <FaCalendarPlus className="mr-2" />
          Schedule New Appointment
        </Link>
      </div>
      
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="flex items-center">
              <button
                type="button"
                className="flex items-center text-blue-500 hover:text-blue-700"
                onClick={() => setShowFilters(prev => !prev)}
              >
                <FaFilter className="mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              
              {showFilters && (
                <button
                  type="button"
                  className="ml-4 text-gray-500 hover:text-gray-700"
                  onClick={resetFilters}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 mb-6 bg-gray-50 p-4 rounded">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full rounded border py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                  className="w-full rounded border py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                <DatePicker
                  selected={filters.dateFrom}
                  onChange={date => handleDateChange(date, 'dateFrom')}
                  className="w-full rounded border py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="From date"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                <DatePicker
                  selected={filters.dateTo}
                  onChange={date => handleDateChange(date, 'dateTo')}
                  className="w-full rounded border py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="To date"
                  dateFormat="yyyy-MM-dd"
                  minDate={filters.dateFrom}
                />
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <p className="text-gray-600 text-sm">
              {filteredAppointments.length} {filteredAppointments.length === 1 ? 'appointment' : 'appointments'} found
            </p>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
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
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.patientName}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {appointment.patientId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.doctorName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.department}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.date}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(appointment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getActionButton(appointment)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No appointments found matching your criteria</p>
              <button
                onClick={resetFilters}
                className="mt-4 text-blue-500 hover:text-blue-700"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage; 