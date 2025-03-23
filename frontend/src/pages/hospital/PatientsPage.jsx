import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaSearch, FaFilter, FaEdit, FaFileMedical, FaEye } from 'react-icons/fa';

const PatientsPage = () => {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    ageRange: '',
    department: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, patients]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock patients data
      const mockPatients = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john@example.com',
          age: 45,
          gender: 'Male',
          bloodType: 'A+',
          phone: '(555) 123-4567',
          address: '123 Main St, New York, NY',
          registrationDate: '2022-03-15',
          lastVisit: '2023-07-20',
          department: 'Cardiology',
          doctorAssigned: 'Dr. Sarah Johnson'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          age: 35,
          gender: 'Female',
          bloodType: 'O+',
          phone: '(555) 234-5678',
          address: '456 Park Ave, New York, NY',
          registrationDate: '2021-07-10',
          lastVisit: '2023-08-05',
          department: 'Neurology',
          doctorAssigned: 'Dr. Michael Chen'
        },
        {
          id: 3,
          name: 'Robert Davis',
          email: 'robert@example.com',
          age: 60,
          gender: 'Male',
          bloodType: 'B-',
          phone: '(555) 345-6789',
          address: '789 Oak St, New York, NY',
          registrationDate: '2020-11-22',
          lastVisit: '2023-08-11',
          department: 'Orthopedics',
          doctorAssigned: 'Dr. Lisa Anderson'
        },
        {
          id: 4,
          name: 'Emma Wilson',
          email: 'emma@example.com',
          age: 28,
          gender: 'Female',
          bloodType: 'AB+',
          phone: '(555) 456-7890',
          address: '101 Pine St, New York, NY',
          registrationDate: '2023-01-05',
          lastVisit: '2023-08-14',
          department: 'Dermatology',
          doctorAssigned: 'Dr. James Wilson'
        },
        {
          id: 5,
          name: 'Michael Brown',
          email: 'michael@example.com',
          age: 52,
          gender: 'Male',
          bloodType: 'O-',
          phone: '(555) 567-8901',
          address: '202 Maple St, New York, NY',
          registrationDate: '2021-09-18',
          lastVisit: '2023-07-30',
          department: 'Ophthalmology',
          doctorAssigned: 'Dr. Jennifer White'
        },
        {
          id: 6,
          name: 'Jessica Martinez',
          email: 'jessica@example.com',
          age: 41,
          gender: 'Female',
          bloodType: 'A-',
          phone: '(555) 678-9012',
          address: '303 Cedar St, New York, NY',
          registrationDate: '2022-05-27',
          lastVisit: '2023-08-02',
          department: 'General Medicine',
          doctorAssigned: 'Dr. William Davis'
        },
        {
          id: 7,
          name: 'David Miller',
          email: 'david@example.com',
          age: 65,
          gender: 'Male',
          bloodType: 'B+',
          phone: '(555) 789-0123',
          address: '404 Elm St, New York, NY',
          registrationDate: '2020-08-15',
          lastVisit: '2023-08-10',
          department: 'Cardiology',
          doctorAssigned: 'Dr. Sarah Johnson'
        },
        {
          id: 8,
          name: 'Amanda Clark',
          email: 'amanda@example.com',
          age: 33,
          gender: 'Female',
          bloodType: 'O+',
          phone: '(555) 890-1234',
          address: '505 Birch St, New York, NY',
          registrationDate: '2021-11-08',
          lastVisit: '2023-07-25',
          department: 'Neurology',
          doctorAssigned: 'Dr. Michael Chen'
        },
        {
          id: 9,
          name: 'James Wilson',
          email: 'james@example.com',
          age: 58,
          gender: 'Male',
          bloodType: 'AB-',
          phone: '(555) 901-2345',
          address: '606 Walnut St, New York, NY',
          registrationDate: '2020-04-12',
          lastVisit: '2023-08-07',
          department: 'Orthopedics',
          doctorAssigned: 'Dr. Lisa Anderson'
        },
        {
          id: 10,
          name: 'Sophia Lee',
          email: 'sophia@example.com',
          age: 31,
          gender: 'Female',
          bloodType: 'A+',
          phone: '(555) 012-3456',
          address: '707 Spruce St, New York, NY',
          registrationDate: '2022-09-30',
          lastVisit: '2023-08-13',
          department: 'Dermatology',
          doctorAssigned: 'Dr. James Wilson'
        }
      ];
      
      setPatients(mockPatients);
      setFilteredPatients(mockPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...patients];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(term) || 
        patient.email.toLowerCase().includes(term) ||
        patient.phone.includes(term)
      );
    }
    
    // Apply gender filter
    if (filters.gender) {
      filtered = filtered.filter(patient => patient.gender === filters.gender);
    }
    
    // Apply age range filter
    if (filters.ageRange) {
      const [min, max] = filters.ageRange.split('-').map(Number);
      filtered = filtered.filter(patient => 
        patient.age >= min && (max ? patient.age <= max : true)
      );
    }
    
    // Apply department filter
    if (filters.department) {
      filtered = filtered.filter(patient => patient.department === filters.department);
    }
    
    setFilteredPatients(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      gender: '',
      ageRange: '',
      department: ''
    });
    setSearchTerm('');
  };

  // Get unique departments for filter dropdown
  const departments = [...new Set(patients.map(patient => patient.department))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Patients Directory</h1>
        <Link 
          to="/hospital/patients/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 inline-flex items-center"
        >
          <FaUserPlus className="mr-2" />
          Add New Patient
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
                placeholder="Search patients..."
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-6 bg-gray-50 p-4 rounded">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={filters.gender}
                  onChange={handleFilterChange}
                  className="w-full rounded border py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                <select
                  name="ageRange"
                  value={filters.ageRange}
                  onChange={handleFilterChange}
                  className="w-full rounded border py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="18-30">18-30</option>
                  <option value="31-45">31-45</option>
                  <option value="46-60">46-60</option>
                  <option value="61-">61+</option>
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
            </div>
          )}
          
          <div className="mt-4">
            <p className="text-gray-600 text-sm">
              {filteredPatients.length} {filteredPatients.length === 1 ? 'patient' : 'patients'} found
            </p>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-800 font-semibold">
                          {patient.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient.age} yrs • {patient.gender} • {patient.bloodType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.email}</div>
                    <div className="text-sm text-gray-500">{patient.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.doctorAssigned}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.lastVisit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <Link to={`/hospital/patients/${patient.id}`} className="text-blue-600 hover:text-blue-900">
                        <FaEye className="inline" title="View" />
                      </Link>
                      <Link to={`/hospital/patients/${patient.id}/edit`} className="text-green-600 hover:text-green-900">
                        <FaEdit className="inline" title="Edit" />
                      </Link>
                      <Link to={`/hospital/patients/${patient.id}/records`} className="text-purple-600 hover:text-purple-900">
                        <FaFileMedical className="inline" title="Medical Records" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No patients found matching your criteria</p>
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

export default PatientsPage; 