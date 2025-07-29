import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from '../utils/api';
import NotificationBell from './NotificationBell';
import {
  FiBell,
  FiSearch,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiActivity,
  FiMail,
  FiHelpCircle,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiShield,
  FiBook,
  FiDollarSign,
  FiHeart,
  FiClock,
} from "react-icons/fi";

function AdminHeader({ toggleSidebar, isSidebarOpen }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // First try to get user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        } else {
          // If not in localStorage, fetch from API
          const response = await api.getCurrentUser();
          if (response.success) {
            setCurrentUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-menu') && !event.target.closest('.profile-button')) {
        setShowProfileMenu(false);
      }
      if (!event.target.closest('.notifications-menu') && !event.target.closest('.notifications-button')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Determine user role based on URL path
  const getRole = () => {
    if (location.pathname.startsWith("/admin")) return "admin";
    if (location.pathname.startsWith("/gym-owner")) return "gym-owner";
    if (location.pathname.startsWith("/instructor")) return "instructor";
    if (location.pathname.startsWith("/customer")) return "customer";
    return "admin";
  };

  const role = getRole();

  // Handle logout
  const handleLogout = () => {
    // Clear any stored auth tokens and user data
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
    
    // Navigate to appropriate login page
    if (role === 'admin') {
      navigate('/admin-login');
    } else if (role === 'gym-owner') {
      navigate('/gym-owner-login');
    } else if (role === 'instructor') {
      navigate('/instructor-login');
    } else {
      navigate('/login');
    }
  };

  // Role-specific data with current user information
  const roleData = {
    admin: {
      title: "Admin Dashboard",
      email: currentUser?.email || "admin@fitconnect.com",
      name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Admin User",
      icon: FiShield,
      notifications: [
        {
          id: 1,
          title: "New Gym Registration",
          message: "FitZone Elite has registered on the platform",
          time: "5 minutes ago",
          type: "registration",
          unread: true,
        },
        {
          id: 2,
          title: "System Update",
          message: "New features have been deployed",
          time: "1 hour ago",
          type: "system",
          unread: true,
        },
      ],
    },
    "gym-owner": {
      title: "Gym Dashboard",
      email: currentUser?.email || "owner@fitzone.com",
      name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Gym Owner",
      icon: FiActivity,
      notifications: [
        {
          id: 1,
          title: "New Member Registration",
          message: "John Doe has joined your gym",
          time: "5 minutes ago",
          type: "member",
          unread: true,
        },
        {
          id: 2,
          title: "Payment Received",
          message: "Monthly subscription payment received",
          time: "1 hour ago",
          type: "payment",
          unread: true,
        },
      ],
    },
    instructor: {
      title: "Instructor Dashboard",
      email: currentUser?.email || "instructor@fitzone.com",
      name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Instructor",
      icon: FiBook,
      notifications: [
        {
          id: 1,
          title: "New Class Booking",
          message: "Sarah Smith booked your yoga class",
          time: "5 minutes ago",
          type: "booking",
          unread: true,
        },
        {
          id: 2,
          title: "Schedule Update",
          message: "Your evening class has been rescheduled",
          time: "1 hour ago",
          type: "schedule",
          unread: true,
        },
      ],
    },
    customer: {
      title: "Member Dashboard",
      email: currentUser?.email || "member@fitconnect.com",
      name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Member",
      icon: FiHeart,
      notifications: [
        {
          id: 1,
          title: "Class Reminder",
          message: "Your yoga class starts in 1 hour",
          time: "5 minutes ago",
          type: "reminder",
          unread: true,
        },
        {
          id: 2,
          title: "Goal Achievement",
          message: "Congratulations! You've reached your weekly goal",
          time: "1 hour ago",
          type: "achievement",
          unread: true,
        },
      ],
    },
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "member":
        return <FiUser className="w-4 h-4" />;
      case "payment":
        return <FiDollarSign className="w-4 h-4" />;
      case "system":
        return <FiSettings className="w-4 h-4" />;
      case "booking":
        return <FiActivity className="w-4 h-4" />;
      case "schedule":
        return <FiBook className="w-4 h-4" />;
      case "registration":
        return <FiShield className="w-4 h-4" />;
      case "reminder":
        return <FiClock className="w-4 h-4" />;
      case "achievement":
        return <FiHeart className="w-4 h-4" />;
      default:
        return <FiBell className="w-4 h-4" />;
    }
  };

  // Get the icon component for the current role
  const RoleIcon = roleData[role].icon;

  return (
    <header className="bg-gray-800/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section with Toggle and Logo */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors mr-4"
            >
              {isSidebarOpen ? (
                <FiX className="h-6 w-6 transform hover:rotate-180 transition-transform duration-300" />
              ) : (
                <FiMenu className="h-6 w-6 transform hover:rotate-180 transition-transform duration-300" />
              )}
            </button>
            <Link to={`/${role}`} className="flex items-center space-x-2 group">
              <div className="h-8 w-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300">
                <RoleIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                {roleData[role].title}
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400 group-focus-within:text-violet-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-900/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                placeholder="Search anything..."
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm hidden group-focus-within:block">
                Press /
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
            >
              {isDarkMode ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </button>

            {/* Help */}
            <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50">
              <FiHelpCircle className="h-5 w-5" />
            </button>

            {/* Messages */}
            <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50 relative">
              <FiMail className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-violet-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>

            {/* Notifications */}
            <NotificationBell />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="profile-button flex items-center space-x-3 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center transform hover:rotate-12 transition-all duration-300">
                  <FiUser className="h-5 w-5 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-white">
                    {roleData[role].name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {roleData[role].email}
                  </div>
                </div>
                <FiChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    showProfileMenu ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Menu */}
              {showProfileMenu && (
                <div className="profile-menu absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">
                      Signed in as
                    </p>
                    <p className="text-sm text-gray-400 truncate">
                      {roleData[role].email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      to={`/${role}/profile`}
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors"
                    >
                      <FiUser className="h-4 w-4 mr-3" />
                      Profile
                    </Link>
                    <Link
                      to={`/${role}/settings`}
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors"
                    >
                      <FiSettings className="h-4 w-4 mr-3" />
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-gray-700">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700/50 transition-colors"
                    >
                      <FiLogOut className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
