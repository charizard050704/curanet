import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserAlt, FaFilter } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PatientDirectory = () => {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    ageRange: '',
    condition: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      // This would be an API call in production
      setTimeout(() => {
        const mockPatients = [
          {
            id: 'P1001',
            name: 'John Smith',
            age: 45,
            gender: 'Male',
            contactNumber: '+1 555-123-4567',
            email: 'john.smith@example.com',
            lastVisit: '2023-08-01',
            conditions: ['Hypertension', 'Type 2 Diabetes'],
            upcomingAppointment: '2023-09-15',
            status: 'Active'
          },
          {
            id: 'P1002',
            name: 'Sarah Johnson',
            age: 35,
            gender: 'Female',
            contactNumber: '+1 555-987-6543',
            email: 'sarah.johnson@example.com',
            lastVisit: '2023-07-22',
            conditions: ['Asthma'],
            upcomingAppointment: null,
            status: 'Active'
          },
          {
            id: 'P1003',
            name: 'Robert Davis',
            age: 60,
            gender: 'Male',
            contactNumber: '+1 555-456-7890',
            email: 'robert.davis@example.com',
            lastVisit: '2023-08-15',
            conditions: ['Arthritis', 'High Cholesterol'],
            upcomingAppointment: '2023-09-10',
            status: 'Active'
          },
          {
            id: 'P1004',
            name: 'Emily Wilson',
            age: 28,
            gender: 'Female',
            contactNumber: '+1 555-234-5678',
            email: 'emily.wilson@example.com',
            lastVisit: '2023-06-30',
            conditions: ['Anxiety'],
            upcomingAppointment: '2023-09-05',
            status: 'Active'
          },
          {
            id: 'P1005',
            name: 'Michael Brown',
            age: 52,
            gender: 'Male',
            contactNumber: '+1 555-345-6789',
            email: 'michael.brown@example.com',
            lastVisit: '2023-07-10',
            conditions: ['Coronary Artery Disease', 'Type 2 Diabetes'],
            upcomingAppointment: '2023-09-20',
            status: 'Active'
          },
          {
            id: 'P1006',
            name: 'Lisa Martinez',
            age: 41,
            gender: 'Female',
            contactNumber: '+1 555-567-8901',
            email: 'lisa.martinez@example.com',
            lastVisit: '2023-08-08',
            conditions: ['Migraine'],
            upcomingAppointment: null,
            status: 'Inactive'
          }
        ];

        setPatients(mockPatients);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients');
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      gender: '',
      ageRange: '',
      condition: ''
    });
    setSearchQuery('');
  };

  // Filter patients based on search query and filters
  const filteredPatients = patients.filter(patient => {
    // Search by name or ID
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          patient.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by gender
    const matchesGender = filters.gender === '' || patient.gender === filters.gender;
    
    // Filter by age range
    let matchesAge = true;
    if (filters.ageRange !== '') {
      const [min, max] = filters.ageRange.split('-').map(Number);
      matchesAge = patient.age >= min && patient.age <= max;
    }
    
    // Filter by condition
    let matchesCondition = true;
    if (filters.condition !== '') {
      matchesCondition = patient.conditions.some(condition => 
        condition.toLowerCase().includes(filters.condition.toLowerCase())
      );
    }
    
    return matchesSearch && matchesGender && matchesAge && matchesCondition;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Patient Directory</h1>
        <p className="text-gray-600">Manage and access your patient records</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <FaFilter className="mr-2" />
              Filters
              {Object.values(filters).some(value => value !== '') && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-500 rounded-full">
                  {Object.values(filters).filter(value => value !== '').length}
                </span>
              )}
            </button>
            
            {Object.values(filters).some(value => value !== '') && (
              <button
                onClick={resetFilters}
                className="ml-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={filters.gender}
                  onChange={handleFilterChange}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                <select
                  name="ageRange"
                  value={filters.ageRange}
                  onChange={handleFilterChange}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Ages</option>
                  <option value="0-18">0-18</option>
                  <option value="19-35">19-35</option>
                  <option value="36-50">36-50</option>
                  <option value="51-65">51-65</option>
                  <option value="66-100">66+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <input
                  type="text"
                  name="condition"
                  value={filters.condition}
                  onChange={handleFilterChange}
                  placeholder="e.g. Diabetes, Asthma"
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conditions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No patients found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <FaUserAlt className="text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">
                            {patient.id} • {patient.age} yrs • {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.contactNumber}</div>
                      <div className="text-sm text-gray-500">{patient.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.lastVisit}</div>
                      {patient.upcomingAppointment && (
                        <div className="text-xs text-green-600">
                          Next: {patient.upcomingAppointment}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {patient.conditions.map((condition, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        patient.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/doctor/patients/${patient.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientDirectory; 