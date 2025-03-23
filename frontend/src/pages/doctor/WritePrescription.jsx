import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaFileMedical, FaPrint, FaHistory, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

const WritePrescription = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [medications, setMedications] = useState([
    { id: 1, medication: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  const [showMedHistory, setShowMedHistory] = useState(false);
  const [medicationSuggestions, setMedicationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  // Medication database
  const medicationDatabase = [
    { name: 'Amoxicillin', commonDosages: ['250mg', '500mg'], commonFrequencies: ['Three times daily', 'Twice daily'] },
    { name: 'Lisinopril', commonDosages: ['5mg', '10mg', '20mg'], commonFrequencies: ['Once daily'] },
    { name: 'Atorvastatin', commonDosages: ['10mg', '20mg', '40mg'], commonFrequencies: ['Once daily at bedtime'] },
    { name: 'Metformin', commonDosages: ['500mg', '850mg', '1000mg'], commonFrequencies: ['Twice daily with meals', 'Three times daily with meals'] },
    { name: 'Amlodipine', commonDosages: ['2.5mg', '5mg', '10mg'], commonFrequencies: ['Once daily'] },
    { name: 'Omeprazole', commonDosages: ['20mg', '40mg'], commonFrequencies: ['Once daily before breakfast'] },
    { name: 'Losartan', commonDosages: ['25mg', '50mg', '100mg'], commonFrequencies: ['Once daily', 'Twice daily'] },
    { name: 'Albuterol', commonDosages: ['90mcg', '108mcg'], commonFrequencies: ['As needed', 'Every 4-6 hours as needed'] },
    { name: 'Levothyroxine', commonDosages: ['25mcg', '50mcg', '75mcg', '100mcg'], commonFrequencies: ['Once daily on empty stomach'] },
    { name: 'Gabapentin', commonDosages: ['300mg', '600mg'], commonFrequencies: ['Three times daily', 'At bedtime'] }
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

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    } else {
      setLoading(false);
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      // In a real app, this would be an API call with patientId
      setTimeout(() => {
        const mockPatient = {
          id: patientId || 'P1001',
          name: 'John Smith',
          age: 45,
          gender: 'Male',
          dateOfBirth: '1978-05-15',
          bloodType: 'O+',
          allergies: ['Penicillin', 'Peanuts'],
          chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
          medicationHistory: [
            { medication: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', lastPrescribed: '2023-07-05', status: 'Active' },
            { medication: 'Metformin', dosage: '500mg', frequency: 'Twice daily with meals', lastPrescribed: '2023-07-05', status: 'Active' },
            { medication: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', lastPrescribed: '2023-05-12', status: 'Completed' }
          ]
        };
        
        setPatient(mockPatient);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      toast.error('Failed to load patient data');
      setLoading(false);
    }
  };

  const handleAddMedication = () => {
    const newId = Math.max(...medications.map(med => med.id), 0) + 1;
    setMedications([...medications, { id: newId, medication: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const handleRemoveMedication = (id) => {
    if (medications.length === 1) {
      toast.error('You must have at least one medication');
      return;
    }
    setMedications(medications.filter(med => med.id !== id));
  };

  const handleMedicationChange = (id, field, value) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
    
    if (field === 'medication' && value.length > 2) {
      // Filter medication suggestions
      const filtered = medicationDatabase.filter(med => 
        med.name.toLowerCase().includes(value.toLowerCase())
      );
      setMedicationSuggestions(filtered);
      setShowSuggestions(true);
      setActiveInput(id);
    } else if (field === 'medication') {
      setShowSuggestions(false);
    }
  };

  const handleSelectMedication = (id, medication) => {
    // Update the medication field and suggest default dosage and frequency
    setMedications(medications.map(med => 
      med.id === id ? { 
        ...med, 
        medication: medication.name, 
        dosage: medication.commonDosages.length === 1 ? medication.commonDosages[0] : med.dosage,
        frequency: medication.commonFrequencies.length === 1 ? medication.commonFrequencies[0] : med.frequency
      } : med
    ));
    setShowSuggestions(false);
  };

  const handleSavePrescription = () => {
    // Validate the form
    const emptyFields = medications.some(med => 
      !med.medication || !med.dosage || !med.frequency || !med.duration
    );
    
    if (emptyFields) {
      toast.error('Please fill out all required fields for each medication');
      return;
    }
    
    if (!diagnosis) {
      toast.error('Please enter a diagnosis');
      return;
    }
    
    // In a real app, this would be an API call
    toast.success('Prescription saved successfully');
    
    // Navigate back to patient detail or dashboard
    if (patientId) {
      navigate(`/doctor/patients/${patientId}`);
    } else {
      navigate('/doctor');
    }
  };

  const handlePrintPrescription = () => {
    // In a real app, this would generate a PDF for printing
    toast.success('Prescription sent to printer');
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
      {/* Prescription Header */}
      <div className="card mb-8">
        <div className="card-body">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-800">Write Prescription</h1>
              {patient && (
                <div className="mt-2">
                  <p className="text-lg">Patient: {patient.name}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="badge badge-blue">ID: {patient.id}</span>
                    <span className="badge badge-gray">{patient.age} years</span>
                    <span className="badge badge-gray">{patient.gender}</span>
                    <span className="badge badge-red">Blood Type: {patient.bloodType}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setShowMedHistory(!showMedHistory)} className="btn btn-secondary btn-sm">
                <FaHistory className="mr-2" /> 
                {showMedHistory ? 'Hide Medication History' : 'Show Medication History'}
              </button>
              <button onClick={handlePrintPrescription} className="btn btn-secondary btn-sm">
                <FaPrint className="mr-2" /> Print Prescription
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Medication History */}
      {showMedHistory && patient && (
        <div className="card mb-8">
          <div className="card-header bg-blue-50">
            <h3 className="font-semibold">Medication History</h3>
          </div>
          <div className="card-body">
            {patient.allergies.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-red-600 mb-2">Allergies</h4>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <span key={index} className="badge badge-red">{allergy}</span>
                  ))}
                </div>
              </div>
            )}
            
            <h4 className="font-medium text-gray-700 mb-2">Current and Past Medications</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medication
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dosage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Prescribed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patient.medicationHistory.map((med, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{med.medication}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{med.dosage}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{med.frequency}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{med.lastPrescribed}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${med.status === 'Active' ? 'bg-green-100 text-green-800' : 
                            med.status === 'Completed' ? 'bg-gray-100 text-gray-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {med.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Diagnosis */}
      <div className="card mb-6">
        <div className="card-header bg-blue-50">
          <h3 className="font-semibold">Diagnosis</h3>
        </div>
        <div className="card-body">
          <textarea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            rows="2"
            className="w-full p-3 border rounded-md"
            placeholder="Enter diagnosis or reason for prescription..."
            required
          ></textarea>
        </div>
      </div>

      {/* Medications */}
      <div className="card mb-6">
        <div className="card-header bg-blue-50 flex justify-between items-center">
          <h3 className="font-semibold">Medications</h3>
          <button 
            onClick={handleAddMedication} 
            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors"
          >
            + Add Medication
          </button>
        </div>
        <div className="card-body">
          {medications.map((med, index) => (
            <div key={med.id} className={`p-4 ${index > 0 ? 'border-t' : ''}`}>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Medication #{index + 1}</h4>
                {medications.length > 1 && (
                  <button 
                    onClick={() => handleRemoveMedication(med.id)} 
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medication *
                  </label>
                  <input
                    type="text"
                    value={med.medication}
                    onChange={(e) => handleMedicationChange(med.id, 'medication', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Start typing for suggestions..."
                    required
                    onFocus={() => {
                      if (med.medication.length > 2) {
                        const filtered = medicationDatabase.filter(m => 
                          m.name.toLowerCase().includes(med.medication.toLowerCase())
                        );
                        setMedicationSuggestions(filtered);
                        setShowSuggestions(true);
                        setActiveInput(med.id);
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding suggestions to allow clicks
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                  />
                  
                  {showSuggestions && activeInput === med.id && medicationSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {medicationSuggestions.map((medication, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleSelectMedication(med.id, medication)}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        >
                          {medication.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosage *
                  </label>
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) => handleMedicationChange(med.id, 'dosage', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. 250mg, 500mg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency *
                  </label>
                  <select
                    value={med.frequency}
                    onChange={(e) => handleMedicationChange(med.id, 'frequency', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select frequency</option>
                    {frequencyOptions.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                    <option value="custom">Other (specify in instructions)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration *
                  </label>
                  <select
                    value={med.duration}
                    onChange={(e) => handleMedicationChange(med.id, 'duration', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select duration</option>
                    {durationOptions.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                    <option value="custom">Other (specify in instructions)</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Instructions
                  </label>
                  <textarea
                    value={med.instructions}
                    onChange={(e) => handleMedicationChange(med.id, 'instructions', e.target.value)}
                    rows="2"
                    className="w-full p-2 border rounded-md"
                    placeholder="Additional instructions, side effects to watch for, etc."
                  ></textarea>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="card mb-8">
        <div className="card-header bg-blue-50">
          <h3 className="font-semibold">Additional Notes</h3>
        </div>
        <div className="card-body">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            className="w-full p-3 border rounded-md"
            placeholder="Additional instructions, follow-up recommendations, etc."
          ></textarea>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Link to={patientId ? `/doctor/patients/${patientId}` : '/doctor'} className="btn btn-secondary">
          Cancel
        </Link>
        <button onClick={handleSavePrescription} className="btn btn-primary">
          <FaCheck className="mr-2" /> Save Prescription
        </button>
      </div>
    </div>
  );
};

export default WritePrescription; 