import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorProfile from '../../components/doctor/DoctorProfile';
import AuthContext from '../../context/AuthContext.jsx';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const DoctorProfilePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({
    specialization: '',
    experience: 0,
    patientLimit: 0,
    qualifications: '',
    certifications: '',
    languages: '',
    expertise: '',
    availability: {
      monday: { morning: false, afternoon: false, evening: false },
      tuesday: { morning: false, afternoon: false, evening: false },
      wednesday: { morning: false, afternoon: false, evening: false },
      thursday: { morning: false, afternoon: false, evening: false },
      friday: { morning: false, afternoon: false, evening: false },
      saturday: { morning: false, afternoon: false, evening: false },
      sunday: { morning: false, afternoon: false, evening: false },
    }
  });

  useEffect(() => {
    if (user?.role !== 'doctor') {
      navigate('/login');
      return;
    }
    
    fetchDoctorData();
  }, [user, navigate]);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        // Mock doctor data
        const mockDoctor = {
          id: user?.id || '123',
          name: user?.name || 'Dr. Sarah Johnson',
          photo: user?.photo || 'https://ik.imagekit.io/curanet/doctor1.jpg?updatedAt=1680567412863',
          specialization: 'Cardiology',
          qualifications: ['MBBS', 'MD - Cardiology', 'Fellowship in Interventional Cardiology'],
          experience: 12,
          languages: ['English', 'Spanish', 'French'],
          expertise: ['Cardiac Catheterization', 'Echocardiography', 'Heart Failure Management', 'Preventive Cardiology'],
          certifications: ['Board Certified in Cardiology', 'Advanced Cardiac Life Support Instructor'],
          patientLimit: 12,
          currentPatients: 8,
          rating: 4.9,
          reviewCount: 156,
          availability: {
            monday: { morning: true, afternoon: true, evening: false },
            tuesday: { morning: true, afternoon: true, evening: false },
            wednesday: { morning: false, afternoon: true, evening: true },
            thursday: { morning: true, afternoon: true, evening: false },
            friday: { morning: true, afternoon: false, evening: false },
            saturday: { morning: false, afternoon: false, evening: false },
            sunday: { morning: false, afternoon: false, evening: false },
          },
        };
        
        setDoctor(mockDoctor);
        
        // Initialize editable data with doctor data
        setEditableData({
          specialization: mockDoctor.specialization,
          experience: mockDoctor.experience,
          patientLimit: mockDoctor.patientLimit,
          qualifications: mockDoctor.qualifications.join('\n'),
          certifications: mockDoctor.certifications.join('\n'),
          languages: mockDoctor.languages.join(', '),
          expertise: mockDoctor.expertise.join('\n'),
          availability: { ...mockDoctor.availability }
        });
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
      toast.error('Failed to load doctor profile');
      setLoading(false);
    }
  };

  const handleEditableDataChange = (e) => {
    const { name, value } = e.target;
    setEditableData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (day, timeSlot) => {
    setEditableData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [timeSlot]: !prev.availability[day][timeSlot]
        }
      }
    }));
  };

  const handleSaveProfile = () => {
    try {
      // Format data back to the structure expected by DoctorProfile
      const updatedDoctor = {
        ...doctor,
        specialization: editableData.specialization,
        experience: parseInt(editableData.experience, 10),
        patientLimit: parseInt(editableData.patientLimit, 10),
        qualifications: editableData.qualifications.split('\n').filter(item => item.trim()),
        certifications: editableData.certifications.split('\n').filter(item => item.trim()),
        languages: editableData.languages.split(',').map(item => item.trim()).filter(Boolean),
        expertise: editableData.expertise.split('\n').filter(item => item.trim()),
        availability: editableData.availability,
      };
      
      // In a real app, this would be an API call to update the doctor profile
      setDoctor(updatedDoctor);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Doctor Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary"
          >
            <FaEdit className="mr-2" /> Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSaveProfile}
              className="btn btn-success"
            >
              <FaSave className="mr-2" /> Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                // Reset editable data to current doctor data
                setEditableData({
                  specialization: doctor.specialization,
                  experience: doctor.experience,
                  patientLimit: doctor.patientLimit,
                  qualifications: doctor.qualifications.join('\n'),
                  certifications: doctor.certifications.join('\n'),
                  languages: doctor.languages.join(', '),
                  expertise: doctor.expertise.join('\n'),
                  availability: { ...doctor.availability }
                });
              }}
              className="btn btn-secondary"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* View-only doctor profile component in the first column */}
          <div className="lg:col-span-1">
            <DoctorProfile doctor={doctor} />
          </div>
          
          {/* Edit form in the second and third columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Professional Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={editableData.specialization}
                    onChange={handleEditableDataChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={editableData.experience}
                    onChange={handleEditableDataChange}
                    className="w-full p-2 border rounded-md"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Patient Limit
                  </label>
                  <input
                    type="number"
                    name="patientLimit"
                    value={editableData.patientLimit}
                    onChange={handleEditableDataChange}
                    className="w-full p-2 border rounded-md"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Languages (comma separated)
                  </label>
                  <input
                    type="text"
                    name="languages"
                    value={editableData.languages}
                    onChange={handleEditableDataChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="English, Spanish, etc."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualifications (one per line)
                  </label>
                  <textarea
                    name="qualifications"
                    value={editableData.qualifications}
                    onChange={handleEditableDataChange}
                    rows="4"
                    className="w-full p-2 border rounded-md"
                    placeholder="MBBS&#10;MD - Specialization&#10;Other qualification"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certifications (one per line)
                  </label>
                  <textarea
                    name="certifications"
                    value={editableData.certifications}
                    onChange={handleEditableDataChange}
                    rows="4"
                    className="w-full p-2 border rounded-md"
                    placeholder="Board Certification&#10;Other certification"
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Areas of Expertise (one per line)
                </label>
                <textarea
                  name="expertise"
                  value={editableData.expertise}
                  onChange={handleEditableDataChange}
                  rows="4"
                  className="w-full p-2 border rounded-md"
                  placeholder="Area 1&#10;Area 2&#10;Area 3"
                ></textarea>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Availability Schedule</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                      <div key={idx} className="text-center font-medium">{day}</div>
                    ))}
                  </div>
                  
                  {/* Morning slots */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">Morning (8am - 12pm)</div>
                    <div className="grid grid-cols-7 gap-2">
                      {Object.keys(editableData.availability).map((day, idx) => (
                        <div key={idx} className="text-center">
                          <button
                            type="button"
                            onClick={() => handleAvailabilityChange(day, 'morning')}
                            className={`w-8 h-8 rounded-full focus:outline-none ${
                              editableData.availability[day].morning
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-500'
                            }`}
                          >
                            {editableData.availability[day].morning ? '✓' : '✕'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Afternoon slots */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">Afternoon (12pm - 4pm)</div>
                    <div className="grid grid-cols-7 gap-2">
                      {Object.keys(editableData.availability).map((day, idx) => (
                        <div key={idx} className="text-center">
                          <button
                            type="button"
                            onClick={() => handleAvailabilityChange(day, 'afternoon')}
                            className={`w-8 h-8 rounded-full focus:outline-none ${
                              editableData.availability[day].afternoon
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-500'
                            }`}
                          >
                            {editableData.availability[day].afternoon ? '✓' : '✕'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Evening slots */}
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2">Evening (4pm - 8pm)</div>
                    <div className="grid grid-cols-7 gap-2">
                      {Object.keys(editableData.availability).map((day, idx) => (
                        <div key={idx} className="text-center">
                          <button
                            type="button"
                            onClick={() => handleAvailabilityChange(day, 'evening')}
                            className={`w-8 h-8 rounded-full focus:outline-none ${
                              editableData.availability[day].evening
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-500'
                            }`}
                          >
                            {editableData.availability[day].evening ? '✓' : '✕'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <DoctorProfile doctor={doctor} />
      )}
    </div>
  );
};

export default DoctorProfilePage;