import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiSearch,
  FiUser,
  FiMail,
  FiPhone,
  FiStar,
  FiPlus,
  FiCheck,
  FiX,
  FiEye,
  FiActivity,
  FiAward,
  FiMapPin,
  FiClock,
  FiUserPlus,
  FiUpload,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";
import api from '../../utils/api';
import { useAlert } from '../../contexts/AlertContext';

function AddInstructor() {
  const [activeTab, setActiveTab] = useState("search"); // "search" or "register"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [availableInstructors, setAvailableInstructors] = useState([]);
  const [currentInstructors, setCurrentInstructors] = useState([]);
  const [userGyms, setUserGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInstructorDetails, setSelectedInstructorDetails] = useState(null);
  
  // New instructor registration form
  const [registerFormData, setRegisterFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    salary: "",
    startDate: "",
    description: "",
    password: "",
    confirmPassword: "",
    resume: null,
    certifications: []
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({});
  
  const { showAlert } = useAlert();

  const specializations = [
    "All",
    "Strength Training",
    "Yoga",
    "Cardio",
    "HIIT",
    "Pilates",
    "CrossFit",
    "Dance Fitness",
    "Martial Arts",
  ];

  useEffect(() => {
    fetchUserGyms();
  }, []);

  useEffect(() => {
    if (selectedGym) {
      fetchCurrentInstructors();
      searchAvailableInstructors();
    }
  }, [selectedGym, searchTerm, selectedSpecialization]);

  const fetchUserGyms = async () => {
    try {
      setLoading(true);
      const response = await api.getGymsByOwner();
      const gyms = response.data || [];
      setUserGyms(gyms);
      
      // Auto-select first gym if available
      if (gyms.length > 0) {
        setSelectedGym(gyms[0]);
      }
    } catch (error) {
      console.error('Error fetching user gyms:', error);
      showAlert('Failed to fetch your gyms', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentInstructors = async () => {
    if (!selectedGym) return;
    
    try {
      const response = await api.getGymInstructors(selectedGym._id);
      setCurrentInstructors(response.data || []);
    } catch (error) {
      console.error('Error fetching current instructors:', error);
      showAlert('Failed to fetch current instructors', 'error');
    }
  };

  const searchAvailableInstructors = async () => {
    if (!selectedGym) return;
    
    try {
      setSearchLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedSpecialization !== 'all') params.specialization = selectedSpecialization;
      
      const response = await api.searchAvailableInstructors(selectedGym._id, params);
      setAvailableInstructors(response.data || []);
    } catch (error) {
      console.error('Error searching instructors:', error);
      showAlert('Failed to search instructors', 'error');
    } finally {
      setSearchLoading(false);
    }
  };


  const handleRemoveInstructor = async (instructorId) => {
    if (!selectedGym) return;
    
    try {
      await api.removeInstructorFromGym(selectedGym._id, instructorId);
      showAlert('Instructor removed successfully!', 'success');
      
      // Refresh lists
      await fetchCurrentInstructors();
      await searchAvailableInstructors();
    } catch (error) {
      console.error('Error removing instructor:', error);
      showAlert(error.message || 'Failed to remove instructor', 'error');
    }
  };

  const getProfileImageUrl = (instructor) => {
    if (instructor.applicationDetails?.profilePicture?.url) {
      return instructor.applicationDetails.profilePicture.url;
    }
    return `https://ui-avatars.com/api/?name=${instructor.firstName}+${instructor.lastName}&background=8b5cf6&color=fff&size=150`;
  };

  const handleViewDetails = (instructor) => {
    console.log('Selected Instructor Details:', instructor);
    console.log('Instructor firstName:', instructor?.firstName);
    console.log('Instructor lastName:', instructor?.lastName);
    console.log('Instructor specialization:', instructor?.specialization);
    console.log('Instructor applicationDetails:', instructor?.applicationDetails);
    setSelectedInstructorDetails(instructor);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setTimeout(() => {
      setSelectedInstructorDetails(null);
    }, 100);
  };

  // Handle new instructor registration form
  const handleRegisterFormChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === "file") {
      if (name === "resume") {
        setRegisterFormData(prev => ({ ...prev, [name]: files[0] || null }));
      } else if (name === "certifications") {
        setRegisterFormData(prev => ({
          ...prev,
          [name]: [...prev.certifications, ...Array.from(files)]
        }));
      }
    } else {
      setRegisterFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (registerErrors[name]) {
      setRegisterErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateRegisterForm = () => {
    const errors = {};

    if (!registerFormData.firstName.trim()) errors.firstName = "First name is required";
    if (!registerFormData.lastName.trim()) errors.lastName = "Last name is required";
    
    if (!registerFormData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(registerFormData.email)) {
      errors.email = "Email is invalid";
    }

    if (!registerFormData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(registerFormData.phone)) {
      errors.phone = "Phone number is invalid";
    }

    if (!registerFormData.specialization) errors.specialization = "Specialization is required";
    if (!registerFormData.experience) errors.experience = "Experience is required";
    if (!registerFormData.salary) errors.salary = "Salary is required";
    if (!registerFormData.startDate) errors.startDate = "Start date is required";
    
    if (!registerFormData.password.trim()) {
      errors.password = "Password is required";
    } else if (registerFormData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (registerFormData.password !== registerFormData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleRegisterInstructor = async (e) => {
    e.preventDefault();
    const errors = validateRegisterForm();

    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }

    if (!selectedGym) {
      showAlert('Please select a gym first', 'error');
      return;
    }

    try {
      setRegisterLoading(true);
      
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add text fields
      Object.keys(registerFormData).forEach(key => {
        if (key !== 'resume' && key !== 'certifications' && key !== 'confirmPassword') {
          formData.append(key, registerFormData[key]);
        }
      });
      
      // Add gym ID and role
      formData.append('gymId', selectedGym._id);
      formData.append('role', 'instructor');
      
      // Add resume file
      if (registerFormData.resume) {
        formData.append('resume', registerFormData.resume);
      }
      
      // Add certification files
      registerFormData.certifications.forEach((file, index) => {
        formData.append('certifications', file);
      });

      await api.registerGymInstructor(formData);
      showAlert('Instructor registered successfully!', 'success');
      
      // Reset form
      setRegisterFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        specialization: "",
        experience: "",
        salary: "",
        startDate: "",
        description: "",
        password: "",
        confirmPassword: "",
        resume: null,
        certifications: []
      });
      setRegisterErrors({});
      
      // Refresh instructor lists
      await fetchCurrentInstructors();
      await searchAvailableInstructors();
      
    } catch (error) {
      console.error('Error registering instructor:', error);
      showAlert(error.message || 'Failed to register instructor', 'error');
    } finally {
      setRegisterLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (userGyms.length === 0) {
    return (
      <div className="space-y-6">
        <Link
          to="/gym-owner/instructors"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 group transition-colors"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Instructors
        </Link>
        
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">You need to have an approved gym to add instructors.</p>
          <Link to="/register-gym" className="mt-4 inline-block px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
            Register Your Gym
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/gym-owner/instructors"
        className="inline-flex items-center text-gray-400 hover:text-white mb-8 group transition-colors"
      >
        <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Instructors
      </Link>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Manage Gym Instructors
          </h1>
          <p className="text-gray-400 mt-1">
            Add existing instructors or register new ones for your gym
          </p>
        </div>
        
        {/* Gym Selector */}
        {userGyms.length > 1 && (
          <div className="lg:w-64">
            <select
              value={selectedGym?._id || ''}
              onChange={(e) => {
                const gym = userGyms.find(g => g._id === e.target.value);
                setSelectedGym(gym);
              }}
              className="w-full bg-gray-800/40 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              {userGyms.map((gym) => (
                <option key={gym._id} value={gym._id}>
                  {gym.gymName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50">
        <div className="flex">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === "search"
                ? "bg-violet-500/10 text-violet-400 border-b-2 border-violet-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FiSearch className="inline-block w-5 h-5 mr-2" />
            Search Existing Instructors
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === "register"
                ? "bg-violet-500/10 text-violet-400 border-b-2 border-violet-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FiUserPlus className="inline-block w-5 h-5 mr-2" />
            Register New Instructor
          </button>
        </div>
      </div>

      {/* Current Instructors */}
      {currentInstructors.length > 0 && (
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FiUsers className="w-5 h-5 mr-2 text-violet-400" />
              Current Instructors ({currentInstructors.length})
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Manage your gym's instructor team
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm">Instructor</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm">Specialization</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm">Experience</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm">Salary</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm">Start Date</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm">Documents</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentInstructors.map((gymInstructor, index) => (
                  <tr 
                    key={gymInstructor._id} 
                    className={`border-b border-gray-700/30 hover:bg-gray-900/30 transition-colors ${
                      index % 2 === 0 ? 'bg-gray-900/10' : 'bg-transparent'
                    }`}
                  >
                    {/* Instructor Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-600">
                            <img
                              src={`https://ui-avatars.com/api/?name=${gymInstructor.instructor?.firstName || 'Unknown'}+${gymInstructor.instructor?.lastName || 'User'}&background=8b5cf6&color=fff&size=150`}
                              alt={`${gymInstructor.instructor?.firstName || 'Unknown'} ${gymInstructor.instructor?.lastName || 'User'}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border border-gray-900"></div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-medium text-sm truncate">
                            {gymInstructor.instructor?.firstName || 'Unknown'} {gymInstructor.instructor?.lastName || 'User'}
                          </p>
                          <p className="text-gray-400 text-xs truncate">
                            {gymInstructor.instructor?.email || 'No email'}
                          </p>
                          {gymInstructor.instructor?.phone && (
                            <p className="text-gray-500 text-xs flex items-center mt-0.5">
                              <FiPhone className="w-3 h-3 mr-1" />
                              {gymInstructor.instructor?.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Specialization */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2 py-1 bg-violet-500/10 text-violet-400 rounded text-xs font-medium">
                        <FiActivity className="w-3 h-3 mr-1" />
                        {gymInstructor.specialization}
                      </span>
                    </td>

                    {/* Experience */}
                    <td className="py-4 px-4">
                      <span className="text-white text-sm">
                        {gymInstructor.instructor?.experience || 0} years
                      </span>
                    </td>

                    {/* Salary */}
                    <td className="py-4 px-4">
                      <span className="text-green-400 text-sm font-medium">
                        {gymInstructor.salary ? `Rs. ${gymInstructor.salary.toLocaleString()}` : 'N/A'}
                      </span>
                    </td>

                    {/* Start Date */}
                    <td className="py-4 px-4">
                      {gymInstructor.startDate ? (
                        <span className="text-gray-300 text-sm">
                          {new Date(gymInstructor.startDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">-</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        gymInstructor.isActive 
                          ? 'bg-green-500/10 text-green-400' 
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-1 ${
                          gymInstructor.isActive ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        {gymInstructor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Documents */}
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        {gymInstructor.resume && (
                          <span className="inline-flex items-center px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded text-xs">
                            <FiUpload className="w-3 h-3 mr-0.5" />
                            CV
                          </span>
                        )}
                        {gymInstructor.certifications && gymInstructor.certifications.length > 0 && (
                          <span className="inline-flex items-center px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded text-xs">
                            <FiAward className="w-3 h-3 mr-0.5" />
                            {gymInstructor.certifications.length}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleViewDetails({
                            ...gymInstructor.instructor,
                            salary: gymInstructor.salary,
                            startDate: gymInstructor.startDate,
                            description: gymInstructor.description,
                            resume: gymInstructor.resume,
                            certifications: gymInstructor.certifications,
                            specialization: gymInstructor.specialization,
                            isActive: gymInstructor.isActive
                          })}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveInstructor(gymInstructor.instructor?._id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                          title="Remove Instructor"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "search" && (
        <>
          {/* Search and Filters */}
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-3.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search available instructors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full md:w-48 bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                >
                  {specializations.map((spec) => (
                    <option key={spec} value={spec === "All" ? "all" : spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

        </>
      )}

      {/* Register New Instructor Tab */}
      {activeTab === "register" && (
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-semibold text-white">
              Register New Instructor
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Add a new instructor directly to your gym team
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleRegisterInstructor} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="group">
                    <label className="block text-gray-300 mb-2">First Name *</label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                      <input
                        type="text"
                        name="firstName"
                        value={registerFormData.firstName}
                        onChange={handleRegisterFormChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                        placeholder="Enter first name"
                      />
                      {registerErrors.firstName && (
                        <p className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center">
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                          {registerErrors.firstName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="group">
                    <label className="block text-gray-300 mb-2">Last Name *</label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                      <input
                        type="text"
                        name="lastName"
                        value={registerFormData.lastName}
                        onChange={handleRegisterFormChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                        placeholder="Enter last name"
                      />
                      {registerErrors.lastName && (
                        <p className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center">
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                          {registerErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="group">
                    <label className="block text-gray-300 mb-2">Email *</label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                      <input
                        type="email"
                        name="email"
                        value={registerFormData.email}
                        onChange={handleRegisterFormChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                        placeholder="Enter email address"
                      />
                      {registerErrors.email && (
                        <p className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center">
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                          {registerErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="group">
                    <label className="block text-gray-300 mb-2">Phone *</label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        value={registerFormData.phone}
                        onChange={handleRegisterFormChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                        placeholder="Enter phone number"
                      />
                      {registerErrors.phone && (
                        <p className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center">
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                          {registerErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Professional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Specialization */}
                  <div className="group">
                    <label className="block text-gray-300 mb-2">Specialization *</label>
                    <div className="relative">
                      <FiActivity className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                      <select
                        name="specialization"
                        value={registerFormData.specialization}
                        onChange={handleRegisterFormChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300 appearance-none"
                      >
                        <option value="">Select specialization</option>
                        {specializations.slice(1).map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                      {registerErrors.specialization && (
                        <p className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center">
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                          {registerErrors.specialization}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="group">
                    <label className="block text-gray-300 mb-2">Years of Experience *</label>
                    <div className="relative">
                      <FiAward className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                      <input
                        type="number"
                        name="experience"
                        value={registerFormData.experience}
                        onChange={handleRegisterFormChange}
                        min="0"
                        max="50"
                        className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                        placeholder="Years of experience"
                      />
                      {registerErrors.experience && (
                        <p className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center">
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                          {registerErrors.experience}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Salary */}
                  <div className="group">
                    <label className="block text-gray-300 mb-2">Monthly Salary (LKR) *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-gray-500">Rs.</span>
                      <input
                        type="number"
                        name="salary"
                        value={registerFormData.salary}
                        onChange={handleRegisterFormChange}
                        min="0"
                        className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                        placeholder="Monthly salary"
                      />
                      {registerErrors.salary && (
                        <p className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center">
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                          {registerErrors.salary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="group">
                    <label className="block text-gray-300 mb-2">Start Date *</label>
                    <div className="relative">
                      <FiClock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                      <input
                        type="date"
                        name="startDate"
                        value={registerFormData.startDate}
                        onChange={handleRegisterFormChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                      />
                      {registerErrors.startDate && (
                        <p className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center">
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                          {registerErrors.startDate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="group">
                  <label className="block text-gray-300 mb-2">Description (Optional)</label>
                  <textarea
                    name="description"
                    value={registerFormData.description}
                    onChange={handleRegisterFormChange}
                    rows="3"
                    className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300 resize-none"
                    placeholder="Brief description about the instructor..."
                  />
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Documents</h3>
                
                {/* Resume Upload */}
                <div className="group">
                  <label className="block text-gray-300 mb-2">Resume</label>
                  <div className="relative">
                    <label className="flex items-center justify-center px-6 py-4 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-violet-500 transition-colors group">
                      <input
                        type="file"
                        name="resume"
                        onChange={handleRegisterFormChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />
                      <FiUpload className="w-5 h-5 text-gray-500 group-hover:text-violet-400 mr-2 transition-colors" />
                      <span className="text-gray-400 group-hover:text-white transition-colors">
                        {registerFormData.resume
                          ? registerFormData.resume.name
                          : "Upload resume (PDF, DOC, DOCX)"}
                      </span>
                    </label>
                    {registerErrors.resume && (
                      <p className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center">
                        <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                        {registerErrors.resume}
                      </p>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Upload instructor's resume in PDF, DOC, or DOCX format
                  </p>
                </div>

                {/* Certifications Upload */}
                <div className="group">
                  <label className="block text-gray-300 mb-2">Certifications (Optional)</label>
                  <div className="relative">
                    <label className="flex items-center justify-center px-6 py-4 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-violet-500 transition-colors group">
                      <input
                        type="file"
                        name="certifications"
                        onChange={handleRegisterFormChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                        className="hidden"
                      />
                      <FiUpload className="w-5 h-5 text-gray-500 group-hover:text-violet-400 mr-2 transition-colors" />
                      <span className="text-gray-400 group-hover:text-white transition-colors">
                        Upload certifications (PDF, JPG, PNG)
                      </span>
                    </label>
                    {registerErrors.certifications && (
                      <p className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center">
                        <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                        {registerErrors.certifications}
                      </p>
                    )}
                  </div>
                  
                  {/* Show uploaded certifications */}
                  {registerFormData.certifications.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-gray-300 text-sm font-medium">
                        Uploaded Certifications ({registerFormData.certifications.length}):
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {registerFormData.certifications.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 border border-gray-700/50"
                          >
                            <div className="flex items-center flex-1 min-w-0">
                              <FiCheck className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                              <span className="text-gray-300 text-sm truncate">
                                {file.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedCertifications = registerFormData.certifications.filter((_, i) => i !== index);
                                setRegisterFormData(prev => ({
                                  ...prev,
                                  certifications: updatedCertifications
                                }));
                              }}
                              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors ml-2 flex-shrink-0"
                              title="Remove certification"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-gray-500 text-sm mt-2">
                    Upload fitness certifications, training certificates, or other qualifications
                  </p>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Account Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="group">
                    <label className="block text-gray-300 mb-2">Password *</label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        value={registerFormData.password}
                        onChange={handleRegisterFormChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                        placeholder="Enter password"
                      />
                      {registerErrors.password && (
                        <p className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center">
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                          {registerErrors.password}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="group">
                    <label className="block text-gray-300 mb-2">Confirm Password *</label>
                    <div className="relative">
                      <input
                        type="password"
                        name="confirmPassword"
                        value={registerFormData.confirmPassword}
                        onChange={handleRegisterFormChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                        placeholder="Confirm password"
                      />
                      {registerErrors.confirmPassword && (
                        <p className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center">
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                          {registerErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={registerLoading || !selectedGym}
                  className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative z-10">
                    {registerLoading ? "Registering..." : "Register Instructor"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instructor Details Modal */}
      {showDetailsModal && selectedInstructorDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div key={selectedInstructorDetails?._id} className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h3 className="text-lg font-medium text-white">
                  Instructor Details
                </h3>
                <button
                  onClick={closeDetailsModal}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[80vh] overflow-auto">
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="flex items-start space-x-6">
                    <div className="h-24 w-24 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={getProfileImageUrl(selectedInstructorDetails)}
                        alt={`${selectedInstructorDetails?.firstName || 'N/A'} ${selectedInstructorDetails?.lastName || 'N/A'}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white">
                        {selectedInstructorDetails?.firstName || 'N/A'} {selectedInstructorDetails?.lastName || 'N/A'}
                      </h4>
                      <p className="text-violet-400 text-lg mt-1">
                        {selectedInstructorDetails?.applicationDetails?.specialization || selectedInstructorDetails?.specialization || 'General Fitness'}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-gray-400 text-sm flex items-center">
                          <FiActivity className="w-4 h-4 mr-1" />
                          {selectedInstructorDetails?.applicationDetails?.experience || selectedInstructorDetails?.experience || 0} years experience
                        </span>
                        {selectedInstructorDetails?.salary && (
                          <span className="text-green-400 text-sm font-medium">
                            LKR {selectedInstructorDetails.salary?.toLocaleString()}/month
                          </span>
                        )}
                      </div>
                      {selectedInstructorDetails?.startDate && (
                        <div className="mt-1">
                          <span className="text-gray-400 text-sm flex items-center">
                            <FiCalendar className="w-4 h-4 mr-1" />
                            Started: {new Date(selectedInstructorDetails.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-3 flex items-center">
                      <FiUser className="w-4 h-4 mr-2" />
                      Contact Information
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center text-gray-300">
                        <FiMail className="w-4 h-4 mr-3 text-violet-400" />
                        <span className="text-sm">{selectedInstructorDetails?.email || 'N/A'}</span>
                      </div>
                      {selectedInstructorDetails?.phone && (
                        <div className="flex items-center text-gray-300">
                          <FiPhone className="w-4 h-4 mr-3 text-violet-400" />
                          <span className="text-sm">{selectedInstructorDetails.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-3 flex items-center">
                      <FiAward className="w-4 h-4 mr-2" />
                      Professional Information
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedInstructorDetails.applicationDetails?.preferredLocation && (
                        <div className="flex items-center text-gray-300">
                          <FiMapPin className="w-4 h-4 mr-3 text-violet-400" />
                          <div>
                            <span className="text-xs text-gray-500 block">Preferred Location</span>
                            <span className="text-sm">{selectedInstructorDetails.applicationDetails.preferredLocation}</span>
                          </div>
                        </div>
                      )}
                      {selectedInstructorDetails.applicationDetails && (
                        <div className="flex items-center text-gray-300">
                          <FiActivity className="w-4 h-4 mr-3 text-violet-400" />
                          <div>
                            <span className="text-xs text-gray-500 block">Employment Type</span>
                            <span className="text-sm">
                              {selectedInstructorDetails.applicationDetails.isFreelance ? 'Freelance' : 'Full-time'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {(selectedInstructorDetails.description || selectedInstructorDetails.applicationDetails?.motivation) && (
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h5 className="text-white font-medium mb-3">Description</h5>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {selectedInstructorDetails.description || selectedInstructorDetails.applicationDetails?.motivation}
                      </p>
                    </div>
                  )}

                  {/* Documents */}
                  {(selectedInstructorDetails.resume || selectedInstructorDetails.certifications || 
                    selectedInstructorDetails.applicationDetails?.resume || selectedInstructorDetails.applicationDetails?.certifications) && (
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h5 className="text-white font-medium mb-3 flex items-center">
                        <FiUpload className="w-4 h-4 mr-2" />
                        Documents
                      </h5>
                      <div className="space-y-3">
                        {/* Resume */}
                        {(selectedInstructorDetails.resume || selectedInstructorDetails.applicationDetails?.resume) && (
                          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                                <FiUpload className="w-4 h-4 text-blue-400" />
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">Resume</p>
                                <p className="text-gray-400 text-xs">
                                  {(selectedInstructorDetails.resume || selectedInstructorDetails.applicationDetails?.resume)?.originalName || 'resume.pdf'}
                                </p>
                              </div>
                            </div>
                            <a
                              href={(selectedInstructorDetails.resume || selectedInstructorDetails.applicationDetails?.resume)?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded text-xs hover:bg-blue-500/20 transition-colors"
                            >
                              View
                            </a>
                          </div>
                        )}

                        {/* Certifications */}
                        {((selectedInstructorDetails.certifications && selectedInstructorDetails.certifications.length > 0) || 
                          (selectedInstructorDetails.applicationDetails?.certifications && selectedInstructorDetails.applicationDetails.certifications.length > 0)) && (
                          <div>
                            <p className="text-gray-300 text-sm mb-2">Certifications ({(selectedInstructorDetails.certifications || selectedInstructorDetails.applicationDetails?.certifications || []).length})</p>
                            <div className="space-y-2">
                              {(selectedInstructorDetails.certifications || selectedInstructorDetails.applicationDetails?.certifications || []).map((cert, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                                  <div className="flex items-center">
                                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mr-2">
                                      <FiAward className="w-3 h-3 text-green-400" />
                                    </div>
                                    <div>
                                      <p className="text-white text-xs">{cert.originalName || `Certificate ${index + 1}`}</p>
                                    </div>
                                  </div>
                                  <a
                                    href={cert.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs hover:bg-green-500/20 transition-colors"
                                  >
                                    View
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddInstructor;