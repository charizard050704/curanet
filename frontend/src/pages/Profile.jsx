import { useState, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaVenusMars } from 'react-icons/fa';
import AuthContext from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.contactNumber || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    address: user?.address || '',
    bloodGroup: user?.bloodGroup || '',
    allergies: user?.allergies || '',
    emergencyContact: user?.emergencyContact || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.contactNumber || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
      address: user?.address || '',
      bloodGroup: user?.bloodGroup || '',
      allergies: user?.allergies || '',
      emergencyContact: user?.emergencyContact || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="md:flex">
          <div className="md:w-1/3 bg-blue-50 p-8">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-blue-200 rounded-full flex items-center justify-center">
                <FaUser className="text-4xl text-blue-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">{user?.name}</h2>
              <p className="text-gray-600">{user?.role}</p>
            </div>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          <div className="md:w-2/3 p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-input block w-full pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-input block w-full pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-input block w-full pl-10"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-input block w-full pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaVenusMars className="text-gray-400" />
                      </div>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-select block w-full pl-10"
                      >
                        <option value="">Select gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="3"
                    className="form-textarea mt-1 block w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="form-select mt-1 block w-full"
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Allergies</label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="2"
                    className="form-textarea mt-1 block w-full"
                    placeholder="List any allergies..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="form-input mt-1 block w-full"
                    placeholder="Name and phone number"
                  />
                </div>
              </div>
              
              {isEditing && (
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile; 