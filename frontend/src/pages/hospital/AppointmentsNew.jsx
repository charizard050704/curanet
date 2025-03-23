import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarPlus } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

const AppointmentsNew = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Cardiology' },
    { id: 2, name: 'Neurology' },
    { id: 3, name: 'Orthopedics' },
    { id: 4, name: 'Pediatrics' },
    { id: 5, name: 'General Medicine' }
  ]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patient: '',
    department: '',
    doctor: '',
    date: null,
    time: '',
    notes: '',
    priority: 'normal'
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock patients data
      const mockPatients = [
        { id: 1, name: 'John Smith', email: 'john@example.com' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com' },
        { id: 3, name: 'Robert Davis', email: 'robert@example.com' },
        { id: 4, name: 'Emma Wilson', email: 'emma@example.com' },
        { id: 5, name: 'Michael Brown', email: 'michael@example.com' }
      ];
      
      setPatients(mockPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    setFormData(prev => ({ ...prev, department: departmentId, doctor: '' }));
    
    if (!departmentId) {
      setDoctors([]);
      return;
    }
    
    setLoadingDoctors(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock doctors data
      const mockDoctors = [
        { id: 1, name: 'Dr. Sarah Johnson', department: '1' },
        { id: 2, name: 'Dr. Michael Chen', department: '1' },
        { id: 3, name: 'Dr. Emily Brown', department: '2' },
        { id: 4, name: 'Dr. David Wilson', department: '2' },
        { id: 5, name: 'Dr. Lisa Anderson', department: '3' },
        { id: 6, name: 'Dr. James Taylor', department: '3' },
        { id: 7, name: 'Dr. Maria Garcia', department: '4' },
        { id: 8, name: 'Dr. Robert Lee', department: '4' },
        { id: 9, name: 'Dr. Jennifer White', department: '5' },
        { id: 10, name: 'Dr. William Davis', department: '5' }
      ];
      
      setDoctors(mockDoctors.filter(doctor => doctor.department === departmentId));
    } catch (error) {
      console.error('Error loading doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.patient || !formData.department || !formData.doctor || !formData.date || !formData.time) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Appointment scheduled successfully');
      navigate('/hospital');
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast.error('Failed to schedule appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-green-600 flex items-center">
          <FaCalendarPlus className="text-white text-xl mr-3" />
          <h1 className="text-2xl font-bold text-white">Schedule New Appointment</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient *</label>
            <select
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
              disabled={loadingPatients}
            >
              <option value="">Select patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.email}
                </option>
              ))}
            </select>
            {loadingPatients && (
              <p className="mt-1 text-sm text-gray-500">Loading patients...</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Department *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleDepartmentChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Select department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Doctor *</label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
              disabled={!formData.department || loadingDoctors}
            >
              <option value="">Select doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
            {loadingDoctors && (
              <p className="mt-1 text-sm text-gray-500">Loading doctors...</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date *</label>
              <DatePicker
                selected={formData.date}
                onChange={handleDateChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select date"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Time *</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              >
                <option value="">Select time</option>
                <option value="09:00">9:00 AM</option>
                <option value="09:30">9:30 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="10:30">10:30 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="11:30">11:30 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="14:30">2:30 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="15:30">3:30 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="16:30">4:30 PM</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Additional notes or special instructions..."
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/hospital')}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {loading ? 'Scheduling...' : 'Schedule Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentsNew; 