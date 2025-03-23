import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaUser, FaFileMedical, FaPrescription, FaNotesMedical, 
  FaChartLine, FaCalendarAlt, FaUpload, FaPrint
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import VitalsVisualizer from '../../components/patient/VitalsVisualizer';

const PatientDetail = () => {
  const { patientId } = useParams();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [vitals, setVitals] = useState({
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    bmi: ''
  });
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      // In a real app, this would be an API call with patientId
      setTimeout(() => {
        const mockPatient = {
          id: patientId,
          name: 'John Smith',
          age: 45,
          gender: 'Male',
          dateOfBirth: '1978-05-15',
          bloodType: 'O+',
          contactNumber: '+1 555-123-4567',
          email: 'john.smith@example.com',
          address: '123 Main St, Anytown, USA',
          emergencyContact: 'Jane Smith (Wife) - +1 555-987-6543',
          allergies: ['Penicillin', 'Peanuts'],
          chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
          currentMedications: [
            { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
            { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily with meals' }
          ],
          recentVisits: [
            { date: '2023-08-01', reason: 'Regular checkup', doctor: 'Dr. Sarah Johnson' },
            { date: '2023-06-15', reason: 'Flu symptoms', doctor: 'Dr. Michael Chen' }
          ],
          vitalSigns: {
            temperature: '98.6°F',
            bloodPressure: '130/85',
            heartRate: '72 bpm',
            respiratoryRate: '16 bpm',
            oxygenSaturation: '98%',
            weight: '180 lbs',
            height: '5\'10"',
            bmi: '25.8'
          },
          documents: [
            { id: 1, name: 'Blood Test Results.pdf', date: '2023-08-01', type: 'Lab Report' },
            { id: 2, name: 'Chest X-Ray.jpg', date: '2023-06-15', type: 'Radiology' },
            { id: 3, name: 'Medical History.pdf', date: '2023-05-10', type: 'Clinical Notes' }
          ]
        };
        
        setPatient(mockPatient);
        setVitals(mockPatient.vitalSigns);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      toast.error('Failed to load patient data');
      setLoading(false);
    }
  };

  const handleVitalsChange = (e) => {
    const { name, value } = e.target;
    setVitals(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveVitals = () => {
    // In a real app, this would be an API call
    toast.success('Vital signs updated successfully');
  };

  const handleSaveNotes = () => {
    if (!notes.trim()) {
      toast.error('Please enter notes before saving');
      return;
    }
    
    // In a real app, this would be an API call
    toast.success('Clinical notes saved successfully');
    setNotes('');
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadDocument = () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    // In a real app, this would be an API call
    toast.success(`Document "${selectedFile.name}" uploaded successfully`);
    setSelectedFile(null);
    setShowUploadModal(false);
  };

  const handleScanDocument = () => {
    toast.success('Scanner interface opened. Please place document on scanner.');
    // In a real app, this would open scanner interface
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Patient not found</p>
        <Link to="/doctor" className="text-blue-500 hover:underline mt-4 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Patient Header */}
      <div className="card mb-8">
        <div className="card-body">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-800">{patient.name}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="badge badge-blue">ID: {patient.id}</span>
                <span className="badge badge-gray">{patient.age} years</span>
                <span className="badge badge-gray">{patient.gender}</span>
                <span className="badge badge-red">Blood Type: {patient.bloodType}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={`/doctor/write-prescription/${patient.id}`} className="btn btn-primary btn-sm">
                <FaPrescription className="mr-2" /> Write Prescription
              </Link>
              <button onClick={() => setShowUploadModal(true)} className="btn btn-secondary btn-sm">
                <FaUpload className="mr-2" /> Upload Document
              </button>
              <button onClick={handleScanDocument} className="btn btn-secondary btn-sm">
                <FaPrint className="mr-2" /> Scan Document
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex flex-wrap space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-1 ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaUser className="inline mr-1" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('vitals')}
            className={`pb-2 px-1 ${
              activeTab === 'vitals'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaChartLine className="inline mr-1" /> Vital Signs
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`pb-2 px-1 ${
              activeTab === 'visits'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaCalendarAlt className="inline mr-1" /> Visit History
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-2 px-1 ${
              activeTab === 'documents'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaFileMedical className="inline mr-1" /> Documents
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-2 px-1 ${
              activeTab === 'notes'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaNotesMedical className="inline mr-1" /> Clinical Notes
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header bg-blue-50">
              <h3 className="font-semibold">Personal Information</h3>
            </div>
            <div className="card-body">
              <div className="space-y-2">
                <p><span className="font-medium">Date of Birth:</span> {patient.dateOfBirth}</p>
                <p><span className="font-medium">Blood Type:</span> {patient.bloodType}</p>
                <p><span className="font-medium">Contact:</span> {patient.contactNumber}</p>
                <p><span className="font-medium">Email:</span> {patient.email}</p>
                <p><span className="font-medium">Address:</span> {patient.address}</p>
                <p><span className="font-medium">Emergency Contact:</span> {patient.emergencyContact}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-blue-50">
              <h3 className="font-semibold">Medical Information</h3>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Allergies</h4>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <span key={index} className="badge badge-red">{allergy}</span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Chronic Conditions</h4>
                <div className="flex flex-wrap gap-2">
                  {patient.chronicConditions.map((condition, index) => (
                    <span key={index} className="badge badge-yellow">{condition}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Current Medications</h4>
                <div className="space-y-2">
                  {patient.currentMedications.map((medication, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded-md">
                      <p className="font-medium">{medication.name}</p>
                      <p className="text-sm text-gray-600">
                        {medication.dosage} - {medication.frequency}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vitals' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header bg-blue-50 flex justify-between items-center">
              <h3 className="font-semibold">Vital Signs</h3>
              <button onClick={handleSaveVitals} className="btn btn-primary btn-sm">
                Save Vitals
              </button>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                  <input
                    type="text"
                    name="temperature"
                    value={vitals.temperature}
                    onChange={handleVitalsChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. 98.6°F"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    name="bloodPressure"
                    value={vitals.bloodPressure}
                    onChange={handleVitalsChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. 120/80"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate</label>
                  <input
                    type="text"
                    name="heartRate"
                    value={vitals.heartRate}
                    onChange={handleVitalsChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. 72 bpm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory Rate</label>
                  <input
                    type="text"
                    name="respiratoryRate"
                    value={vitals.respiratoryRate}
                    onChange={handleVitalsChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. 16 bpm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Oxygen Saturation</label>
                  <input
                    type="text"
                    name="oxygenSaturation"
                    value={vitals.oxygenSaturation}
                    onChange={handleVitalsChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. 98%"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <input
                    type="text"
                    name="weight"
                    value={vitals.weight}
                    onChange={handleVitalsChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. 180 lbs"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                  <input
                    type="text"
                    name="height"
                    value={vitals.height}
                    onChange={handleVitalsChange}
                    className="w-full p-2 border rounded-md"
                    placeholder={'e.g. 5\'10"'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
                  <input
                    type="text"
                    name="bmi"
                    value={vitals.bmi}
                    onChange={handleVitalsChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. 25.8"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Vitals Visualizer Component */}
          <VitalsVisualizer patient={patient} vitals={vitals} />
        </div>
      )}

      {activeTab === 'visits' && (
        <div className="card">
          <div className="card-header bg-blue-50">
            <h3 className="font-semibold">Visit History</h3>
          </div>
          <div className="card-body">
            {patient.recentVisits.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No visits recorded</p>
            ) : (
              <div className="space-y-4">
                {patient.recentVisits.map((visit, index) => (
                  <div key={index} className="p-4 border rounded-md hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{visit.date}</p>
                        <p className="text-gray-600">{visit.reason}</p>
                        <p className="text-sm text-gray-500">{visit.doctor}</p>
                      </div>
                      <Link to={`/doctor/visit-details/${patient.id}/${index}`} className="text-blue-500 hover:underline">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 text-center">
              <Link to={`/doctor/new-visit/${patient.id}`} className="btn btn-primary">
                Record New Visit
              </Link>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="card">
          <div className="card-header bg-blue-50 flex justify-between items-center">
            <h3 className="font-semibold">Medical Documents</h3>
            <div>
              <button onClick={() => setShowUploadModal(true)} className="btn btn-primary btn-sm mr-2">
                <FaUpload className="mr-1" /> Upload
              </button>
              <button onClick={handleScanDocument} className="btn btn-secondary btn-sm">
                <FaPrint className="mr-1" /> Scan
              </button>
            </div>
          </div>
          <div className="card-body">
            {patient.documents.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No documents found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patient.documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{doc.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{doc.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            View
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="card">
          <div className="card-header bg-blue-50">
            <h3 className="font-semibold">Clinical Notes</h3>
          </div>
          <div className="card-body">
            <div className="mb-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="6"
                className="w-full p-3 border rounded-md"
                placeholder="Enter clinical notes, observations, and treatment plans..."
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button onClick={handleSaveNotes} className="btn btn-primary">
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-4 border-b">
              <h3 className="text-xl font-semibold">Upload Document</h3>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Document
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Select document type</option>
                  <option value="lab">Lab Report</option>
                  <option value="radiology">Radiology</option>
                  <option value="clinical">Clinical Notes</option>
                  <option value="prescription">Prescription</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  rows="2"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter a brief description..."
                ></textarea>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadDocument}
                className="btn btn-primary"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetail; 