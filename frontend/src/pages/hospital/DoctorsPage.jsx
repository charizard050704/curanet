import { useState, useEffect } from 'react';
import { FaUserMd, FaSearch, FaPlus } from 'react-icons/fa';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          const mockDoctors = [
            {
              id: 1,
              name: 'Dr. Sarah Johnson',
              specialization: 'Cardiology',
              department: 'Cardiology',
              email: 'sarah.johnson@hospital.com',
              phone: '+1 (555) 123-4567',
              status: 'active',
              avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
            },
            {
              id: 2,
              name: 'Dr. Michael Chen',
              specialization: 'Neurology',
              department: 'Neurology',
              email: 'michael.chen@hospital.com',
              phone: '+1 (555) 234-5678',
              status: 'active',
              avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
            },
            {
              id: 3,
              name: 'Dr. Jessica Martinez',
              specialization: 'Orthopedics',
              department: 'Orthopedics',
              email: 'jessica.martinez@hospital.com',
              phone: '+1 (555) 345-6789',
              status: 'active',
              avatar: 'https://randomuser.me/api/portraits/women/58.jpg'
            },
            {
              id: 4,
              name: 'Dr. James Wilson',
              specialization: 'Dermatology',
              department: 'Dermatology',
              email: 'james.wilson@hospital.com',
              phone: '+1 (555) 456-7890',
              status: 'leave',
              avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
            },
            {
              id: 5,
              name: 'Dr. Elizabeth Lee',
              specialization: 'Ophthalmology',
              department: 'Ophthalmology',
              email: 'elizabeth.lee@hospital.com',
              phone: '+1 (555) 567-8901',
              status: 'active',
              avatar: 'https://randomuser.me/api/portraits/women/76.jpg'
            },
            {
              id: 6,
              name: 'Dr. Robert Brown',
              specialization: 'Pediatrics',
              department: 'Pediatrics',
              email: 'robert.brown@hospital.com',
              phone: '+1 (555) 678-9012',
              status: 'active',
              avatar: 'https://randomuser.me/api/portraits/men/39.jpg'
            }
          ];

          // Extract unique departments for filter
          const uniqueDepartments = [...new Set(mockDoctors.map(doctor => doctor.department))];
          setDepartments(uniqueDepartments);
          
          setDoctors(mockDoctors);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on search term and department
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === '' || doctor.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-green">Active</span>;
      case 'leave':
        return <span className="badge badge-yellow">On Leave</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaUserMd className="mr-2 text-blue-500" /> Hospital Doctors
        </h1>
        <button className="btn-primary flex items-center">
          <FaPlus className="mr-2" /> Add New Doctor
        </button>
      </div>
      
      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input 
                  type="text" 
                  className="pl-10 pr-4 py-2 border rounded-md w-full" 
                  placeholder="Search by name or specialization" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            
            <div className="w-full md:w-64">
              <select 
                className="border rounded-md px-4 py-2 w-full" 
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Doctors List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <div key={doctor.id} className="card">
              <div className="card-body flex flex-col items-center p-6">
                <img 
                  src={doctor.avatar} 
                  alt={doctor.name} 
                  className="w-24 h-24 rounded-full mb-4 object-cover" 
                />
                <h3 className="text-lg font-semibold text-gray-800">{doctor.name}</h3>
                <p className="text-blue-500 mb-2">{doctor.specialization}</p>
                <p className="text-gray-600 text-sm mb-4">Department: {doctor.department}</p>
                
                {/* Status Badge */}
                <div className="mb-4">
                  {getStatusBadge(doctor.status)}
                </div>
                
                <div className="text-gray-600 text-sm mb-1">
                  <strong>Email:</strong> {doctor.email}
                </div>
                <div className="text-gray-600 text-sm">
                  <strong>Phone:</strong> {doctor.phone}
                </div>
                
                <div className="mt-4 flex space-x-2 w-full">
                  <button className="btn-outline flex-1">Schedule</button>
                  <button className="btn-primary flex-1">View Profile</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && filteredDoctors.length === 0 && (
        <div className="text-center py-8 card">
          <div className="card-body">
            <p className="text-gray-500">No doctors found matching your criteria.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage; 