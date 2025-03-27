import { useState, useContext, useEffect } from 'react';
import { FaUserInjured, FaCalendarCheck, FaNotesMedical, FaPrescription, FaUserMd, FaUserCog, FaChartLine } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import DoctorProfile from '../../components/doctor/DoctorProfile';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    appointmentsThisWeek: 0,
    prescriptionsThisMonth: 0
  });
  const [prescriptionForm, setPrescriptionForm] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    notes: ''
  });
  
  // Medication suggestions for autocomplete
  const medicationSuggestions = [
    { name: 'Amoxicillin', commonDosages: ['250mg', '500mg'], commonFrequencies: ['Three times daily', 'Twice daily'] },
    { name: 'Lisinopril', commonDosages: ['5mg', '10mg', '20mg'], commonFrequencies: ['Once daily'] },
    { name: 'Atorvastatin', commonDosages: ['10mg', '20mg', '40mg'], commonFrequencies: ['Once daily at bedtime'] },
    { name: 'Metformin', commonDosages: ['500mg', '850mg', '1000mg'], commonFrequencies: ['Twice daily with meals', 'Three times daily with meals'] },
    { name: 'Amlodipine', commonDosages: ['2.5mg', '5mg', '10mg'], commonFrequencies: ['Once daily'] },
    { name: 'Omeprazole', commonDosages: ['20mg', '40mg'], commonFrequencies: ['Once daily before breakfast'] },
    { name: 'Losartan', commonDosages: ['25mg', '50mg', '100mg'], commonFrequencies: ['Once daily', 'Twice daily'] }
  ];
  
  // Standard frequency options
  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
    'With meals',
    'Before meals',
    'After meals',
    'At bedtime'
  ];
  
  // Duration options
  const durationOptions = [
    '3 days',
    '5 days',
    '7 days',
    '10 days',
    '14 days',
    '1 month',
    '2 months',
    '3 months',
    '6 months',
    'Indefinitely'
  ];
  
  // Selected medication for suggestions
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showMedicationSuggestions, setShowMedicationSuggestions] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchDoctorData();
  }, []);
  
  // Update dosage and frequency suggestions when medication changes
  useEffect(() => {
    if (selectedMedication) {
      // If there's only one common dosage, auto-select it
      if (selectedMedication.commonDosages.length === 1) {
        setPrescriptionForm(prev => ({
          ...prev,
          dosage: selectedMedication.commonDosages[0]
        }));
      }
      
      // If there's only one common frequency, auto-select it
      if (selectedMedication.commonFrequencies.length === 1) {
        setPrescriptionForm(prev => ({
          ...prev,
          frequency: selectedMedication.commonFrequencies[0]
        }));
      }
    }
  }, [selectedMedication]);

  const fetchDoctorData = async () => {
    try {
    } catch (error) {
      console.error('Error fetching doctor data:', error);
      toast.error('Failed to load doctor profile');
    }
  };

  const fetchAppointments = async () => {
    try {  
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
      setLoading(false);
    }
  };

  const handleStartConsultation = (appointment) => {
    setSelectedPatient(appointment);
    // Update appointment status
    const updatedAppointments = appointments.map(app => 
      app.id === appointment.id ? { ...app, status: 'in-progress' } : app
    );
    setAppointments(updatedAppointments);
    toast.success(`Started consultation with ${appointment.patientName}`);
  };
  
  const handleMedicationChange = (e) => {
    const medicationName = e.target.value;
    setPrescriptionForm({...prescriptionForm, medication: medicationName});
    
    if (medicationName.length > 2) {
      setShowMedicationSuggestions(true);
    } else {
      setShowMedicationSuggestions(false);
      setSelectedMedication(null);
    }
  };
  
  const handleSelectMedication = (medication) => {
    setPrescriptionForm({...prescriptionForm, medication: medication.name});
    setSelectedMedication(medication);
    setShowMedicationSuggestions(false);
  };

  const handlePrescriptionSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatient) return;
    
    // Form validation
    if (!prescriptionForm.medication || !prescriptionForm.dosage || !prescriptionForm.frequency || !prescriptionForm.duration) {
      toast.error('Please fill all required fields');
      return;
    }

    // This would be an API call in production
    toast.success('Prescription saved successfully');
    
    // Clear form and update appointment status
    setPrescriptionForm({
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      notes: ''
    });
    
    const updatedAppointments = appointments.map(app => 
      app.id === selectedPatient.id ? { ...app, status: 'completed' } : app
    );
    setAppointments(updatedAppointments);
    setSelectedPatient(null);
    setSelectedMedication(null);
  };

  if (loading || !doctor) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Filter medication suggestions based on current input
  const filteredMedications = medicationSuggestions.filter(medication => 
    medication.name.toLowerCase().includes(prescriptionForm.medication.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome Dr. {user?.name}</h1>
        <p className="text-gray-600">Manage your appointments and patient records</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <FaUserMd className="text-blue-500" />
            </div>
            <div>
              <p className="text-gray-500">Total Patients</p>
              <h3 className="text-2xl font-bold">{dashboardStats.totalPatients}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <FaCalendarCheck className="text-green-500" />
            </div>
            <div>
              <p className="text-gray-500">Today's Appointments</p>
              <h3 className="text-2xl font-bold">{dashboardStats.appointmentsToday}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <FaCalendarCheck className="text-yellow-500" />
            </div>
            <div>
              <p className="text-gray-500">This Week's Appointments</p>
              <h3 className="text-2xl font-bold">{dashboardStats.appointmentsThisWeek}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <FaPrescription className="text-purple-500" />
            </div>
            <div>
              <p className="text-gray-500">Prescriptions This Month</p>
              <h3 className="text-2xl font-bold">{dashboardStats.prescriptionsThisMonth}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Doctor Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-blue-50 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Profile</h2>
              <Link to="/doctor/profile" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                <FaUserCog className="mr-1" /> Edit Profile
              </Link>
            </div>
            <div className="p-4">
              {doctor && <DoctorProfile doctor={doctor} />}
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header bg-blue-50 p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaCalendarCheck className="mr-2 text-blue-500" />
                  Today's Appointments
                </h2>
                <Link to="/doctor/appointments" className="text-blue-600 hover:text-blue-800 text-sm">
                  View All Appointments
                </Link>
              </div>
            </div>
            <div className="card-body p-4">
              {appointments.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No appointments scheduled for today</p>
              ) : (
                appointments.map(appointment => (
                  <div key={appointment.id} className="mb-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{appointment.patientName}</h3>
                        <p className="text-sm text-gray-500">ID: {appointment.patientId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-600 font-medium">{appointment.time}</p>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${appointment.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' : 
                          appointment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                          {appointment.status === 'waiting' ? 'Waiting' : 
                          appointment.status === 'in-progress' ? 'In Progress' : 'Completed'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">
                        <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                      </p>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Temperature:</span> {appointment.vitalSigns.temperature}
                        </div>
                        <div>
                          <span className="font-medium">BP:</span> {appointment.vitalSigns.bloodPressure}
                        </div>
                        <div>
                          <span className="font-medium">HR:</span> {appointment.vitalSigns.heartRate}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      {appointment.status === 'waiting' && (
                        <button 
                          onClick={() => handleStartConsultation(appointment)}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                        >
                          Start Consultation
                        </button>
                      )}
                      {appointment.status === 'in-progress' && (
                        <button 
                          onClick={() => setSelectedPatient(appointment)}
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                        >
                          Continue Consultation
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Form */}
      {selectedPatient && (
        <div className="card">
          <div className="card-header bg-green-50 p-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaPrescription className="mr-2 text-green-500" />
              Write Prescription - {selectedPatient.patientName}
            </h2>
          </div>
          <div className="card-body p-4">
            {/* Patient Info */}
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-700 mb-2">Patient Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="font-medium">Age:</span> {selectedPatient.age}</p>
                <p><span className="font-medium">Gender:</span> {selectedPatient.gender}</p>
                <p><span className="font-medium">Allergies:</span> {selectedPatient.allergies || 'None'}</p>
                <p className="col-span-2"><span className="font-medium">Symptoms:</span> {selectedPatient.symptoms}</p>
              </div>
              <div className="mt-2 pt-2 border-t border-blue-100">
                <h4 className="font-medium text-blue-700 mb-1">Vital Signs</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <p><span className="font-medium">Temp:</span> {selectedPatient.vitalSigns.temperature}</p>
                  <p><span className="font-medium">BP:</span> {selectedPatient.vitalSigns.bloodPressure}</p>
                  <p><span className="font-medium">HR:</span> {selectedPatient.vitalSigns.heartRate}</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Medication *</label>
                <input
                  type="text"
                  value={prescriptionForm.medication}
                  onChange={handleMedicationChange}
                  placeholder="Start typing to see suggestions..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                {showMedicationSuggestions && filteredMedications.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredMedications.map((medication, index) => (
                      <div 
                        key={index}
                        onClick={() => handleSelectMedication(medication)}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                      >
                        {medication.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dosage *</label>
                  {selectedMedication ? (
                    <select
                      value={prescriptionForm.dosage}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, dosage: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select dosage</option>
                      {selectedMedication.commonDosages.map((dosage, index) => (
                        <option key={index} value={dosage}>{dosage}</option>
                      ))}
                      <option value="custom">Custom dosage</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={prescriptionForm.dosage}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, dosage: e.target.value})}
                      placeholder="e.g., 500mg"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frequency *</label>
                  {selectedMedication && selectedMedication.commonFrequencies.length > 0 ? (
                    <select
                      value={prescriptionForm.frequency}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, frequency: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select frequency</option>
                      {selectedMedication.commonFrequencies.map((freq, index) => (
                        <option key={index} value={freq}>{freq}</option>
                      ))}
                      <option value="custom">Custom frequency</option>
                    </select>
                  ) : (
                    <select
                      value={prescriptionForm.frequency}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, frequency: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select frequency</option>
                      {frequencyOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Duration *</label>
                <select
                  value={prescriptionForm.duration}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, duration: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select duration</option>
                  {durationOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                  <option value="custom">Custom duration</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Additional Instructions</label>
                <textarea
                  value={prescriptionForm.notes}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, notes: e.target.value})}
                  rows="3"
                  placeholder="Special instructions, side effects to watch for, etc."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard; 
