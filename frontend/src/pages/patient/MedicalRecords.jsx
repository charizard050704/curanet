import { useState, useEffect } from 'react';
import { FaFileMedical, FaDownload, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';

const MedicalRecords = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('records');
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        const mockRecords = [
          {
            id: 1,
            type: 'visit',
            date: '2023-08-01',
            doctor: 'Dr. Sarah Johnson',
            hospital: 'City General Hospital',
            department: 'Cardiology',
            diagnosis: 'Hypertension',
            treatment: 'Prescribed Lisinopril 10mg daily',
            notes: 'Follow up in 3 months',
            files: [
              { id: 1, name: 'Blood Pressure Report.pdf', type: 'pdf' }
            ]
          },
          {
            id: 2,
            type: 'test',
            date: '2023-07-20',
            testName: 'Complete Blood Count',
            requestedBy: 'Dr. Michael Chen',
            facility: 'Metro Medical Lab',
            result: 'Normal',
            files: [
              { id: 2, name: 'CBC Results.pdf', type: 'pdf' }
            ]
          },
          {
            id: 3,
            type: 'visit',
            date: '2023-06-15',
            doctor: 'Dr. Jessica Martinez',
            hospital: 'City General Hospital',
            department: 'Orthopedics',
            diagnosis: 'Ankle sprain',
            treatment: 'Rest, ice, compression, elevation. Prescribed Ibuprofen for pain.',
            notes: 'Physical therapy recommended',
            files: [
              { id: 3, name: 'X-Ray Report.pdf', type: 'pdf' },
              { id: 4, name: 'Ankle X-Ray Image.jpg', type: 'image' }
            ]
          }
        ];
        setRecords(mockRecords);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      toast.error('Failed to load medical records');
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // In a real app, this would download the file
    toast.success('File downloaded successfully');
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
  };

  const closeViewRecord = () => {
    setSelectedRecord(null);
  };

  const getTabRecords = () => {
    if (activeTab === 'records') {
      return records;
    } else if (activeTab === 'visits') {
      return records.filter(record => record.type === 'visit');
    } else if (activeTab === 'tests') {
      return records.filter(record => record.type === 'test');
    }
    return [];
  };

  const filteredRecords = getTabRecords();

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
        <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
        <p className="text-gray-600">View your complete medical history</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('records')}
            className={`pb-2 px-1 ${
              activeTab === 'records'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Records
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`pb-2 px-1 ${
              activeTab === 'visits'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Hospital Visits
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`pb-2 px-1 ${
              activeTab === 'tests'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Test Results
          </button>
        </div>
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No medical records found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRecords.map((record) => (
            <div key={record.id} className="card">
              <div className="card-header bg-blue-50 p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <FaFileMedical className="text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold">
                    {record.type === 'visit' ? 'Hospital Visit' : 'Test Results'}: {record.date}
                  </h3>
                </div>
                <div>
                  <button
                    onClick={() => handleViewRecord(record)}
                    className="btn btn-secondary btn-sm"
                  >
                    <FaEye className="mr-1" /> View Details
                  </button>
                </div>
              </div>
              <div className="card-body p-4">
                {record.type === 'visit' ? (
                  <div>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Doctor:</span> {record.doctor}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Hospital:</span> {record.hospital}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Department:</span> {record.department}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Test:</span> {record.testName}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Requested By:</span> {record.requestedBy}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Facility:</span> {record.facility}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Result:</span>{' '}
                      <span className={record.result === 'Normal' ? 'text-green-600' : 'text-yellow-600'}>
                        {record.result}
                      </span>
                    </p>
                  </div>
                )}

                {record.files && record.files.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-gray-700 mb-2">Attached Files:</p>
                    <div className="space-y-2">
                      {record.files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>{file.name}</span>
                          <button
                            onClick={() => handleDownload()}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaDownload />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="text-xl font-semibold">
                {selectedRecord.type === 'visit' ? 'Hospital Visit Details' : 'Test Result Details'}
              </h3>
            </div>
            <div className="p-4">
              {selectedRecord.type === 'visit' ? (
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <span className="font-medium">Date:</span> {selectedRecord.date}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Doctor:</span> {selectedRecord.doctor}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Hospital:</span> {selectedRecord.hospital}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Department:</span> {selectedRecord.department}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Diagnosis:</span> {selectedRecord.diagnosis}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Treatment:</span> {selectedRecord.treatment}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Notes:</span> {selectedRecord.notes}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <span className="font-medium">Date:</span> {selectedRecord.date}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Test:</span> {selectedRecord.testName}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Requested By:</span> {selectedRecord.requestedBy}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Facility:</span> {selectedRecord.facility}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Result:</span>{' '}
                    <span className={selectedRecord.result === 'Normal' ? 'text-green-600' : 'text-yellow-600'}>
                      {selectedRecord.result}
                    </span>
                  </p>
                </div>
              )}

              {selectedRecord.files && selectedRecord.files.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium text-gray-700 mb-2">Attached Files:</p>
                  <div className="space-y-2">
                    {selectedRecord.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>{file.name}</span>
                        <button
                          onClick={() => handleDownload()}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaDownload />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={closeViewRecord}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords; 