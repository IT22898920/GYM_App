import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiCheck,
  FiX,
  FiActivity,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiAward,
  FiMessageSquare,
  FiRefreshCw,
  FiFilter,
  FiSearch,
} from "react-icons/fi";
import { useAlert } from "../../contexts/AlertContext";
import api from "../../utils/api";

function VerifyRejectGym() {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const { showAlert } = useAlert();

  // Fetch gym requests
  const fetchRequests = async (status = null) => {
    try {
      setLoading(true);
      const response = await api.getGymRequests(status);
      
      if (response.success) {
        setRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching gym requests:', error);
      showAlert('Failed to fetch gym requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRequests(selectedFilter === 'all' ? null : selectedFilter);
  }, [selectedFilter]);

  // Handle approve request
  const handleApprove = async () => {
    if (!selectedRequest) return;

    try {
      setProcessing(true);
      const response = await api.approveGymRequest(selectedRequest._id, responseMessage);
      
      if (response.success) {
        showAlert('Gym request approved successfully!', 'success');
        setShowApproveModal(false);
        setResponseMessage("");
        setSelectedRequest(null);
        // Refresh the list
        fetchRequests(selectedFilter === 'all' ? null : selectedFilter);
      }
    } catch (error) {
      console.error('Error approving request:', error);
      showAlert(error.message || 'Failed to approve request', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // Handle reject request
  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      setProcessing(true);
      const response = await api.rejectGymRequest(selectedRequest._id, responseMessage);
      
      if (response.success) {
        showAlert('Gym request rejected', 'success');
        setShowRejectModal(false);
        setResponseMessage("");
        setSelectedRequest(null);
        // Refresh the list
        fetchRequests(selectedFilter === 'all' ? null : selectedFilter);
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      showAlert(error.message || 'Failed to reject request', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // Filter requests based on search term
  const filteredRequests = requests.filter(request =>
    request.fromInstructor?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.fromInstructor?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.fromInstructor?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.toGym?.gymName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Pending' },
      approved: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Approved' },
      rejected: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Rejected' },
      cancelled: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Gym Requests
          </h1>
          <p className="text-gray-400 mt-1">
            Review and manage instructor requests to join your gyms
          </p>
        </div>
        
        <button
          onClick={() => fetchRequests(selectedFilter === 'all' ? null : selectedFilter)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-violet-500/10 text-violet-400 rounded-lg hover:bg-violet-500/20 transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-4 top-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by instructor name, email, or gym..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
              <option value="all">All Requests</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
          <span className="ml-3 text-gray-400">Loading gym requests...</span>
        </div>
      )}

      {/* Requests List */}
      {!loading && (
        <div className="space-y-6">
          {filteredRequests.length === 0 ? (
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 text-center">
              <FiUser className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No gym requests found</h3>
              <p className="text-gray-400">
                {searchTerm ? 'Try adjusting your search criteria.' : 'No instructors have requested to join your gyms yet.'}
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request._id}
                className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                      {request.fromInstructor?.firstName?.charAt(0)}
                      {request.fromInstructor?.lastName?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {request.fromInstructor?.firstName} {request.fromInstructor?.lastName}
                      </h3>
                      <p className="text-violet-400 font-medium mb-1">
                        {request.instructorDetails?.specialization || 'Instructor'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Wants to join: <span className="text-white font-medium">{request.toGym?.gymName}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(request.status)}
                    {request.status === 'pending' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowApproveModal(true);
                          }}
                          className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors flex items-center gap-2"
                        >
                          <FiCheck className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowRejectModal(true);
                          }}
                          className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
                        >
                          <FiX className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-400">
                      <FiMail className="w-4 h-4 mr-3 text-violet-400" />
                      {request.fromInstructor?.email}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <FiCalendar className="w-4 h-4 mr-3 text-violet-400" />
                      Applied on {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                    {request.instructorDetails?.experience && (
                      <div className="flex items-center text-gray-400">
                        <FiAward className="w-4 h-4 mr-3 text-violet-400" />
                        {request.instructorDetails.experience} years experience
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-400">
                      <FiMapPin className="w-4 h-4 mr-3 text-violet-400" />
                      {request.toGym?.gymAddress || 'Gym Location'}
                    </div>
                    {request.instructorDetails?.isFreelance !== undefined && (
                      <div className="flex items-center text-gray-400">
                        <FiDollarSign className="w-4 h-4 mr-3 text-violet-400" />
                        {request.instructorDetails.isFreelance ? 'Freelance' : 'Full-time'}
                      </div>
                    )}
                    {request.respondedAt && (
                      <div className="flex items-center text-gray-400">
                        <FiClock className="w-4 h-4 mr-3 text-violet-400" />
                        Responded on {new Date(request.respondedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="bg-gray-900/30 rounded-lg p-4 mb-4">
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    <FiMessageSquare className="w-4 h-4 text-violet-400" />
                    Request Message
                  </h4>
                  <p className="text-gray-400">{request.message}</p>
                </div>

                {/* Response Message */}
                {request.responseMessage && (
                  <div className="bg-gray-900/30 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Your Response</h4>
                    <p className="text-gray-400">{request.responseMessage}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
              <h3 className="text-lg font-medium text-white mb-4">
                Approve Gym Request
              </h3>
              
              <p className="text-gray-400 mb-4">
                You're about to approve {selectedRequest.fromInstructor?.firstName} {selectedRequest.fromInstructor?.lastName}'s request to join {selectedRequest.toGym?.gymName}.
              </p>

              <div className="mt-4">
                <label className="block text-gray-400 mb-2">
                  Welcome Message (Optional)
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  rows="3"
                  placeholder="Welcome to our team! We're excited to work with you..."
                />
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowApproveModal(false);
                    setResponseMessage("");
                    setSelectedRequest(null);
                  }}
                  disabled={processing}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-400"></div>
                      Approving...
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4" />
                      Approve Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
              <h3 className="text-lg font-medium text-white mb-4">
                Reject Gym Request
              </h3>
              
              <p className="text-gray-400 mb-4">
                You're about to reject {selectedRequest.fromInstructor?.firstName} {selectedRequest.fromInstructor?.lastName}'s request to join {selectedRequest.toGym?.gymName}.
              </p>

              <div className="mt-4">
                <label className="block text-gray-400 mb-2">
                  Reason for Rejection (Optional)
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  rows="3"
                  placeholder="We appreciate your interest, but we're looking for instructors with different specializations at this time..."
                />
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setResponseMessage("");
                    setSelectedRequest(null);
                  }}
                  disabled={processing}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-400"></div>
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <FiX className="w-4 h-4" />
                      Reject Request
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