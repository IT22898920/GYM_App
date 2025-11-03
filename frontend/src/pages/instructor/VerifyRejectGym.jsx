import { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiCheck,
  FiX,
  FiMapPin,
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiClock,
  FiStar,
  FiMail,
  FiPhone,
  FiGlobe,
  FiInstagram,
  FiMessageSquare,
} from "react-icons/fi";
import { useAlert } from "../../contexts/AlertContext";
import api from "../../utils/api";

function VerifyRejectGym() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collaborationRequests, setCollaborationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  // Fetch collaboration requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const status = selectedFilter === "all" ? null : selectedFilter;
        const response = await api.getInstructorCollaborationRequests(status);
        if (response.success) {
          setCollaborationRequests(response.data || []);
        } else {
          showAlert('Failed to fetch collaboration requests', 'error');
        }
      } catch (error) {
        console.error('Error fetching collaboration requests:', error);
        showAlert('Error fetching collaboration requests', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [selectedFilter, showAlert]);

  const handleApprove = async (requestId) => {
    try {
      setIsSubmitting(true);
      const response = await api.respondToCollaborationRequest(requestId, 'accept');
      
      if (response.success) {
        showAlert('Request approved successfully!', 'success');
        // Refresh the list
        const status = selectedFilter === "all" ? null : selectedFilter;
        const refreshResponse = await api.getInstructorCollaborationRequests(status);
        if (refreshResponse.success) {
          setCollaborationRequests(refreshResponse.data || []);
        }
      } else {
        showAlert(response.message || 'Failed to approve request', 'error');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      showAlert(error.message || 'Failed to approve request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    if (!rejectReason.trim()) {
      showAlert('Please provide a reason for rejection', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.respondToCollaborationRequest(
        selectedRequest._id, 
        'reject', 
        rejectReason
      );
      
      if (response.success) {
        showAlert('Request rejected successfully', 'success');
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedRequest(null);
        
        // Refresh the list
        const status = selectedFilter === "all" ? null : selectedFilter;
        const refreshResponse = await api.getInstructorCollaborationRequests(status);
        if (refreshResponse.success) {
          setCollaborationRequests(refreshResponse.data || []);
        }
      } else {
        showAlert(response.message || 'Failed to reject request', 'error');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      showAlert(error.message || 'Failed to reject request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRequests = collaborationRequests.filter((request) => {
    const gymName = request.gym?.gymName || '';
    const gymAddress = request.gym?.address?.street || request.gym?.gymAddress || '';
    const location = `${gymAddress}`.toLowerCase();
    
    const matchesSearch =
      gymName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.includes(searchTerm.toLowerCase());
    
    const matchesFilter =
      selectedFilter === "all" || request.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Gym Requests
          </h1>
          <p className="text-gray-400 mt-1">
            Review and manage gym join requests
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-4 top-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search gyms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 text-gray-400 rounded-lg hover:text-white transition-colors">
              <FiFilter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Gym Requests */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading collaboration requests...</p>
          </div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-gray-800/20 rounded-2xl border border-gray-700/30">
          <FiMessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-300 mb-2">No requests found</h3>
          <p className="text-gray-400">
            {selectedFilter === "all" 
              ? "You haven't received any collaboration requests from gym owners yet." 
              : `No ${selectedFilter} requests found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRequests.map((request) => {
            const gym = request.gym || {};
            const gymOwner = request.fromGymOwner || {};
            const gymName = gym.gymName || 'Unknown Gym';
            const gymImage = gym.logo?.url || gym.images?.[0]?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(gymName)}&background=8b5cf6&color=fff&size=300`;
            const gymAddress = gym.address?.street || gym.gymAddress?.street || gym.gymAddress || 'Address not available';
            const gymCity = gym.address?.city || gym.gymAddress?.city || '';
            const fullAddress = `${gymAddress}${gymCity ? ', ' + gymCity : ''}`;
            const facilities = gym.facilities || gym.amenities || [];
            const memberCount = gym.memberCount || 0;
            const instructorCount = gym.instructors?.length || 0;
            const contactInfo = gym.contactInfo || {};
            const gymEmail = contactInfo.email || gymOwner.email || 'N/A';
            const gymPhone = contactInfo.phone || 'N/A';
            const gymWebsite = contactInfo.website || '';

            return (
              <div
                key={request._id}
                className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-700">
                      <img
                        src={gymImage}
                        alt={gymName}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(gymName)}&background=8b5cf6&color=fff&size=300`;
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {gymName}
                      </h3>
                      <div className="flex items-center space-x-4">
                        {gym.rating && (
                          <>
                            <div className="flex items-center">
                              <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                              <span className="text-white">{gym.rating}</span>
                            </div>
                            <span className="text-gray-400">•</span>
                          </>
                        )}
                        <div className="flex items-center text-gray-400">
                          <FiMapPin className="w-4 h-4 mr-1" />
                          {fullAddress}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-400">
                        Request from: {gymOwner.firstName} {gymOwner.lastName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(request._id)}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Approve Request"
                        >
                          <FiCheck className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowRejectModal(true);
                          }}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Reject Request"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {request.status === 'accepted' && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                        Accepted
                      </span>
                    )}
                    {request.status === 'rejected' && (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium">
                        Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <FiUsers className="w-5 h-5 text-violet-400" />
                      <span className="text-xl font-bold text-white">
                        {memberCount}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">Members</span>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <FiActivity className="w-5 h-5 text-violet-400" />
                      <span className="text-xl font-bold text-white">
                        {instructorCount}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">Instructors</span>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <FiMail className="w-5 h-5 text-violet-400" />
                      <span className="text-sm font-bold text-white truncate">
                        {gymOwner.email}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">Gym Owner</span>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <FiClock className="w-5 h-5 text-violet-400" />
                      <span className="text-sm font-bold text-white">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">Request Date</span>
                  </div>
                </div>

                {/* Description & Message */}
                <div className="mt-6 space-y-4">
                  {gym.description && (
                    <div>
                      <h4 className="text-white font-medium mb-2">About the Gym</h4>
                      <p className="text-gray-400">{gym.description}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="text-white font-medium mb-2">Message from Gym Owner</h4>
                    <div className="p-4 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <FiMessageSquare className="w-4 h-4 text-violet-400 mr-2" />
                        <span className="text-gray-400">
                          From {gymOwner.firstName} {gymOwner.lastName}
                        </span>
                      </div>
                      <p className="text-gray-300">{request.message || 'No message provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Facilities */}
                {facilities.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-white font-medium mb-2">Facilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {facilities.slice(0, 10).map((facility, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm"
                        >
                          {facility}
                        </span>
                      ))}
                      {facilities.length > 10 && (
                        <span className="px-3 py-1 bg-gray-900/50 text-gray-300 rounded-full text-sm">
                          +{facilities.length - 10} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact */}
                {(gymEmail !== 'N/A' || gymPhone !== 'N/A' || gymWebsite) && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      {gymEmail !== 'N/A' && (
                        <div className="flex items-center text-gray-400">
                          <FiMail className="w-4 h-4 mr-2 text-violet-400" />
                          {gymEmail}
                        </div>
                      )}
                      {gymPhone !== 'N/A' && (
                        <div className="flex items-center text-gray-400">
                          <FiPhone className="w-4 h-4 mr-2 text-violet-400" />
                          {gymPhone}
                        </div>
                      )}
                      {gymWebsite && (
                        <div className="flex items-center text-gray-400">
                          <FiGlobe className="w-4 h-4 mr-2 text-violet-400" />
                          <a
                            href={gymWebsite.startsWith('http') ? gymWebsite : `https://${gymWebsite}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-violet-400 transition-colors"
                          >
                            {gymWebsite.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div
              className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason("");
                setSelectedRequest(null);
              }}
            ></div>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-2xl border border-gray-700 shadow-xl relative z-10">
              <h3 className="text-lg font-medium text-white mb-4">
                Reject Request from {selectedRequest.gym?.gymName || 'Gym'}
              </h3>

              <div className="mt-4">
                <label className="block text-gray-400 mb-2">
                  Reason for Rejection
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none resize-none"
                  rows="4"
                  placeholder="Please provide a reason for rejection..."
                ></textarea>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason("");
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectReason.trim() || isSubmitting}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                      <span>Rejecting...</span>
                    </>
                  ) : (
                    <>
                      <FiX className="w-5 h-5" />
                      <span>Reject Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyRejectGym;
