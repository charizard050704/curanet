import { useState, useEffect } from 'react';
import { FaAmbulance, FaMapMarkerAlt, FaPhone, FaUser, FaClock, FaCheckCircle, FaTimes } from 'react-icons/fa';

const EmergencyPage = () => {
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // active or history

  useEffect(() => {
    const fetchEmergencyRequests = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          const mockRequests = [
            {
              id: 1,
              patient: {
                name: 'Michael Clark',
                id: 'P1023',
                contact: '+1 (555) 123-7890',
                age: 42
              },
              symptoms: 'Severe chest pain, difficulty breathing',
              location: '123 Main St, Apt 4B, New York',
              coordinates: { lat: 40.7128, lng: -74.006 },
              requestTime: '2023-08-15 08:45 AM',
              status: 'pending',
              priority: 'high'
            },
            {
              id: 2,
              patient: {
                name: 'Lisa Rodriguez',
                id: 'P1089',
                contact: '+1 (555) 234-5678',
                age: 35
              },
              symptoms: 'High fever, severe headache, disorientation',
              location: '456 Park Ave, New York',
              coordinates: { lat: 40.7641, lng: -73.9731 },
              requestTime: '2023-08-15 07:30 AM',
              status: 'dispatched',
              priority: 'medium',
              dispatchDetails: {
                ambulance: 'AMB-104',
                dispatchTime: '2023-08-15 07:45 AM',
                eta: '10 minutes'
              }
            },
            {
              id: 3,
              patient: {
                name: 'David Johnson',
                id: 'P1102',
                contact: '+1 (555) 345-6789',
                age: 78
              },
              symptoms: 'Fall, possible hip fracture, unable to move',
              location: '789 Broadway, Apt 12C, New York',
              coordinates: { lat: 40.7484, lng: -73.9857 },
              requestTime: '2023-08-15 09:15 AM',
              status: 'pending',
              priority: 'high'
            },
            {
              id: 4,
              patient: {
                name: 'Sarah Wilson',
                id: 'P1043',
                contact: '+1 (555) 456-7890',
                age: 28
              },
              symptoms: 'Allergic reaction, facial swelling, difficulty breathing',
              location: '321 5th Ave, New York',
              coordinates: { lat: 40.7484, lng: -73.9857 },
              requestTime: '2023-08-14 14:45 PM',
              status: 'completed',
              priority: 'high',
              dispatchDetails: {
                ambulance: 'AMB-102',
                dispatchTime: '2023-08-14 14:50 PM',
                arrivalTime: '2023-08-14 15:10 PM',
                hospital: 'City General Hospital'
              }
            },
            {
              id: 5,
              patient: {
                name: 'Robert Thompson',
                id: 'P1067',
                contact: '+1 (555) 567-8901',
                age: 55
              },
              symptoms: 'Stroke symptoms, slurred speech, facial drooping',
              location: '567 Lexington Ave, New York',
              coordinates: { lat: 40.7577, lng: -73.9685 },
              requestTime: '2023-08-14 11:20 AM',
              status: 'completed',
              priority: 'critical',
              dispatchDetails: {
                ambulance: 'AMB-101',
                dispatchTime: '2023-08-14 11:25 AM',
                arrivalTime: '2023-08-14 11:40 AM',
                hospital: 'City General Hospital'
              }
            }
          ];
          
          setEmergencyRequests(mockRequests);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching emergency requests:', error);
        setLoading(false);
      }
    };

    fetchEmergencyRequests();
  }, []);

  // Filter requests based on active tab
  const filteredRequests = emergencyRequests.filter(request => {
    if (activeTab === 'active') {
      return ['pending', 'dispatched'].includes(request.status);
    } else {
      return ['completed', 'cancelled'].includes(request.status);
    }
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical':
        return <span className="badge badge-red">Critical</span>;
      case 'high':
        return <span className="badge badge-orange">High</span>;
      case 'medium':
        return <span className="badge badge-yellow">Medium</span>;
      case 'low':
        return <span className="badge badge-green">Low</span>;
      default:
        return <span className="badge badge-gray">{priority}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-yellow">Pending</span>;
      case 'dispatched':
        return <span className="badge badge-blue">Dispatched</span>;
      case 'completed':
        return <span className="badge badge-green">Completed</span>;
      case 'cancelled':
        return <span className="badge badge-red">Cancelled</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  const handleDispatch = (id) => {
    // In a real app, this would make an API call to dispatch an ambulance
    alert(`Dispatching ambulance for emergency request #${id}`);
  };

  const handleCancel = (id) => {
    // In a real app, this would make an API call to cancel the request
    alert(`Cancelling emergency request #${id}`);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaAmbulance className="mr-2 text-red-500" /> Emergency Requests
        </h1>
        <p className="text-gray-600 mt-1">Manage and respond to emergency service requests</p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'active'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Active Emergencies
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'history'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
      </div>
      
      {/* Emergency Request Cards */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 card">
              <div className="card-body">
                <p className="text-gray-500">No emergency requests found.</p>
              </div>
            </div>
          ) : (
            filteredRequests.map(request => (
              <div 
                key={request.id} 
                className={`card border-l-4 ${
                  request.priority === 'critical' ? 'border-l-red-500' :
                  request.priority === 'high' ? 'border-l-orange-500' :
                  request.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
                }`}
              >
                <div className="card-body p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Patient Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Patient Information</h3>
                      <div className="flex items-start mb-2">
                        <FaUser className="text-gray-500 mt-1 mr-2" />
                        <div>
                          <p className="font-medium">{request.patient.name}</p>
                          <p className="text-sm text-gray-600">ID: {request.patient.id}</p>
                          <p className="text-sm text-gray-600">Age: {request.patient.age} years</p>
                        </div>
                      </div>
                      <div className="flex items-center mb-2">
                        <FaPhone className="text-gray-500 mr-2" />
                        <a href={`tel:${request.patient.contact}`} className="text-blue-500 hover:underline">
                          {request.patient.contact}
                        </a>
                      </div>
                      <div className="flex items-start">
                        <FaClock className="text-gray-500 mt-1 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Requested at:</p>
                          <p>{request.requestTime}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Emergency Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Emergency Details</h3>
                      <div className="mb-3">
                        <p className="text-gray-600 mb-1">Symptoms:</p>
                        <p className="font-medium">{request.symptoms}</p>
                      </div>
                      <div className="flex items-start mb-3">
                        <FaMapMarkerAlt className="text-gray-500 mt-1 mr-2" />
                        <div>
                          <p className="text-gray-600 mb-1">Location:</p>
                          <p>{request.location}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {getPriorityBadge(request.priority)}
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        {request.status === 'completed' || request.status === 'cancelled' ? 
                          'Dispatch Details' : 'Actions'}
                      </h3>
                      
                      {request.status === 'pending' && (
                        <div className="space-y-3">
                          <button
                            onClick={() => handleDispatch(request.id)}
                            className="w-full btn-primary flex items-center justify-center"
                          >
                            <FaAmbulance className="mr-2" /> Dispatch Ambulance
                          </button>
                          <button
                            onClick={() => handleCancel(request.id)}
                            className="w-full btn-outline flex items-center justify-center text-red-500 border-red-500 hover:bg-red-50"
                          >
                            <FaTimes className="mr-2" /> Cancel Request
                          </button>
                        </div>
                      )}
                      
                      {request.status === 'dispatched' && request.dispatchDetails && (
                        <div>
                          <div className="mb-3">
                            <p className="text-gray-600">Ambulance:</p>
                            <p className="font-medium">{request.dispatchDetails.ambulance}</p>
                          </div>
                          <div className="mb-3">
                            <p className="text-gray-600">Dispatched at:</p>
                            <p>{request.dispatchDetails.dispatchTime}</p>
                          </div>
                          <div className="mb-3">
                            <p className="text-gray-600">ETA:</p>
                            <p>{request.dispatchDetails.eta}</p>
                          </div>
                          <button
                            className="w-full btn-success flex items-center justify-center mt-4"
                          >
                            <FaCheckCircle className="mr-2" /> Mark as Arrived
                          </button>
                        </div>
                      )}
                      
                      {(request.status === 'completed' || request.status === 'cancelled') && request.dispatchDetails && (
                        <div>
                          <div className="mb-3">
                            <p className="text-gray-600">Ambulance:</p>
                            <p className="font-medium">{request.dispatchDetails.ambulance}</p>
                          </div>
                          <div className="mb-3">
                            <p className="text-gray-600">Dispatched at:</p>
                            <p>{request.dispatchDetails.dispatchTime}</p>
                          </div>
                          {request.dispatchDetails.arrivalTime && (
                            <div className="mb-3">
                              <p className="text-gray-600">Arrived at:</p>
                              <p>{request.dispatchDetails.arrivalTime}</p>
                            </div>
                          )}
                          {request.dispatchDetails.hospital && (
                            <div className="mb-3">
                              <p className="text-gray-600">Transported to:</p>
                              <p className="font-medium">{request.dispatchDetails.hospital}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EmergencyPage; 