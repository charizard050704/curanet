import React from 'react';
import { FaGraduationCap, FaStethoscope, FaAward, FaCalendarAlt, FaStar, FaUserFriends, FaCheck } from 'react-icons/fa';

const DoctorProfile = ({ doctor }) => {
  // Default values if doctor data is not provided
  const {
    name = 'Dr. John Doe',
    photo = 'https://ik.imagekit.io/curanet/default-doctor.png?updatedAt=1680567412863',
    specialization = 'General Medicine',
    qualifications = ['MBBS', 'MD - General Medicine'],
    experience = 10,
    languages = ['English', 'Spanish'],
    expertise = ['Diabetes Management', 'Hypertension', 'Preventive Care'],
    certifications = ['Board Certified in Internal Medicine', 'Advanced Cardiac Life Support'],
    patientLimit = 15,
    currentPatients = 8,
    rating = 4.8,
    reviewCount = 124,
    availability = {
      monday: { morning: true, afternoon: true, evening: false },
      tuesday: { morning: true, afternoon: true, evening: false },
      wednesday: { morning: false, afternoon: true, evening: true },
      thursday: { morning: true, afternoon: true, evening: false },
      friday: { morning: true, afternoon: false, evening: false },
      saturday: { morning: false, afternoon: false, evening: false },
      sunday: { morning: false, afternoon: false, evening: false },
    },
  } = doctor || {};

  // Calculate availability percentage
  const calculateAvailability = () => {
    let availableSlots = 0;
    let totalSlots = 0;
    
    for (const day in availability) {
      for (const timeSlot in availability[day]) {
        totalSlots++;
        if (availability[day][timeSlot]) {
          availableSlots++;
        }
      }
    }
    
    return Math.round((availableSlots / totalSlots) * 100);
  };
  
  // Format days for display 
  const formatDays = () => {
    const days = Object.keys(availability);
    const availableDays = days.filter(day => 
      availability[day].morning || availability[day].afternoon || availability[day].evening
    );
    
    if (availableDays.length === 0) return 'Not available';
    
    return availableDays
      .map(day => day.charAt(0).toUpperCase() + day.slice(1))
      .join(', ');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with photo and name */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        <div className="absolute top-16 left-6">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
            <img 
              src={photo} 
              alt={name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://ik.imagekit.io/curanet/default-doctor.png?updatedAt=1680567412863';
              }}
            />
          </div>
        </div>
        <div className="ml-44 pt-4 pb-4 pr-6">
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-blue-600">{specialization}</p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-6 pt-3">
        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="font-bold text-2xl">{experience}+</div>
            <div className="text-sm text-gray-600">Years Experience</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="font-bold text-2xl">{currentPatients}/{patientLimit}</div>
            <div className="text-sm text-gray-600">Daily Patients</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="font-bold text-2xl flex items-center justify-center">
              {rating} <FaStar className="text-yellow-500 ml-1 text-lg" />
            </div>
            <div className="text-sm text-gray-600">{reviewCount} Reviews</div>
          </div>
        </div>
        
        {/* Qualifications */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FaGraduationCap className="mr-2 text-blue-500" /> Qualifications
          </h3>
          <ul className="list-disc pl-9 space-y-1">
            {qualifications.map((qualification, index) => (
              <li key={index}>{qualification}</li>
            ))}
          </ul>
        </div>
        
        {/* Certifications */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FaAward className="mr-2 text-blue-500" /> Certifications
          </h3>
          <ul className="list-disc pl-9 space-y-1">
            {certifications.map((certification, index) => (
              <li key={index}>{certification}</li>
            ))}
          </ul>
        </div>
        
        {/* Areas of expertise */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FaStethoscope className="mr-2 text-blue-500" /> Areas of Expertise
          </h3>
          <div className="flex flex-wrap gap-2">
            {expertise.map((area, index) => (
              <span key={index} className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                <FaCheck className="mr-1 text-xs" /> {area}
              </span>
            ))}
          </div>
        </div>
        
        {/* Languages */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Languages</h3>
          <div className="flex gap-2">
            {languages.map((language, index) => (
              <span key={index} className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                {language}
              </span>
            ))}
          </div>
        </div>
        
        {/* Availability */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-500" /> Availability
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-2 flex justify-between items-center">
              <span>Available Days:</span>
              <span className="font-medium">{formatDays()}</span>
            </div>
            <div className="mb-4 flex justify-between items-center">
              <span>Availability Rate:</span>
              <span className="font-medium">{calculateAvailability()}%</span>
            </div>
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${calculateAvailability()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Patient Capacity */}
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FaUserFriends className="mr-2 text-blue-500" /> Patient Capacity
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-2 flex justify-between items-center">
              <span>Daily Limit:</span>
              <span className="font-medium">{patientLimit} patients</span>
            </div>
            <div className="mb-2 flex justify-between items-center">
              <span>Current Bookings:</span>
              <span className="font-medium">{currentPatients} patients</span>
            </div>
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    currentPatients / patientLimit > 0.8 ? 'bg-red-500' : 
                    currentPatients / patientLimit > 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(currentPatients / patientLimit) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {patientLimit - currentPatients} slots available for today
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile; 