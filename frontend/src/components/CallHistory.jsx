import React, { useState, useEffect } from 'react';
import { FiPhone, FiPhoneCall, FiPhoneIncoming, FiPhoneOff, FiVideo, FiClock, FiSearch, FiTrash2 } from 'react-icons/fi';
import { MdCallMade, MdCallReceived, MdCallMissed } from 'react-icons/md';

const CallHistory = ({ userId }) => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, incoming, outgoing, missed
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, callId: null });

  useEffect(() => {
    fetchCallHistory();
  }, [currentPage]);

  const fetchCallHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/calls/history?page=${currentPage}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch call history');
      }

      const data = await response.json();
      setCalls(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCall = async (callId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/calls/${callId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete call');
      }

      // Remove the call from the list
      setCalls(prev => prev.filter(call => call._id !== callId));
      setDeleteConfirm({ show: false, callId: null });

      // If this was the last call on the page and not the first page, go back one page
      if (calls.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        // Refresh the current page
        fetchCallHistory();
      }
    } catch (err) {
      console.error('Error deleting call:', err);
      alert('Failed to delete call');
    }
  };

  const getCallIcon = (call) => {
    const isOutgoing = call.caller._id === userId;
    const callType = call.callType;
    const status = call.status;

    if (status === 'missed') {
      return <MdCallMissed className="text-red-500" size={20} />;
    }

    if (callType === 'video') {
      return <FiVideo className={isOutgoing ? 'text-green-500' : 'text-blue-500'} size={20} />;
    }

    if (isOutgoing) {
      return <MdCallMade className="text-green-500" size={20} />;
    } else {
      return <MdCallReceived className="text-blue-500" size={20} />;
    }
  };

  const getCallDirection = (call) => {
    return call.caller._id === userId ? 'Outgoing' : 'Incoming';
  };

  const getOtherParticipant = (call) => {
    return call.caller._id === userId ? call.recipient : call.caller;
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return 'No answer';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ended':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'missed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredCalls = calls.filter(call => {
    const otherParticipant = getOtherParticipant(call);
    const name = `${otherParticipant.firstName} ${otherParticipant.lastName}`.toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase());

    if (filterType === 'all') return matchesSearch;
    if (filterType === 'incoming') return matchesSearch && call.caller._id !== userId;
    if (filterType === 'outgoing') return matchesSearch && call.caller._id === userId;
    if (filterType === 'missed') return matchesSearch && call.status === 'missed';

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error loading call history</div>
        <button 
          onClick={fetchCallHistory}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Call History</h2>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Calls</option>
            <option value="incoming">Incoming</option>
            <option value="outgoing">Outgoing</option>
            <option value="missed">Missed</option>
          </select>
        </div>
      </div>

      {/* Call List */}
      <div className="divide-y divide-gray-200">
        {filteredCalls.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiPhone className="mx-auto mb-3 text-4xl text-gray-300" />
            <p>No call history found</p>
          </div>
        ) : (
          filteredCalls.map((call) => {
            const otherParticipant = getOtherParticipant(call);
            return (
              <div key={call._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getCallIcon(call)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {otherParticipant.firstName} {otherParticipant.lastName}
                        </p>
                        <span className="text-xs text-gray-500">
                          ({getCallDirection(call)})
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-xs text-gray-500">
                          {formatDate(call.createdAt)} • {formatTime(call.createdAt)}
                        </p>
                        
                        <div className="flex items-center space-x-1">
                          <FiClock size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {formatDuration(call.duration)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(call.status)}`}>
                      {call.status}
                    </span>
                    
                    {call.callType === 'video' && (
                      <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        Video
                      </div>
                    )}
                    
                    <button
                      onClick={() => setDeleteConfirm({ show: true, callId: call._id })}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete call"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {filteredCalls.length} of {pagination.totalCalls} calls
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Delete Call Record?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this call from your history? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, callId: null })}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCall(deleteConfirm.callId)}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallHistory;