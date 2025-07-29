import { useState, useEffect } from "react";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiAward,
  FiStar,
  FiUsers,
  FiActivity,
  FiClock,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiX,
  FiCheck,
  FiDownload,
  FiMessageSquare,
} from "react-icons/fi";
import api from '../../utils/api';
import { useAlert } from '../../contexts/AlertContext';

function VerifiedInstructors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInstructorDetails, setSelectedInstructorDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const { showAlert } = useAlert();

  // Load instructors on component mount
  useEffect(() => {
    fetchInstructors();
  }, [selectedSpecialization, searchTerm]);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedSpecialization !== 'all') {
        params.specialization = selectedSpecialization;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await api.getVerifiedInstructors(params);
      setInstructors(response.data || []);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      showAlert('Failed to fetch verified instructors', 'error');
    } finally {
      setLoading(false);
    }
  };

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

  // Helper functions
  const getProfileImageUrl = (instructor) => {
    if (instructor.application?.profilePicture?.url) {
      return instructor.application.profilePicture.url;
    }
    return `https://ui-avatars.com/api/?name=${instructor.firstName}+${instructor.lastName}&background=8b5cf6&color=fff&size=150`;
  };

  const handleToggleStatus = async (instructorId, currentStatus) => {
    try {
      setActionLoading(true);
      const newStatus = !currentStatus;
      await api.toggleInstructorStatus(instructorId, newStatus);
      showAlert(`Instructor ${newStatus ? 'activated' : 'deactivated'} successfully`, 'success');
      await fetchInstructors();
    } catch (error) {
      console.error('Error toggling instructor status:', error);
      showAlert(error.message || 'Failed to update instructor status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const showConfirmation = (instructor, action) => {
    setSelectedInstructor(instructor);
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedInstructor || !confirmAction) return;
    
    if (confirmAction === 'toggle') {
      await handleToggleStatus(selectedInstructor._id, selectedInstructor.isActive);
    }
    
    setShowConfirmModal(false);
    setSelectedInstructor(null);
    setConfirmAction(null);
  };

  const handleCancelAction = () => {
    setShowConfirmModal(false);
    setSelectedInstructor(null);
    setConfirmAction(null);
  };

  const handleViewDetails = async (instructorId) => {
    try {
      setDetailsLoading(true);
      setShowDetailsModal(true);
      const response = await api.getInstructorDetailsById(instructorId);
      setSelectedInstructorDetails(response.data);
    } catch (error) {
      console.error('Error fetching instructor details:', error);
      showAlert('Failed to fetch instructor details', 'error');
      setShowDetailsModal(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedInstructorDetails(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading instructors...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Verified Instructors
          </h1>
          <p className="text-gray-400 mt-1">
            View and manage verified instructors
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-4 top-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search instructors..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
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

      {/* Instructors Table */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden">
        {instructors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No verified instructors found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-300 font-medium text-sm">Instructor</th>
                  <th className="text-left px-4 py-3 text-gray-300 font-medium text-sm">Specialization</th>
                  <th className="text-left px-4 py-3 text-gray-300 font-medium text-sm">Experience</th>
                  <th className="text-center px-4 py-3 text-gray-300 font-medium text-sm">Students</th>
                  <th className="text-center px-4 py-3 text-gray-300 font-medium text-sm">Rating</th>
                  <th className="text-center px-4 py-3 text-gray-300 font-medium text-sm">Status</th>
                  <th className="text-center px-4 py-3 text-gray-300 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {instructors.map((instructor, index) => (
                  <tr 
                    key={instructor._id}
                    className={`border-t border-gray-700/50 hover:bg-gray-700/20 transition-colors ${
                      index % 2 === 0 ? 'bg-gray-800/20' : 'bg-transparent'
                    }`}
                  >
                    {/* Instructor */}
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={getProfileImageUrl(instructor)}
                            alt={`${instructor.firstName} ${instructor.lastName}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium text-sm">
                            {instructor.firstName} {instructor.lastName}
                          </p>
                          <p className="text-gray-400 text-xs truncate">{instructor.email}</p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Specialization */}
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-violet-500/10 text-violet-400 rounded text-xs">
                        {instructor.application?.specialization || instructor.specialization?.[0] || 'General Fitness'}
                      </span>
                    </td>
                    
                    {/* Experience */}
                    <td className="px-4 py-3">
                      <div className="text-white text-sm">
                        {instructor.application?.experience || instructor.experience || 0} years
                      </div>
                    </td>
                    
                    {/* Students */}
                    <td className="px-4 py-3 text-center">
                      <div className="text-white text-sm font-medium">
                        {instructor.stats?.totalStudents || 0}
                      </div>
                    </td>
                    
                    {/* Rating */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center text-yellow-400 text-sm">
                        <FiStar className="w-3 h-3 mr-1" />
                        <span className="text-white">{instructor.stats?.rating || 'N/A'}</span>
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        instructor.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {instructor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        <button 
                          onClick={() => handleViewDetails(instructor._id)}
                          className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                          title="View Details"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => showConfirmation(instructor, 'toggle')}
                          disabled={actionLoading}
                          className={`p-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            instructor.isActive 
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                              : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                          }`}
                          title={instructor.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {instructor.isActive ? <FiX className="w-3.5 h-3.5" /> : <FiCheck className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedInstructor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-500/10 rounded-full">
                <FiActivity className="w-6 h-6 text-yellow-400" />
              </div>
              
              <h3 className="text-lg font-medium text-white mb-4 text-center">
                {confirmAction === 'toggle' && selectedInstructor.isActive 
                  ? 'Deactivate Instructor' 
                  : 'Activate Instructor'
                }
              </h3>

              <div className="mb-6">
                <p className="text-gray-400 text-center mb-4">
                  Are you sure you want to {selectedInstructor.isActive ? 'deactivate' : 'activate'}{' '}
                  <span className="text-white font-medium">
                    {selectedInstructor.firstName} {selectedInstructor.lastName}
                  </span>?
                </p>
                
                {selectedInstructor.isActive && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm">
                      ⚠️ Deactivating this instructor will prevent them from accessing instructor features and may affect their ongoing classes.
                    </p>
                  </div>
                )}
                
                {!selectedInstructor.isActive && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-sm">
                      ✓ Activating this instructor will restore their access to instructor features.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancelAction}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={actionLoading}
                  className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedInstructor.isActive
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                  }`}
                >
                  {actionLoading 
                    ? (selectedInstructor.isActive ? 'Deactivating...' : 'Activating...')
                    : (selectedInstructor.isActive ? 'Deactivate' : 'Activate')
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructor Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
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
              <div className="p-6 max-h-[70vh] overflow-auto">
                {detailsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-white text-lg">Loading instructor details...</div>
                  </div>
                ) : selectedInstructorDetails ? (
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="flex items-start space-x-6">
                      <div className="h-24 w-24 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={selectedInstructorDetails.application?.profilePicture?.url || 
                            `https://ui-avatars.com/api/?name=${selectedInstructorDetails.firstName}+${selectedInstructorDetails.lastName}&background=8b5cf6&color=fff&size=150`}
                          alt={`${selectedInstructorDetails.firstName} ${selectedInstructorDetails.lastName}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold text-white">
                          {selectedInstructorDetails.firstName} {selectedInstructorDetails.lastName}
                        </h4>
                        <p className="text-violet-400 text-lg mt-1">
                          {selectedInstructorDetails.application?.specialization || 'General Fitness'}
                        </p>
                        <div className="flex items-center space-x-4 mt-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedInstructorDetails.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {selectedInstructorDetails.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                          <span className="text-gray-400">
                            Joined {new Date(selectedInstructorDetails.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h5 className="text-white font-medium mb-3 flex items-center">
                        <FiMail className="w-4 h-4 mr-2 text-violet-400" />
                        Contact Information
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-400 text-sm">Email</span>
                          <p className="text-white">{selectedInstructorDetails.email}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Phone</span>
                          <p className="text-white">{selectedInstructorDetails.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Professional Info */}
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h5 className="text-white font-medium mb-3 flex items-center">
                        <FiAward className="w-4 h-4 mr-2 text-violet-400" />
                        Professional Information
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-gray-400 text-sm">Experience</span>
                          <p className="text-white font-medium">
                            {selectedInstructorDetails.application?.experience || selectedInstructorDetails.experience || 0} years
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Preferred Location</span>
                          <p className="text-white">
                            {selectedInstructorDetails.application?.preferredLocation || 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Type</span>
                          <p className="text-white">
                            {selectedInstructorDetails.application?.isFreelance ? 'Freelance' : 'Full-time'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                        <FiUsers className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                          {selectedInstructorDetails.stats?.totalStudents || 0}
                        </div>
                        <div className="text-gray-400 text-sm">Total Students</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                        <FiActivity className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                          {selectedInstructorDetails.stats?.classesCompleted || 0}
                        </div>
                        <div className="text-gray-400 text-sm">Classes Completed</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                        <FiStar className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                          {selectedInstructorDetails.stats?.rating || 'N/A'}
                        </div>
                        <div className="text-gray-400 text-sm">Rating</div>
                      </div>
                    </div>

                    {/* Availability */}
                    {selectedInstructorDetails.application?.availability && selectedInstructorDetails.application.availability.length > 0 && (
                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <h5 className="text-white font-medium mb-3 flex items-center">
                          <FiClock className="w-4 h-4 mr-2 text-violet-400" />
                          Availability
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedInstructorDetails.application.availability.map((slot, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm"
                            >
                              {slot.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Documents */}
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h5 className="text-white font-medium mb-3 flex items-center">
                        <FiAward className="w-4 h-4 mr-2 text-violet-400" />
                        Documents
                      </h5>
                      
                      {/* Resume */}
                      {selectedInstructorDetails.application?.resume?.url && (
                        <div className="mb-4">
                          <h6 className="text-gray-300 font-medium mb-2">Resume</h6>
                          <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                            <span className="text-white text-sm">
                              {selectedInstructorDetails.application.resume.originalName || 'Resume'}
                            </span>
                            <a
                              href={selectedInstructorDetails.application.resume.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-violet-400 hover:text-violet-300 transition-colors"
                              title="Download Resume"
                            >
                              <FiDownload className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {/* Certifications */}
                      {selectedInstructorDetails.application?.certifications && selectedInstructorDetails.application.certifications.length > 0 && (
                        <div>
                          <h6 className="text-gray-300 font-medium mb-2">
                            Certifications ({selectedInstructorDetails.application.certifications.length})
                          </h6>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedInstructorDetails.application.certifications.map((cert, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                <span className="text-white text-sm">
                                  {cert.originalName || `Certificate ${index + 1}`}
                                </span>
                                <div className="flex space-x-2">
                                  <a
                                    href={cert.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 text-violet-400 hover:text-violet-300 transition-colors"
                                    title="View Certificate"
                                  >
                                    <FiEye className="w-4 h-4" />
                                  </a>
                                  <a
                                    href={cert.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 text-violet-400 hover:text-violet-300 transition-colors"
                                    title="Download Certificate"
                                  >
                                    <FiDownload className="w-4 h-4" />
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* No documents message */}
                      {!selectedInstructorDetails.application?.resume?.url && 
                       (!selectedInstructorDetails.application?.certifications || selectedInstructorDetails.application.certifications.length === 0) && (
                        <p className="text-gray-400 text-sm">No documents available</p>
                      )}
                    </div>

                    {/* Motivation */}
                    {selectedInstructorDetails.application?.motivation && (
                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <h5 className="text-white font-medium mb-3 flex items-center">
                          <FiMessageSquare className="w-4 h-4 mr-2 text-violet-400" />
                          Why They Joined
                        </h5>
                        <p className="text-gray-300 leading-relaxed">
                          {selectedInstructorDetails.application.motivation}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">Failed to load instructor details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifiedInstructors;
