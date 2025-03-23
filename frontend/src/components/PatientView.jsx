import { useState, useEffect } from 'react';
import axios from 'axios';

function PatientView() {
  const [medicalId, setMedicalId] = useState('MED123'); // Default for demo
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/patients/${medicalId}`);
        setPatientData(res.data);
      } catch (error) {
        console.error('Error:', error);
        setPatientData(null);
      }
    };
    fetchPatient();
  }, [medicalId]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-600">CuraNet Patient View</h1>
      <div className="mt-4">
        <input
          className="border p-2 rounded-l w-64"
          value={medicalId}
          onChange={(e) => setMedicalId(e.target.value)}
          placeholder="Enter Medical ID (e.g., MED123)"
        />
      </div>
      {patientData && patientData.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">{patientData[0].name}</h2>
          <p className="mt-2">Medical ID: {patientData[0].medical_id}</p>
          <table className="w-full mt-4 bg-white shadow-md rounded">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-2">Diagnosis</th>
                <th className="p-2">Treatment</th>
                <th className="p-2">Date</th>
                <th className="p-2">Hospital</th>
              </tr>
            </thead>
            <tbody>
              {patientData.map((record, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-2">{record.diagnosis || '-'}</td>
                  <td className="p-2">{record.treatment || '-'}</td>
                  <td className="p-2">{record.record_date}</td>
                  <td className="p-2">{record.hospital_name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : patientData === null ? (
        <p className="mt-4 text-red-500">Error fetching data. Check the Medical ID or server.</p>
      ) : (
        <p className="mt-4 text-gray-500">No data found for this Medical ID.</p>
      )}
    </div>
  );
}

export default PatientView;