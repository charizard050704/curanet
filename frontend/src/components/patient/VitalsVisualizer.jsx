import { useState, useEffect, useRef } from 'react';
import { FaHeart, FaLungs, FaWeight, FaRuler, FaThermometerHalf } from 'react-icons/fa';

const VitalsVisualizer = ({ patient, vitals }) => {
  const [rotation, setRotation] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [highlightedOrgan, setHighlightedOrgan] = useState(null);
  const containerRef = useRef(null);

  // Start auto-rotation
  useEffect(() => {
    let animationId;
    
    const rotate = () => {
      if (autoRotate) {
        setRotation(prev => (prev + 0.2) % 360);
      }
      animationId = requestAnimationFrame(rotate);
    };
    
    animationId = requestAnimationFrame(rotate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [autoRotate]);

  // Normalize vital values for visualization
  const normalizedVitals = {
    heartRate: {
      value: parseFloat(vitals.heartRate) || 0,
      min: 60,
      max: 100,
      normal: 72,
      unit: 'bpm',
      label: 'Heart Rate',
      color: highlightedOrgan === 'heart' ? 'rgb(239, 68, 68)' : 'rgb(248, 113, 113)',
      icon: <FaHeart />
    },
    bloodPressure: {
      value: vitals.bloodPressure || '120/80',
      unit: 'mmHg',
      label: 'Blood Pressure',
      color: highlightedOrgan === 'bloodPressure' ? 'rgb(59, 130, 246)' : 'rgb(96, 165, 250)',
      icon: <FaHeart />
    },
    respiratoryRate: {
      value: parseFloat(vitals.respiratoryRate) || 0,
      min: 12,
      max: 20,
      normal: 16,
      unit: 'bpm',
      label: 'Respiratory Rate',
      color: highlightedOrgan === 'lungs' ? 'rgb(16, 185, 129)' : 'rgb(52, 211, 153)',
      icon: <FaLungs />
    },
    temperature: {
      value: parseFloat(vitals.temperature) || 0,
      min: 97,
      max: 99,
      normal: 98.6,
      unit: '°F',
      label: 'Temperature',
      color: highlightedOrgan === 'temperature' ? 'rgb(245, 158, 11)' : 'rgb(251, 191, 36)',
      icon: <FaThermometerHalf />
    },
    oxygenSaturation: {
      value: parseFloat(vitals.oxygenSaturation) || 0,
      min: 95,
      max: 100,
      normal: 98,
      unit: '%',
      label: 'O₂ Saturation',
      color: highlightedOrgan === 'lungs' ? 'rgb(16, 185, 129)' : 'rgb(52, 211, 153)',
      icon: <FaLungs />
    }
  };

  const handleOrganHover = (organ) => {
    setHighlightedOrgan(organ);
    setAutoRotate(false);
  };

  const handleOrganLeave = () => {
    setHighlightedOrgan(null);
    setAutoRotate(true);
  };

  const getRotationStyle = (baseRotation = 0) => {
    return {
      transform: `rotateY(${rotation + baseRotation}deg)`
    };
  };

  return (
    <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden shadow-md">
      {/* Header */}
      <div className="bg-blue-50 px-4 py-2 border-b">
        <h3 className="font-semibold">Patient Vitals Visualization</h3>
      </div>
      
      {/* Main visualization area */}
      <div className="flex h-full">
        {/* Vital signs metrics */}
        <div className="w-1/3 p-4 border-r space-y-4">
          {Object.values(normalizedVitals).map((vital, index) => (
            <div 
              key={index}
              className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
              onMouseEnter={() => handleOrganHover(Object.keys(normalizedVitals)[index])}
              onMouseLeave={handleOrganLeave}
            >
              <div className="w-8 h-8 flex items-center justify-center text-xl" style={{ color: vital.color }}>
                {vital.icon}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{vital.label}</p>
                <p className="text-lg font-semibold">{vital.value} <span className="text-xs text-gray-500">{vital.unit}</span></p>
              </div>
            </div>
          ))}
        </div>
        
        {/* 3D Human body visualization */}
        <div className="w-2/3 relative flex items-center justify-center" style={{ perspective: '800px' }} ref={containerRef}>
          <div 
            className="h-72 w-40 relative transition-transform duration-300"
            style={{
              ...getRotationStyle(),
              transformStyle: 'preserve-3d'
            }}
            onMouseEnter={() => setAutoRotate(false)}
            onMouseLeave={() => setAutoRotate(true)}
          >
            {/* Front silhouette */}
            <div 
              className="absolute inset-0 bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(https://ik.imagekit.io/curanet/human-silhouette-front.png?updatedAt=1680567412863)',
                opacity: 0.7,
                backfaceVisibility: 'hidden'
              }}
            >
              {/* Heart indicator */}
              <div 
                className={`absolute left-1/2 top-1/4 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${highlightedOrgan === 'heart' ? 'opacity-100 scale-125' : 'opacity-70'}`}
                style={{ 
                  backgroundColor: normalizedVitals.heartRate.color,
                  boxShadow: highlightedOrgan === 'heart' ? '0 0 15px 5px rgba(239, 68, 68, 0.6)' : 'none'
                }}
                onMouseEnter={() => handleOrganHover('heart')}
                onMouseLeave={handleOrganLeave}
              >
                <FaHeart className="text-white" />
              </div>
              
              {/* Lungs indicator */}
              <div 
                className={`absolute left-1/2 top-1/3 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${highlightedOrgan === 'lungs' ? 'opacity-100 scale-125' : 'opacity-70'}`}
                style={{ 
                  backgroundColor: normalizedVitals.respiratoryRate.color,
                  boxShadow: highlightedOrgan === 'lungs' ? '0 0 15px 5px rgba(16, 185, 129, 0.6)' : 'none'
                }}
                onMouseEnter={() => handleOrganHover('lungs')}
                onMouseLeave={handleOrganLeave}
              >
                <FaLungs className="text-white" />
              </div>
              
              {/* Temperature indicator */}
              <div 
                className={`absolute left-1/2 top-1/6 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${highlightedOrgan === 'temperature' ? 'opacity-100 scale-125' : 'opacity-70'}`}
                style={{ 
                  backgroundColor: normalizedVitals.temperature.color,
                  boxShadow: highlightedOrgan === 'temperature' ? '0 0 15px 5px rgba(245, 158, 11, 0.6)' : 'none'
                }}
                onMouseEnter={() => handleOrganHover('temperature')}
                onMouseLeave={handleOrganLeave}
              >
                <FaThermometerHalf className="text-white" />
              </div>
            </div>
            
            {/* Back silhouette */}
            <div 
              className="absolute inset-0 bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(https://ik.imagekit.io/curanet/human-silhouette-back.png?updatedAt=1680567412863)',
                opacity: 0.7,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              {/* Back indicators would go here */}
            </div>
          </div>
          
          {/* Patient name at bottom */}
          <div className="absolute bottom-4 text-center w-full">
            <p className="font-medium text-lg">{patient?.name || 'Patient'}</p>
            <p className="text-sm text-gray-500">
              {patient?.age} years • {patient?.gender} • {patient?.bloodType}
            </p>
          </div>
          
          {/* Rotate controls */}
          <div className="absolute bottom-4 right-4">
            <button 
              className={`p-2 rounded-full ${autoRotate ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}
              onClick={() => setAutoRotate(!autoRotate)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalsVisualizer; 