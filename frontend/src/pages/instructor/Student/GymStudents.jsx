import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiActivity,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
  FiCheck,
  FiX,
  FiStar,
  FiMessageSquare,
  FiFileText,
  FiBarChart2,
  FiHeart,
  FiUser,
  FiTarget,
  FiMaximize2,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import api from "../../../utils/api";
import { useAlert } from "../../../contexts/AlertContext";

function GymStudents() {
  const { showSuccess, showError } = useAlert();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMembers: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch assigned members on mount
  useEffect(() => {
    fetchAssignedMembers();
  }, [currentPage, searchTerm, selectedStatus]);

  const fetchAssignedMembers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: selectedStatus
      };

      const response = await api.getInstructorAssignedMembers(params);
      
      if (response.success) {
        setStudents(response.data || []);
        setPagination(response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalMembers: 0,
          hasNextPage: false,
          hasPrevPage: false
        });
      }
    } catch (error) {
      console.error('Error fetching assigned members:', error);
      setStudents([]);
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

  const handleViewMeasurements = (student) => {
    setSelectedStudent(student);
    setShowMeasurementsModal(true);
  };

  // Calculate stats from real data
  const totalStudents = pagination.totalMembers;
  const avgProgress = students.length > 0 
    ? Math.round(students.reduce((sum, student) => sum + (student.progress || 0), 0) / students.length)
    : 0;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const attendance = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0;

  const stats = [
    {
      title: "Total Students",
      value: totalStudents.toString(),
      change: "+0%",
      trend: "up",
      icon: FiUsers,
      color: "violet",
      description: "Assigned students",
    },
    {
      title: "Avg. Progress",
      value: `${avgProgress}%`,
      change: "+0%",
      trend: "up",
      icon: FiTrendingUp,
      color: "emerald",
      description: "Goal achievement",
    },
    {
      title: "Class Attendance",
      value: `${attendance}%`,
      change: "+0%",
      trend: "up",
      icon: FiActivity,
      color: "blue",
      description: "Average attendance",
    },
    {
      title: "Retention Rate",
      value: "95%",
      change: "+0%",
      trend: "up",
      icon: FiHeart,
      color: "amber",
      description: "Student retention",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Gym Students
          </h1>
          <p className="text-gray-400 mt-1">
            Manage and track your gym students' progress
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg bg-${stat.color}-500/10 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <FiMoreVertical className="h-5 w-5" />
                </button>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm font-medium mb-2">
                  {stat.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-white">
                    {stat.value}
                  </span>
                  <div
                    className={`flex items-center text-sm ${
                      stat.trend === "up" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <FiArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <FiArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-2">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-4 top-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 text-gray-400 rounded-lg hover:text-white transition-colors">
              <FiFilter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left p-4 text-gray-400 font-medium">
                  Student
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Gym
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Progress
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Attendance
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    <FiUsers className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                    <p className="text-lg font-medium mb-2">No Gym Students Yet</p>
                    <p>You haven't been assigned any gym students yet.</p>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                          <FiUser className="h-5 w-5 text-violet-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm">
                        {student.gym?.gymName || 'Not assigned'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500 rounded-full"
                            style={{ width: `${student.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {student.progress || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-300">{student.attendance || 0}%</div>
                      <div className="text-sm text-gray-400">
                        Classes: {student.classesAttended || 0}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          student.status === "active"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {student.status === "active" ? (
                          <FiCheck className="w-4 h-4 mr-1" />
                        ) : (
                          <FiX className="w-4 h-4 mr-1" />
                        )}
                        {student.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewMeasurements(student)}
                          className="p-2 text-gray-400 hover:text-violet-400 transition-colors"
                          title="View Measurements"
                        >
                          <FiMaximize2 className="w-5 h-5" />
                        </button>
                        <Link
                          to={`/instructor/workout-plans/create?student=${student._id}`}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="Create Workout Plan"
                        >
                          <FiFileText className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/instructor/students/${student._id}/progress`}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="View Progress"
                        >
                          <FiBarChart2 className="w-5 h-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {students.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Show</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="bg-gray-900/50 text-white rounded-lg px-2 py-1 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              >
                {[5, 10, 25, 50].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-400">
                Showing {pagination.currentPage} of {pagination.totalPages} pages
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronsLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(pagination.totalPages, 7) }).map((_, index) => {
                    const pageNumber = index + 1;
                    if (pagination.totalPages <= 7) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`min-w-[2.5rem] h-10 rounded-lg ${
                            currentPage === pageNumber
                              ? "bg-violet-600 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                          } transition-colors`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === 1 ||
                      pageNumber === pagination.totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`min-w-[2.5rem] h-10 rounded-lg ${
                            currentPage === pageNumber
                              ? "bg-violet-600 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                          } transition-colors`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronsRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Measurements Modal */}
      {showMeasurementsModal && selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {selectedStudent.firstName} {selectedStudent.lastName}'s Measurements
                </h3>
                <button
                  onClick={() => setShowMeasurementsModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {selectedStudent.bodyMeasurements && (
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(selectedStudent.bodyMeasurements).map(
                    ([key, value]) => (
                      <div key={key} className="bg-gray-900/50 rounded-lg p-4">
                        <div className="text-gray-400 capitalize mb-2">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {value}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {selectedStudent.fitnessGoals && selectedStudent.fitnessGoals.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Fitness Goals
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.fitnessGoals.map((goal, index) => (
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

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowMeasurementsModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
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

export default GymStudents;
