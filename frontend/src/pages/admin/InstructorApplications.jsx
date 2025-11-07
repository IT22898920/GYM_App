import { useState, useEffect } from "react";
import {
  FiSearch,
  FiCheck,
  FiX,
  FiMail,
  FiPhone,
  FiCalendar,
  FiAward,
  FiDownload,
  FiEye,
  FiExternalLink,
  FiUser,
  FiMessageSquare,
  FiActivity,
  FiClock,
  FiMapPin,
} from "react-icons/fi";
import api from '../../utils/api';
import { useAlert } from '../../contexts/AlertContext';

function InstructorApplications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFreelancing, setSelectedFreelancing] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedApplicationDetails, setSelectedApplicationDetails] = useState(null);
  const { showAlert } = useAlert();

  // Load applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.getAllInstructorApplications();
      setApplications(response.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      showAlert('Failed to fetch instructor applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      setActionLoading(true);
      await api.approveInstructorApplication(applicationId);
      showAlert('Application approved successfully!', 'success');
      // Refresh applications list
      await fetchApplications();
    } catch (error) {
      console.error('Error approving application:', error);
      showAlert(error.message || 'Failed to approve application', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      setActionLoading(true);
      await api.rejectInstructorApplication(applicationId, rejectReason);
      showAlert('Application rejected successfully', 'success');
      // Refresh applications list
      await fetchApplications();
      setShowRejectModal(false);
      setRejectReason("");
    } catch (error) {
      console.error('Error rejecting application:', error);
      showAlert(error.message || 'Failed to reject application', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApplications = applications.filter(
    (app) => {
      // Search filter
      const matchesSearch =
        `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Freelancing filter
      const matchesFreelancing = selectedFreelancing === 'all' ||
        (selectedFreelancing === 'freelancing' && app.isFreelance === true) ||
        (selectedFreelancing === 'non-freelancing' && app.isFreelance === false);
      
      return matchesSearch && matchesFreelancing;
    }
  );

  // Helper function to format availability
  const formatAvailability = (availability) => {
    if (!availability || !Array.isArray(availability)) return [];
    return availability.map(slot => {
      const formatted = slot.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return formatted;
    });
  };

  // Helper function to get profile image URL
  const getProfileImageUrl = (app) => {
    if (app.profilePicture?.url) {
      return app.profilePicture.url;
    }
    // Fallback to a default avatar
    return `https://ui-avatars.com/api/?name=${app.firstName}+${app.lastName}&background=8b5cf6&color=fff&size=150`;
  };

  // Helper function to detect document type
  const getDocumentType = (url, format) => {
    if (format) {
      const lowerFormat = format.toLowerCase();
      if (['pdf'].includes(lowerFormat)) return 'pdf';
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(lowerFormat)) return 'image';
    }
    
    // Fallback to URL extension
    const extension = url.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    
    return 'unknown';
  };

  // Function to handle document viewing
  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setShowDocumentModal(true);
  };

  // Function to close document modal
  const closeDocumentModal = () => {
    setShowDocumentModal(false);
    setSelectedDocument(null);
  };

  // Function to handle application viewing
  const handleViewApplication = (application) => {
    setSelectedApplicationDetails(application);
    setShowApplicationModal(true);
  };

  // Function to close application modal
  const closeApplicationModal = () => {
    setShowApplicationModal(false);
    setSelectedApplicationDetails(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Instructor Applications
          </h1>
          <p className="text-gray-400 mt-1">
            Review and manage instructor applications
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
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedFreelancing}
              onChange={(e) => setSelectedFreelancing(e.target.value)}
              className="w-full md:w-48 bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="freelancing">Freelancing</option>
              <option value="non-freelancing">Non-Freelancing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No instructor applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left p-4 text-gray-300 font-medium">Applicant</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Specialization</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Experience</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Applied Date</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Documents</th>
                  <th className="text-center p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application, index) => (
                  <tr 
                    key={application._id}
                    className={`border-t border-gray-700/50 hover:bg-gray-700/20 transition-colors ${
                      index % 2 === 0 ? 'bg-gray-800/20' : 'bg-transparent'
                    }`}
                  >
                    {/* Applicant */}
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={getProfileImageUrl(application)}
                            alt={`${application.firstName} ${application.lastName}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">
                            {application.firstName} {application.lastName}
                          </p>
                          <p className="text-gray-400 text-sm truncate">{application.email}</p>
                          <p className="text-gray-500 text-xs">{application.phone}</p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Specialization */}
                    <td className="p-4">
                      <span className="px-2 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm">
                        {application.specialization}
                      </span>
                      <div className="mt-1">
                        <span className="text-gray-400 text-xs">
                          {application.isFreelance ? 'Freelance' : 'Full-time'}
                        </span>
                      </div>
                    </td>
                    
                    {/* Experience */}
                    <td className="p-4">
                      <div className="text-white font-medium">{application.experience} years</div>
                      <div className="text-gray-400 text-sm">{application.preferredLocation}</div>
                    </td>
                    
                    {/* Status */}
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        application.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                        application.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                        application.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {application.status.toUpperCase()}
                      </span>
                    </td>
                    
                    {/* Applied Date */}
                    <td className="p-4">
                      <div className="text-white text-sm">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {formatAvailability(application.availability).slice(0, 2).join(', ')}
                        {application.availability && application.availability.length > 2 && '...'}
                      </div>
                    </td>
                    
                    {/* Documents */}
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {application.resume?.url && (
                          <a
                            href={application.resume.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-violet-400 hover:text-violet-300 transition-colors"
                            title="Download Resume"
                          >
                            <FiDownload className="w-4 h-4" />
                          </a>
                        )}
                        {application.certifications && application.certifications.length > 0 && (
                          <button
                            onClick={() => handleViewDocument(application.certifications[0])}
                            className="p-1 text-violet-400 hover:text-violet-300 transition-colors"
                            title={`View ${application.certifications.length} Certificate(s)`}
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                        )}
                        <span className="text-xs text-gray-500">
                          {application.certifications?.length || 0} cert(s)
                        </span>
                      </div>
                    </td>
                    
                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleViewApplication(application)}
                          className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                          title="View Application Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        {application.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApprove(application._id)}
                              disabled={actionLoading}
                              className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Approve Application"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedApplication(application._id);
                                setShowRejectModal(true);
                              }}
                              disabled={actionLoading}
                              className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Reject Application"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-500 ml-2">
                            {application.status === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
              <h3 className="text-lg font-medium text-white mb-4">
                Reject Application
              </h3>

              <div className="mt-4">
                <label className="block text-gray-400 mb-2">
                  Reason for Rejection
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  rows="4"
                  placeholder="Please provide a reason for rejection..."
                ></textarea>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason("");
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedApplication)}
                  disabled={actionLoading || !rejectReason.trim()}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Rejecting...' : 'Reject Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocumentModal && selectedDocument && (
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
                  {selectedDocument.originalName || 'Certificate'}
                </h3>
                <div className="flex items-center space-x-4">
                  <a
                    href={selectedDocument.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-3 py-2 bg-violet-500/10 text-violet-400 rounded-lg hover:bg-violet-500/20 transition-colors"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    <span>Open in New Tab</span>
                  </a>
                  <a
                    href={selectedDocument.url}
                    download={selectedDocument.originalName}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                  <button
                    onClick={closeDocumentModal}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[70vh] overflow-auto">
                {(() => {
                  const docType = getDocumentType(selectedDocument.url, selectedDocument.format);
                  
                  if (docType === 'pdf') {
                    return (
                      <div className="w-full h-96 bg-gray-900 rounded-lg flex items-center justify-center">
                        <iframe
                          src={`${selectedDocument.url}#toolbar=0`}
                          className="w-full h-full rounded-lg"
                          title={selectedDocument.originalName || 'Certificate'}
                        />
                      </div>
                    );
                  } else if (docType === 'image') {
                    return (
                      <div className="flex justify-center">
                        <img
                          src={selectedDocument.url}
                          alt={selectedDocument.originalName || 'Certificate'}
                          className="max-w-full max-h-96 object-contain rounded-lg"
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center py-12">
                        <p className="text-gray-400 mb-4">
                          Cannot preview this file type. Please download to view.
                        </p>
                        <a
                          href={selectedDocument.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-violet-500/10 text-violet-400 rounded-lg hover:bg-violet-500/20 transition-colors"
                        >
                          <FiExternalLink className="w-4 h-4" />
                          <span>Open in New Tab</span>
                        </a>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Details Modal */}
      {showApplicationModal && selectedApplicationDetails && (
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
                  Instructor Application Details
                </h3>
                <button
                  onClick={closeApplicationModal}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[70vh] overflow-auto">
                <div className="space-y-6">
                  {/* Applicant Info */}
                  <div className="flex items-start space-x-6">
                    <div className="h-24 w-24 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={getProfileImageUrl(selectedApplicationDetails)}
                        alt={`${selectedApplicationDetails.firstName} ${selectedApplicationDetails.lastName}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-white">
                        {selectedApplicationDetails.firstName} {selectedApplicationDetails.lastName}
                      </h4>
                      <p className="text-violet-400 text-lg mt-1">
                        {selectedApplicationDetails.specialization}
                      </p>
                      <div className="flex items-center space-x-4 mt-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedApplicationDetails.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                          selectedApplicationDetails.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                          selectedApplicationDetails.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                          'bg-blue-500/10 text-blue-400'
                        }`}>
                          {selectedApplicationDetails.status.toUpperCase()}
                        </span>
                        <span className="text-gray-400">
                          Applied {new Date(selectedApplicationDetails.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-3 flex items-center">
                      <FiUser className="w-4 h-4 mr-2 text-violet-400" />
                      Contact Information
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400 text-sm">Email</span>
                        <p className="text-white">{selectedApplicationDetails.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Phone</span>
                        <p className="text-white">{selectedApplicationDetails.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-3 flex items-center">
                      <FiActivity className="w-4 h-4 mr-2 text-violet-400" />
                      Professional Information
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-gray-400 text-sm">Specialization</span>
                        <p className="text-white font-medium">{selectedApplicationDetails.specialization}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Experience</span>
                        <p className="text-white">{selectedApplicationDetails.experience} years</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Type</span>
                        <p className="text-white">
                          {selectedApplicationDetails.isFreelance ? 'Freelance' : 'Full-time'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location & Availability */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h5 className="text-white font-medium mb-3 flex items-center">
                        <FiMapPin className="w-4 h-4 mr-2 text-violet-400" />
                        Location
                      </h5>
                      <p className="text-white">{selectedApplicationDetails.preferredLocation}</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h5 className="text-white font-medium mb-3 flex items-center">
                        <FiClock className="w-4 h-4 mr-2 text-violet-400" />
                        Availability
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {formatAvailability(selectedApplicationDetails.availability).map((time, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-violet-500/10 text-violet-400 rounded text-xs"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-3">Documents</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Resume */}
                      {selectedApplicationDetails.resume?.url && (
                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                          <span className="text-white text-sm">Resume</span>
                          <a
                            href={selectedApplicationDetails.resume.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-violet-400 hover:text-violet-300 transition-colors"
                            title="Download Resume"
                          >
                            <FiDownload className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                      
                      {/* Certifications */}
                      {selectedApplicationDetails.certifications && selectedApplicationDetails.certifications.length > 0 && (
                        <div className="col-span-full">
                          <h6 className="text-gray-300 font-medium mb-2">
                            Certifications ({selectedApplicationDetails.certifications.length})
                          </h6>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedApplicationDetails.certifications.map((cert, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                <span className="text-white text-sm">
                                  {cert.originalName || `Certificate ${index + 1}`}
                                </span>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleViewDocument(cert)}
                                    className="p-1 text-violet-400 hover:text-violet-300 transition-colors"
                                    title="View Certificate"
                                  >
                                    <FiEye className="w-4 h-4" />
                                  </button>
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
                    </div>
                  </div>

                  {/* Motivation */}
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-3 flex items-center">
                      <FiMessageSquare className="w-4 h-4 mr-2 text-violet-400" />
                      Why They Want to Join Our Team
                    </h5>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedApplicationDetails.motivation}
                    </p>
                  </div>

                  {/* Admin Notes (if any) */}
                  {selectedApplicationDetails.adminNotes && (
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h5 className="text-white font-medium mb-3">Admin Notes</h5>
                      <p className="text-gray-300">{selectedApplicationDetails.adminNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorApplications;