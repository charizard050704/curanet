import { useState, useEffect, useContext } from 'react';
import { FaPrescription, FaDownload, FaRedo } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const PatientPrescriptions = () => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        const mockPrescriptions = [
          {
            id: 1,
            date: '2023-08-01',
            doctor: 'Dr. Sarah Johnson',
            hospital: 'City General Hospital',
            medications: [
              {
                name: 'Amoxicillin',
                dosage: '500mg',
                frequency: 'Three times daily',
                duration: '7 days',
                instructions: 'Take with food'
              }
            ],
            status: 'active',
            refillable: true
          },
          {
            id: 2,
            date: '2023-07-15',
            doctor: 'Dr. Michael Chen',
            hospital: 'Metro Medical Center',
            medications: [
              {
                name: 'Lisinopril',
                dosage: '10mg',
                frequency: 'Once daily',
                duration: '30 days',
                instructions: 'Take in the morning'
              },
              {
                name: 'Aspirin',
                dosage: '81mg',
                frequency: 'Once daily',
                duration: '30 days',
                instructions: 'Take with food'
              }
            ],
            status: 'active',
            refillable: true
          },
          {
            id: 3,
            date: '2023-06-10',
            doctor: 'Dr. Jessica Martinez',
            hospital: 'City General Hospital',
            medications: [
              {
                name: 'Ibuprofen',
                dosage: '400mg',
                frequency: 'As needed',
                duration: '5 days',
                instructions: 'Take for pain'
              }
            ],
            status: 'expired',
            refillable: false
          }
        ];
        setPrescriptions(mockPrescriptions);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    toast.success('Prescription downloaded successfully');
  };

  const handleRefill = () => {
    // In a real app, this would send a refill request
    toast.success('Refill request sent successfully');
  };

  const filteredPrescriptions = prescriptions.filter(
    (prescription) => prescription.status === activeTab
  );

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
        <h1 className="text-2xl font-bold text-gray-800">Your Prescriptions</h1>
        <p className="text-gray-600">View and manage your medication prescriptions</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-2 px-1 ${
              activeTab === 'active'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active Prescriptions
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={`pb-2 px-1 ${
              activeTab === 'expired'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Past Prescriptions
          </button>
        </div>
      </div>

      {/* Prescriptions List */}
      {filteredPrescriptions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No {activeTab} prescriptions found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="card">
              <div className="card-header bg-blue-50 p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <FaPrescription className="text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold">
                    Prescription #{prescription.id}
                  </h3>
                </div>
                <div className="text-sm text-gray-500">
                  {prescription.date}
                </div>
              </div>
              <div className="card-body p-4">
                <div className="mb-4">
                  <p className="text-gray-600">
                    <span className="font-medium">Doctor:</span> {prescription.doctor}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Hospital:</span> {prescription.hospital}
                  </p>
                </div>

                <h4 className="text-md font-semibold mb-2">Medications</h4>
                {prescription.medications.map((medication, index) => (
                  <div
                    key={index}
                    className="mb-3 p-3 bg-gray-50 rounded-md"
                  >
                    <p className="font-medium text-gray-800">{medication.name}</p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Dosage:</span> {medication.dosage}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Frequency:</span> {medication.frequency}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Duration:</span> {medication.duration}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Instructions:</span> {medication.instructions}
                    </p>
                  </div>
                ))}

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={handleDownload}
                    className="btn btn-secondary btn-sm flex items-center"
                  >
                    <FaDownload className="mr-1" /> Download
                  </button>
                  {prescription.refillable && (
                    <button
                      onClick={handleRefill}
                      className="btn btn-primary btn-sm flex items-center"
                    >
                      <FaRedo className="mr-1" /> Request Refill
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions; 