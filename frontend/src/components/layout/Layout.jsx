import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  FaHome, FaUserMd, FaCalendarAlt, FaPrescription, 
  FaClinicMedical, FaAmbulance, FaSignOutAlt, FaChevronDown, 
  FaChevronUp, FaBars, FaTimes, FaUserCog
} from 'react-icons/fa';
import AuthContext from '../../context/AuthContext.jsx';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Define navigation links based on user role
  const patientLinks = [
    { path: '/patient', name: 'Dashboard', icon: <FaHome /> },
    { path: '/patient/records', name: 'Medical Records', icon: <FaUserMd /> },
    { path: '/appointments/book', name: 'Book Appointment', icon: <FaCalendarAlt /> },
    { path: '/patient/prescriptions', name: 'Prescriptions', icon: <FaPrescription /> }
  ];
  
  const doctorLinks = [
    { path: '/doctor', name: 'Dashboard', icon: <FaHome /> },
    { path: '/doctor/patients', name: 'Patient Directory', icon: <FaUserMd /> },
    { path: '/doctor/appointments', name: 'Appointments', icon: <FaCalendarAlt /> },
    { path: '/doctor/prescriptions', name: 'Prescriptions', icon: <FaPrescription /> },
    { path: '/doctor/profile', name: 'My Profile', icon: <FaUserCog /> }
  ];
  
  const hospitalLinks = [
    { path: '/hospital', name: 'Dashboard', icon: <FaHome /> },
    { path: '/hospital/patients', name: 'Patients', icon: <FaUserMd /> },
    { path: '/hospital/appointments', name: 'Appointments', icon: <FaCalendarAlt /> },
    { path: '/hospital/doctors', name: 'Doctors', icon: <FaUserMd /> },
    { path: '/hospital/emergency', name: 'Emergency Requests', icon: <FaAmbulance /> }
  ];
  
  // Select appropriate links based on user role
  let navigationLinks = patientLinks;
  if (user?.role === 'doctor') {
    navigationLinks = doctorLinks;
  } else if (user?.role === 'hospital') {
    navigationLinks = hospitalLinks;
  }
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <motion.aside 
        className={`fixed lg:relative inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={false}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <Link to={`/${user?.role}`} className="flex items-center">
              <span className="text-xl font-bold text-blue-600">CuraNet</span>
            </Link>
            <button onClick={toggleSidebar} className="lg:hidden text-gray-500">
              <FaTimes />
            </button>
          </div>

          {/* Sidebar navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navigationLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                      location.pathname === link.path
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
              
              {/* Profile Link (Common for all users) */}
              <li className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/profile"
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    location.pathname === '/profile'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3"><FaUserCog /></span>
                  <span>My Profile</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
            >
              <FaSignOutAlt className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-2 bg-white shadow-sm lg:shadow-none">
          <button
            onClick={toggleSidebar}
            className="p-1 text-gray-700 lg:hidden focus:outline-none"
          >
            <FaBars />
          </button>

          <div className="flex items-center ml-auto">
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center px-3 py-2 text-gray-700 border rounded-md hover:bg-gray-100 focus:outline-none"
              >
                <span className="mr-2">{user?.username || 'User'}</span>
                {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 z-10 w-48 mt-2 bg-white border rounded-md shadow-lg">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b">
                      <div>{user?.email}</div>
                      <div className="font-medium text-gray-900">
                        Role: {user?.role}
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content wrapper */}
        <main className="flex-1 overflow-auto">
          <div className="container px-4 py-6 mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 