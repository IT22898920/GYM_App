import { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiUser,
  FiActivity,
  FiClock,
  FiMapPin,
  FiMail,
  FiPhone,
  FiCheck,
  FiX,
  FiSend,
  FiAward,
  FiCalendar,
  FiBookOpen,
  FiDollarSign,
  FiFileText,
  FiDownload,
  FiEye,
  FiChevronRight,
} from "react-icons/fi";
import { MdVerified, MdLocationOn, MdTimer } from "react-icons/md";
import { HiOutlineSparkles, HiOutlineAcademicCap } from "react-icons/hi";
import api from '../../utils/api';
import { useAlert } from '../../contexts/AlertContext';

function ApplyToInstructor() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState("");
  const { showAlert } = useAlert();

  // Fetch freelance instructors
  useEffect(() => {
    const fetchFreelanceInstructors = async () => {
      if (!selectedGym) return; // Don't fetch if no gym is selected
      
      try {
        setLoading(true);
        const response = await api.getFreelanceInstructors(selectedGym);
        if (response.success) {
          setInstructors(response.data);
        } else {
          showAlert('Failed to fetch freelance instructors', 'error');
        }
      } catch (error) {
        console.error('Error fetching freelance instructors:', error);
        showAlert('Error fetching freelance instructors', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchFreelanceInstructors();
  }, [selectedGym, showAlert]); // Add selectedGym as dependency

  // Fetch gym owner's gyms
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const response = await api.getGymsByOwner();
        if (response.success) {
          setGyms(response.data);
          // Set default gym if only one exists
          if (response.data.length === 1) {
            setSelectedGym(response.data[0]._id);
          }
        }
      } catch (error) {
        console.error('Error fetching gyms:', error);
      }
    };

    fetchGyms();
  }, []);

  const specializations = [
    "All",
    "Yoga",
    "Strength Training",
    "HIIT",
    "Pilates",
    "CrossFit",
    "Zumba",
  ];

  const handleSendRequest = async () => {
    if (!requestMessage.trim()) {
      showAlert('Please enter a message', 'error');
      return;
    }

    if (!selectedGym) {
      showAlert('Please select a gym', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await api.sendCollaborationRequest(
        selectedInstructor._id,
        requestMessage,
        selectedGym
      );

      if (response.success) {
        showAlert('Collaboration request sent successfully!', 'success');
        setShowRequestModal(false);
        setRequestMessage("");
        setSelectedInstructor(null);
        setSelectedGym(gyms.length === 1 ? gyms[0]._id : "");
      } else {
        showAlert(response.message || 'Failed to send request', 'error');
      }
    } catch (error) {
      console.error('Error sending collaboration request:', error);
      showAlert(error.message || 'Failed to send collaboration request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredInstructors = instructors.filter((instructor) => {
    const fullName = `${instructor.firstName} ${instructor.lastName}`;
    const specialization = instructor.applicationDetails?.specialization || '';
    
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization =
      selectedSpecialization === "all" ||
      selectedSpecialization.toLowerCase() === "all" ||
      specialization.toLowerCase() === selectedSpecialization.toLowerCase();
    
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl">
              <HiOutlineSparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Find Freelance Instructors
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Connect with professional freelance instructors to expand your gym's offerings
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Gym Selection Dropdown */}
          {gyms.length > 1 && (
            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-sm font-medium">Select Gym</label>
              <select
                value={selectedGym}
                onChange={(e) => setSelectedGym(e.target.value)}
                className="bg-gray-800/40 backdrop-blur-xl text-white rounded-lg px-4 py-2 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="">Choose a gym...</option>
                {gyms.map((gym) => (
                  <option key={gym._id} value={gym._id}>
                    {gym.gymName}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="px-4 py-2 bg-gray-800/40 backdrop-blur-xl rounded-lg border border-gray-700/50">
            <div className="flex items-center gap-2">
              <FiUser className="w-5 h-5 text-violet-400" />
              <span className="text-white font-medium">{instructors.length}</span>
              <span className="text-gray-400">Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-4 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, specialization, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-xl pl-12 pr-4 py-4 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300 placeholder:text-gray-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <FiFilter className="absolute left-3 top-4 text-gray-500 pointer-events-none" />
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="bg-gray-900/50 text-white rounded-xl pl-10 pr-8 py-4 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none appearance-none cursor-pointer min-w-[160px]"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec.toLowerCase()}>
                    {spec}
                  </option>
                ))}
              </select>
              <FiChevronRight className="absolute right-3 top-4 text-gray-500 rotate-90 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {/* Active Filters */}
        {(searchTerm || selectedSpecialization !== "all") && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-400">Active filters:</span>
            {searchTerm && (
              <span className="px-3 py-1 bg-violet-600/20 text-violet-400 rounded-full text-sm flex items-center gap-2">
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:text-white transition-colors"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedSpecialization !== "all" && (
              <span className="px-3 py-1 bg-violet-600/20 text-violet-400 rounded-full text-sm flex items-center gap-2">
                {selectedSpecialization}
                <button
                  onClick={() => setSelectedSpecialization("all")}
                  className="hover:text-white transition-colors"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Instructors Grid */}
      {!selectedGym && gyms.length > 1 ? (
        <div className="text-center py-16 bg-gray-800/20 rounded-2xl border border-gray-700/30">
          <FiUser className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-300 mb-2">Select a gym to view instructors</h3>
          <p className="text-gray-400">Choose a gym from the dropdown above to find available freelance instructors</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading freelance instructors...</p>
          </div>
        </div>
      ) : filteredInstructors.length === 0 ? (
        <div className="text-center py-16 bg-gray-800/20 rounded-2xl border border-gray-700/30">
          <FiUser className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-300 mb-2">No instructors found</h3>
          <p className="text-gray-400">
            {selectedGym ? 'All available freelance instructors may have already been added to this gym, or try adjusting your filters' : 'Try adjusting your filters or search criteria'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredInstructors.map((instructor) => (
            <div
              key={instructor._id}
              className="group bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50 hover:border-violet-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] hover:scale-[1.02]"
            >
              {/* Card Header with Image */}
              <div className="relative h-48 bg-gradient-to-br from-violet-600/20 to-indigo-600/20">
                <img
                  src={instructor.applicationDetails?.profilePicture?.url || `https://ui-avatars.com/api/?name=${instructor.firstName}+${instructor.lastName}&background=8b5cf6&color=fff&size=300`}
                  alt={`${instructor.firstName} ${instructor.lastName}`}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-green-500/20 backdrop-blur-sm text-green-400 rounded-full text-sm font-medium flex items-center gap-1.5 border border-green-500/30">
                    <MdVerified className="w-4 h-4" />
                    Verified
                  </span>
                  <span className="px-3 py-1.5 bg-violet-500/20 backdrop-blur-sm text-violet-400 rounded-full text-sm font-medium flex items-center gap-1.5 border border-violet-500/30">
                    <FiActivity className="w-4 h-4" />
                    Freelance
                  </span>
                </div>
                
                {/* Name and Specialization */}
                <div className="absolute bottom-4 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {instructor.firstName} {instructor.lastName}
                  </h3>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm">
                    <HiOutlineAcademicCap className="w-4 h-4" />
                    {instructor.applicationDetails?.specialization || 'General Fitness'}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-900/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <FiAward className="w-4 h-4" />
                      Experience
                    </div>
                    <p className="text-white font-semibold">{instructor.applicationDetails?.experience || 0} years</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <MdLocationOn className="w-4 h-4" />
                      Location
                    </div>
                    <p className="text-white font-semibold truncate">
                      {instructor.applicationDetails?.preferredLocation || 'Flexible'}
                    </p>
                  </div>
                </div>

                {/* Availability */}
                {instructor.applicationDetails?.availability && instructor.applicationDetails.availability.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <MdTimer className="w-4 h-4" />
                      Availability
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {instructor.applicationDetails.availability.map((day, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-violet-600/10 text-violet-400 rounded-lg text-sm border border-violet-600/20"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications Count */}
                {instructor.applicationDetails?.certifications && instructor.applicationDetails.certifications.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <FiFileText className="w-4 h-4" />
                        Certifications
                      </div>
                      <span className="px-3 py-1 bg-gray-900/50 text-gray-300 rounded-lg text-sm">
                        {instructor.applicationDetails.certifications.length} verified
                      </span>
                    </div>
                  </div>
                )}

                {/* About Preview */}
                {instructor.applicationDetails?.motivation && (
                  <div className="mb-6">
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                      {instructor.applicationDetails.motivation}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedInstructor(instructor);
                      setShowRequestModal(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-violet-500/25"
                  >
                    <FiSend className="w-5 h-5" />
                    <span>Send Request</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedInstructor(instructor);
                      setShowRequestModal(true);
                    }}
                    className="p-3 bg-gray-900/50 text-gray-400 rounded-xl hover:text-white hover:bg-gray-800/50 transition-all duration-300 border border-gray-700/50"
                  >
                    <FiEye className="w-5 h-5" />
                  </button>
                </div>
              </div>
          </div>
        ))}
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && selectedInstructor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div
              className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
              onClick={() => {
                setShowRequestModal(false);
                setSelectedInstructor(null);
                setRequestMessage("");
              }}
            />

            <div className="inline-block w-full max-w-4xl p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700/50 shadow-2xl relative">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  setSelectedInstructor(null);
                  setRequestMessage("");
                }}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
              >
                <FiX className="w-6 h-6" />
              </button>

              <div className="space-y-6">
                {/* Modal Header */}
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    Send Collaboration Request
                  </h3>
                  <p className="text-gray-400">Connect with {selectedInstructor.firstName} to join your gym as a freelance instructor</p>
                </div>

                {/* Instructor Details Card */}
                <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <img
                      src={selectedInstructor.applicationDetails?.profilePicture?.url || `https://ui-avatars.com/api/?name=${selectedInstructor.firstName}+${selectedInstructor.lastName}&background=8b5cf6&color=fff&size=300`}
                      alt={`${selectedInstructor.firstName} ${selectedInstructor.lastName}`}
                      className="w-24 h-24 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-2xl font-bold text-white mb-1">
                            {selectedInstructor.firstName} {selectedInstructor.lastName}
                          </h4>
                          <p className="text-violet-400 font-medium">
                            {selectedInstructor.applicationDetails?.specialization || 'General Fitness'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium flex items-center gap-1">
                            <MdVerified className="w-4 h-4" />
                            Verified
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <FiAward className="w-4 h-4" />
                            Experience
                          </div>
                          <p className="text-white font-semibold">{selectedInstructor.applicationDetails?.experience || 0} years</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <MdLocationOn className="w-4 h-4" />
                            Location
                          </div>
                          <p className="text-white font-semibold">{selectedInstructor.applicationDetails?.preferredLocation || 'Flexible'}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <FiFileText className="w-4 h-4" />
                            Certifications
                          </div>
                          <p className="text-white font-semibold">{selectedInstructor.applicationDetails?.certifications?.length || 0} verified</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                    <div className="flex items-center text-gray-400 mb-2">
                      <FiMail className="w-4 h-4 mr-2 text-violet-400" />
                      Email Address
                    </div>
                    <div className="text-white font-medium">{selectedInstructor.email}</div>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                    <div className="flex items-center text-gray-400 mb-2">
                      <FiPhone className="w-4 h-4 mr-2 text-violet-400" />
                      Phone Number
                    </div>
                    <div className="text-white font-medium">{selectedInstructor.phone || 'Not provided'}</div>
                  </div>
                </div>

                {/* Availability */}
                {selectedInstructor.applicationDetails?.availability && selectedInstructor.applicationDetails.availability.length > 0 && (
                  <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                    <div className="flex items-center text-gray-400 mb-3">
                      <MdTimer className="w-4 h-4 mr-2 text-violet-400" />
                      Available Days
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedInstructor.applicationDetails.availability.map((day, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-violet-600/10 text-violet-400 rounded-lg text-sm font-medium border border-violet-600/20"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gym Selection */}
                {gyms.length > 1 && (
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Select Gym
                    </label>
                    <select
                      value={selectedGym}
                      onChange={(e) => setSelectedGym(e.target.value)}
                      className="w-full bg-gray-900/50 text-white rounded-xl px-5 py-4 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Choose a gym...</option>
                      {gyms.map((gym) => (
                        <option key={gym._id} value={gym._id}>
                          {gym.gymName} - {gym.gymAddress?.city}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Request Message */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Your Message
                  </label>
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    rows="5"
                    className="w-full bg-gray-900/50 text-white rounded-xl px-5 py-4 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300 resize-none"
                    placeholder="Introduce your gym and explain why you'd like to collaborate with this instructor..."
                    maxLength={500}
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    {requestMessage.length}/500 characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <FiCheck className="w-4 h-4" />
                    Request will be sent to instructor for approval
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowRequestModal(false);
                        setSelectedInstructor(null);
                        setRequestMessage("");
                      }}
                      className="px-6 py-3 text-gray-400 hover:text-white transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendRequest}
                      disabled={!requestMessage.trim() || isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg hover:shadow-violet-500/25"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <FiSend className="w-5 h-5" />
                          <span>Send Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplyToInstructor;