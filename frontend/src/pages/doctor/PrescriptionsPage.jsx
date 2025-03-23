import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaPrescriptionBottleAlt, FaUserAlt, FaCalendarAlt, FaDownload, FaPrint } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    timeRange: 'all',
    medicationType: 'all',
    patientType: 'all'
  });
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
    today: 0,
    commonMedications: []
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, prescriptions]);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockPrescriptions = generateMockPrescriptions();
      setPrescriptions(mockPrescriptions);
      calculateStats(mockPrescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockPrescriptions = () => {
    const medications = [
      'Amoxicillin', 'Lisinopril', 'Metformin', 'Atorvastatin', 
      'Amlodipine', 'Albuterol', 'Omeprazole', 'Levothyroxine'
    ];
    
    const diagnoses = [
      'Hypertension', 'Type 2 Diabetes', 'Bacterial Infection', 
      'High Cholesterol', 'Asthma', 'GERD', 'Hypothyroidism'
    ];
    
    return Array.from({ length: 50 }, (_, i) => {
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90));
      
      const randomMedIndex = Math.floor(Math.random() * medications.length);
      const randomDiagIndex = Math.floor(Math.random() * diagnoses.length);
      
      return {
        id: i + 1,
        patientId: Math.floor(Math.random() * 1000) + 1,
        patientName: `Patient ${Math.floor(Math.random() * 100) + 1}`,
        patientAge: Math.floor(Math.random() * 70) + 18,
        date: randomDate.toISOString().split('T')[0],
        medication: medications[randomMedIndex],
        dosage: `${Math.floor(Math.random() * 500) + 100}mg`,
        frequency: ['Once daily', 'Twice daily', 'Three times daily', 'As needed'][Math.floor(Math.random() * 4)],
        duration: `${Math.floor(Math.random() * 30) + 1} days`,
        diagnosis: diagnoses[randomDiagIndex],
        notes: Math.random() > 0.5 ? 'Follow up in 2 weeks' : ''
      };
    });
  };

  const calculateStats = (prescriptions) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const todayCount = prescriptions.filter(p => new Date(p.date).getTime() === today.getTime()).length;
    const weekCount = prescriptions.filter(p => new Date(p.date) >= oneWeekAgo).length;
    const monthCount = prescriptions.filter(p => new Date(p.date) >= oneMonthAgo).length;
    
    // Calculate most common medications
    const medicationCounts = {};
    prescriptions.forEach(p => {
      medicationCounts[p.medication] = (medicationCounts[p.medication] || 0) + 1;
    });
    
    const commonMedications = Object.entries(medicationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
    
    setStats({
      total: prescriptions.length,
      thisMonth: monthCount,
      thisWeek: weekCount,
      today: todayCount,
      commonMedications
    });
  };

  const applyFilters = () => {
    let filtered = [...prescriptions];
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.patientName.toLowerCase().includes(term) || 
        p.medication.toLowerCase().includes(term) ||
        p.diagnosis.toLowerCase().includes(term)
      );
    }
    
    // Apply time range filter
    if (filters.timeRange !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (filters.timeRange === 'today') {
        filtered = filtered.filter(p => new Date(p.date).getTime() === today.getTime());
      } else if (filters.timeRange === 'week') {
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(p => new Date(p.date) >= oneWeekAgo);
      } else if (filters.timeRange === 'month') {
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        filtered = filtered.filter(p => new Date(p.date) >= oneMonthAgo);
      }
    }
    
    // Apply medication type filter
    if (filters.medicationType !== 'all') {
      filtered = filtered.filter(p => p.medication === filters.medicationType);
    }
    
    setFilteredPrescriptions(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value
    });
  };

  const handlePrintPrescription = (id) => {
    toast.success(`Prescription #${id} sent to printer`);
  };

  const handleDownloadPDF = (id) => {
    toast.success(`Prescription #${id} downloaded as PDF`);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const getRecommendations = () => {
    // In a real implementation, this would analyze patient history
    // and provide intelligent recommendations
    return [
      'Consider reducing dosage based on patient age',
      'Patient has history of allergic reactions to similar medications',
      'Recent lab results suggest monitoring liver function',
    ][Math.floor(Math.random() * 3)];
  };

  const uniqueMedications = [...new Set(prescriptions.map(p => p.medication))];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Prescription Management</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-500">Total Prescriptions</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-500">This Month</h3>
          <p className="text-2xl font-bold">{stats.thisMonth}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-500">This Week</h3>
          <p className="text-2xl font-bold">{stats.thisWeek}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-500">Today</h3>
          <p className="text-2xl font-bold">{stats.today}</p>
        </div>
      </div>
      
      {/* Most Prescribed Medications */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="font-semibold mb-3">Most Prescribed Medications</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {stats.commonMedications.map((med, index) => (
            <div key={index} className="bg-blue-50 rounded p-2">
              <p className="font-medium">{med.name}</p>
              <p className="text-sm text-gray-600">{med.count} prescriptions</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by patient, medication or diagnosis..."
                className="w-full p-2 pl-10 border rounded"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <button 
            onClick={toggleFilters}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
        </div>
        
        {/* Expanded Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Time Range</label>
              <select 
                className="w-full p-2 border rounded"
                value={filters.timeRange}
                onChange={(e) => handleFilterChange('timeRange', e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Medication</label>
              <select 
                className="w-full p-2 border rounded"
                value={filters.medicationType}
                onChange={(e) => handleFilterChange('medicationType', e.target.value)}
              >
                <option value="all">All Medications</option>
                {uniqueMedications.map((med, index) => (
                  <option key={index} value={med}>{med}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Sort By</label>
              <select 
                className="w-full p-2 border rounded"
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="patient">Patient Name</option>
                <option value="medication">Medication</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Prescriptions Table */}
      {isLoading ? (
        <div className="text-center py-8">
          <p>Loading prescriptions...</p>
        </div>
      ) : filteredPrescriptions.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <FaPrescriptionBottleAlt className="mx-auto text-gray-400 text-4xl mb-2" />
          <h3 className="text-xl font-medium text-gray-800">No prescriptions found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPrescriptions.map((prescription) => (
                <tr key={prescription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-blue-600">#{prescription.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUserAlt className="text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium">{prescription.patientName}</div>
                        <div className="text-sm text-gray-500">ID: {prescription.patientId}, Age: {prescription.patientAge}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-400 mr-2" />
                      {prescription.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium">{prescription.medication}</div>
                      <div className="text-sm text-gray-500">{prescription.frequency}, {prescription.duration}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {prescription.dosage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium">{prescription.diagnosis}</div>
                      {prescription.notes && <div className="text-sm text-gray-500">{prescription.notes}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handlePrintPrescription(prescription.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaPrint />
                      </button>
                      <button 
                        onClick={() => handleDownloadPDF(prescription.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <FaDownload />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* AI Recommendations */}
      {filteredPrescriptions.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Smart Recommendations</h3>
          <p className="text-blue-600">
            {getRecommendations()}
          </p>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsPage; 