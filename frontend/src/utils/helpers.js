import { format, parseISO } from 'date-fns';

// Format date for display
export const formatDate = (dateString, formatString = 'MMM dd, yyyy') => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Format datetime for display
export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  try {
    return format(parseISO(dateTimeString), 'MMM dd, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return dateTimeString;
  }
};

// Get appointment status badge class
export const getAppointmentStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'scheduled':
      return 'badge-primary';
    case 'completed':
      return 'badge-success';
    case 'cancelled':
      return 'badge-danger';
    case 'rescheduled':
      return 'badge-warning';
    default:
      return 'badge-primary';
  }
};

// Get emergency status badge class
export const getEmergencyStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'badge-warning';
    case 'dispatched':
      return 'badge-primary';
    case 'completed':
      return 'badge-success';
    case 'cancelled':
      return 'badge-danger';
    default:
      return 'badge-warning';
  }
};

// Format phone number
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return 'N/A';
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phoneNumber;
};

// Generate a random color based on a string (for charts)
export const stringToColor = (str) => {
  if (!str) return '#3B82F6'; // Default blue
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};

// Capitalize first letter of each word
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 'N/A';
  
  try {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error('Error calculating age:', error);
    return 'N/A';
  }
};

// Generate a unique ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}; 