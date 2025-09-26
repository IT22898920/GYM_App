import { useState, useEffect } from "react";
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiMoreVertical,
  FiActivity,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
  FiUser,
  FiTarget,
  FiHeart,
  FiMail,
  FiPhone,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiEye,
} from "react-icons/fi";

function AssignedMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMembers: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Fetch members when component mounts or filters change
  useEffect(() => {
    fetchAssignedMembers();
  }, [currentPage, searchTerm, selectedStatus]);

  const fetchAssignedMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: selectedStatus
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/instructors/assigned-members?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assigned members');
      }

      const data = await response.json();
      setMembers(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching assigned members:', error);
      // You could use an alert context here to show error messages
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleViewMeasurements = (member) => {
    setSelectedMember(member);
    setShowMeasurementsModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-violet-500/10">
              <FiUsers className="h-6 w-6 text-violet-400" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{pagination.totalMembers}</div>
              <div className="text-sm text-gray-400">Assigned Members</div>
            </div>
          </div>
          <div className="text-gray-500 text-sm">Total assigned to you</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-emerald-500/10">
              <FiActivity className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">92%</div>
              <div className="text-sm text-gray-400">Avg Progress</div>
            </div>
          </div>
          <div className="text-gray-500 text-sm">Goal achievement rate</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <FiClock className="h-6 w-6 text-blue-400" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">87%</div>
              <div className="text-sm text-gray-400">Attendance</div>
            </div>
          </div>
          <div className="text-gray-500 text-sm">Average attendance rate</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-amber-500/10">
              <FiHeart className="h-6 w-6 text-amber-400" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">95%</div>
              <div className="text-sm text-gray-400">Retention</div>
            </div>
          </div>
          <div className="text-gray-500 text-sm">Member retention rate</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="p-4 text-left text-gray-300 font-medium">Member</th>
                <th className="p-4 text-left text-gray-300 font-medium">Contact</th>
                <th className="p-4 text-left text-gray-300 font-medium">Status</th>
                <th className="p-4 text-left text-gray-300 font-medium">Progress</th>
                <th className="p-4 text-left text-gray-300 font-medium">Gym</th>
                <th className="p-4 text-left text-gray-300 font-medium">Join Date</th>
                <th className="p-4 text-left text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {members.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">
                    No assigned members found
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-700/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                          <FiUser className="h-5 w-5 text-violet-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-gray-400">
                            #{member._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <FiMail className="h-4 w-4" />
                          <span>{member.email}</span>
                        </div>
                        {member.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <FiPhone className="h-4 w-4" />
                            <span>{member.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span 
                        className={`px-3 py-1 rounded-full text-sm ${
                          member.status === 'active' 
                            ? 'bg-green-500/10 text-green-400'
                            : member.status === 'inactive'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500 rounded-full"
                            style={{ width: `${member.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {member.progress || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <FiMapPin className="h-4 w-4" />
                        <span>{member.gym?.gymName || 'Unknown Gym'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      {new Date(member.joinDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewMeasurements(member)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                          title="More actions"
                        >
                          <FiMoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700/50">
            <div className="text-sm text-gray-400">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, pagination.totalMembers)} to {Math.min(currentPage * itemsPerPage, pagination.totalMembers)} of {pagination.totalMembers} members
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-gray-700/50 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                <FiChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="p-2 rounded-lg bg-gray-700/50 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              
              <span className="px-4 py-2 text-sm text-gray-300">
                Page {currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="p-2 rounded-lg bg-gray-700/50 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={currentPage === pagination.totalPages}
                className="p-2 rounded-lg bg-gray-700/50 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                <FiChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Measurements Modal */}
      {showMeasurementsModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                Member Details - {selectedMember.firstName} {selectedMember.lastName}
              </h3>
              <button
                onClick={() => setShowMeasurementsModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiEdit2 className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="text-lg font-semibold text-gray-300 mb-3">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <div className="text-white">{selectedMember.email}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Phone:</span>
                    <div className="text-white">{selectedMember.phoneNumber}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Gender:</span>
                    <div className="text-white capitalize">{selectedMember.gender}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Join Date:</span>
                    <div className="text-white">
                      {new Date(selectedMember.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Body Measurements */}
              {selectedMember.bodyMeasurements && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-300 mb-3">Body Measurements</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Height:</span>
                      <div className="text-white">{selectedMember.bodyMeasurements.height} cm</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Weight:</span>
                      <div className="text-white">{selectedMember.bodyMeasurements.weight} kg</div>
                    </div>
                    {selectedMember.bodyMeasurements.bmi && (
                      <div>
                        <span className="text-gray-400">BMI:</span>
                        <div className="text-white">{selectedMember.bodyMeasurements.bmi}</div>
                      </div>
                    )}
                    {selectedMember.bodyMeasurements.waist && (
                      <div>
                        <span className="text-gray-400">Waist:</span>
                        <div className="text-white">{selectedMember.bodyMeasurements.waist} cm</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fitness Goals */}
              {selectedMember.fitnessGoals && selectedMember.fitnessGoals.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-300 mb-3">Fitness Goals</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.fitnessGoals.map((goal, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm"
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress */}
              <div>
                <h4 className="text-lg font-semibold text-gray-300 mb-3">Progress</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full"
                        style={{ width: `${selectedMember.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-gray-300">{selectedMember.progress || 0}%</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowMeasurementsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignedMembers;
