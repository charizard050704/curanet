import { useState } from 'react';
import axios from 'axios';
import './index.css';

function Dashboard() {
  const [medicalId, setMedicalId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPatient = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/patients/${medicalId}`);
      setPatientData(res.data);
    } catch (error) {
      console.error('Error:', error);
      setPatientData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-600">CuraNet Dashboard</h1>
      <div className="mt-4 flex items-center">
        <input
          className="border p-2 rounded-l w-64"
          value={medicalId}
          onChange={(e) => setMedicalId(e.target.value)}
          placeholder="Enter Medical ID (e.g., MED123)"
        />
        <button
          className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
          onClick={fetchPatient}
        >
          Search
        </button>
      </div>
      {loading ? (
        <p className="mt-4 text-blue-500">Loading...</p>
      ) : patientData && patientData.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">{patientData[0].name}</h2>
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

export default Dashboard;