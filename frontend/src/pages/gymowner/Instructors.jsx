import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";
import api from "../../utils/api";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiCheck,
  FiX,
  FiUser,
  FiUsers,
  FiActivity,
  FiCalendar,
  FiStar,
  FiDollarSign,
  FiClock,
  FiArrowUp,
  FiArrowDown,
  FiMail,
} from "react-icons/fi";

function Instructors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [userGyms, setUserGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  // Calculate stats from real data
  const stats = [
    {
      title: "Total Instructors",
      value: instructors.length.toString(),
      change: "+12.5%",
      trend: "up",
      icon: FiUser,
      color: "violet",
      description: "Active instructors",
    },
    {
      title: "Active Instructors",
      value: instructors.filter(i => i.isActive).length.toString(),
      change: "+0.3",
      trend: "up",
      icon: FiStar,
      color: "emerald",
      description: "Currently active",
    },
    {
      title: "Specializations",
      value: new Set(instructors.map(i => i.specialization)).size.toString(),
      change: "+15.2%",
      trend: "up",
      icon: FiActivity,
      color: "blue",
      description: "Different specialties",
    },
    {
      title: "Avg. Experience",
      value: instructors.length > 0 ? Math.round(instructors.reduce((acc, i) => acc + (i.instructor?.experience || 0), 0) / instructors.length).toString() + 'y' : '0y',
      change: "+18.7%",
      trend: "up",
      icon: FiDollarSign,
      color: "amber",
      description: "Years experience",
    },
  ];

  // Fetch user gyms on component mount
  useEffect(() => {
    fetchUserGyms();
  }, []);

  // Fetch instructors when gym is selected
  useEffect(() => {
    if (selectedGym) {
      fetchInstructors();
    }
  }, [selectedGym]);

  const fetchUserGyms = async () => {
    try {
      const response = await api.getGymsByOwner();
      if (response.success) {
        setUserGyms(response.data);
        if (response.data.length > 0) {
          setSelectedGym(response.data[0]); // Select first gym by default
        }
      }
    } catch (error) {
      console.error('Error fetching gyms:', error);
      showAlert('Failed to fetch gyms', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    if (!selectedGym) return;
    
    try {
      setLoading(true);
      const response = await api.getGymInstructors(selectedGym._id);
      if (response.success) {
        setInstructors(response.data);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      showAlert('Failed to fetch instructors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInstructor = (instructor) => {
    setSelectedInstructor(instructor);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedInstructor || !selectedGym) return;
    
    try {
      await api.removeInstructorFromGym(selectedGym._id, selectedInstructor.instructor._id);
      showAlert('Instructor removed successfully!', 'success');
      await fetchInstructors(); // Refresh the list
    } catch (error) {
      console.error('Error removing instructor:', error);
      showAlert(error.message || 'Failed to remove instructor', 'error');
    } finally {
      setShowDeleteModal(false);
      setSelectedInstructor(null);
    }
  };

  // Filter instructors based on search and filter
  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = instructor.instructor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.instructor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.instructor?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'active' && instructor.isActive) ||
                         (selectedFilter === 'inactive' && !instructor.isActive);
    
    return matchesSearch && matchesFilter;
  });

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
            Instructors
          </h1>
          <p className="text-gray-400 mt-1">Manage your gym's instructors</p>
        </div>
        <div className="flex items-center gap-4">
          {userGyms.length > 1 && (
            <select
              value={selectedGym?._id || ''}
              onChange={(e) => {
                const gym = userGyms.find(g => g._id === e.target.value);
                setSelectedGym(gym);
              }}
              className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:outline-none"
            >
              {userGyms.map(gym => (
                <option key={gym._id} value={gym._id}>
                  {gym.gymName}
                </option>
              ))}
            </select>
          )}
          <Link
            to="/gym-owner/addInstructor"
            className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Add Instructor
          </Link>
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
                placeholder="Search instructors..."
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
              <option value="all">All Instructors</option>
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

      {/* Instructors Table */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50">
        {filteredInstructors.length === 0 ? (
          <div className="text-center py-12">
            <FiUser className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Instructors Found</h3>
            <p className="text-gray-400 mb-4">
              {instructors.length === 0 
                ? "You haven't added any instructors yet." 
                : "No instructors match your search criteria."}
            </p>
            {instructors.length === 0 && (
              <Link
                to="/gym-owner/addInstructor"
                className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                Add Your First Instructor
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left py-4 px-6 text-gray-300 font-medium text-sm">Instructor</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium text-sm">Contact</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium text-sm">Specialization</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium text-sm">Experience</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium text-sm">Salary</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium text-sm">Joined</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium text-sm">Status</th>
                  <th className="text-center py-4 px-6 text-gray-300 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstructors.map((instructor, index) => (
                  <tr 
                    key={instructor._id} 
                    className={`border-b border-gray-700/30 hover:bg-gray-900/30 transition-colors ${
                      index % 2 === 0 ? 'bg-gray-900/10' : 'bg-transparent'
                    }`}
                  >
                    {/* Instructor Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${instructor.instructor?.firstName || 'Unknown'}+${instructor.instructor?.lastName || 'User'}&background=8b5cf6&color=fff&size=150`}
                          alt={`${instructor.instructor?.firstName || 'Unknown'} ${instructor.instructor?.lastName || 'User'}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-white font-medium">
                            {instructor.instructor?.firstName || 'Unknown'} {instructor.instructor?.lastName || 'User'}
                          </p>
                          {instructor.instructor?.phone && (
                            <p className="text-gray-400 text-sm">{instructor.instructor?.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6">
                      <p className="text-gray-400 text-sm">{instructor.instructor?.email || 'No email'}</p>
                    </td>

                    {/* Specialization */}
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm">
                        {instructor.specialization || 'General Fitness'}
                      </span>
                    </td>

                    {/* Experience */}
                    <td className="py-4 px-6">
                      <p className="text-gray-300">{instructor.instructor?.experience || 0} years</p>
                    </td>

                    {/* Salary */}
                    <td className="py-4 px-6">
                      <p className="text-gray-300">
                        {instructor.salary ? `$${instructor.salary}/month` : '-'}
                      </p>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-6">
                      <p className="text-gray-400 text-sm">
                        {new Date(instructor.addedAt).toLocaleDateString()}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          instructor.isActive
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {instructor.isActive ? (
                          <FiCheck className="w-4 h-4 inline mr-1" />
                        ) : (
                          <FiX className="w-4 h-4 inline mr-1" />
                        )}
                        {instructor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center space-x-2">
                        <Link
                          to={`/gym-owner/instructors/${instructor._id}/edit`}
                          className="p-2 text-gray-400 hover:text-violet-400 transition-colors"
                          title="Edit Instructor"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteInstructor(instructor)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="Remove Instructor"
                        >
                          <FiTrash2 className="w-4 h-4" />
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
                Delete Instructor
              </h3>

              <p className="text-gray-400 mb-6">
                Are you sure you want to remove {selectedInstructor?.instructor?.firstName} {selectedInstructor?.instructor?.lastName} from your gym? This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  Delete Instructor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Instructors;
