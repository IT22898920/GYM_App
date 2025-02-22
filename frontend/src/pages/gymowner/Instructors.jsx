import { useState } from "react";
import { Link } from "react-router-dom";
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

  const stats = [
    {
      title: "Total Instructors",
      value: "24",
      change: "+12.5%",
      trend: "up",
      icon: FiUser,
      color: "violet",
      description: "Active instructors",
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.3",
      trend: "up",
      icon: FiStar,
      color: "emerald",
      description: "Instructor ratings",
    },
    {
      title: "Classes Taught",
      value: "186",
      change: "+15.2%",
      trend: "up",
      icon: FiActivity,
      color: "blue",
      description: "This month",
    },
    {
      title: "Avg. Earnings",
      value: "$2.8K",
      change: "+18.7%",
      trend: "up",
      icon: FiDollarSign,
      color: "amber",
      description: "Per instructor",
    },
  ];

  // Sample data for instructors
  const instructors = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      specialization: "Yoga",
      rating: 4.9,
      classesCount: 156,
      joinDate: "2024-02-15",
      status: "active",
      image: "https://i.pravatar.cc/150?img=1",
      availability: ["Morning", "Evening"],
      nextClass: "2024-03-10 09:00 AM",
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike@example.com",
      specialization: "Strength Training",
      rating: 4.8,
      classesCount: 142,
      joinDate: "2024-02-01",
      status: "active",
      image: "https://i.pravatar.cc/150?img=2",
      availability: ["Afternoon", "Evening"],
      nextClass: "2024-03-10 02:00 PM",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      email: "emma@example.com",
      specialization: "HIIT",
      rating: 4.7,
      classesCount: 98,
      joinDate: "2024-02-20",
      status: "inactive",
      image: "https://i.pravatar.cc/150?img=3",
      availability: ["Morning"],
      nextClass: null,
    },
  ];

  const handleDeleteInstructor = (instructor) => {
    setSelectedInstructor(instructor);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Handle delete logic here
    console.log("Deleting instructor:", selectedInstructor.id);
    setShowDeleteModal(false);
    setSelectedInstructor(null);
  };

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
        <Link
          to="/gym-owner/addInstructor"
          className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Add Instructor
        </Link>
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

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((instructor) => (
          <div
            key={instructor.id}
            className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-violet-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {instructor.name}
                  </h3>
                  <p className="text-violet-400">{instructor.specialization}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDeleteInstructor(instructor)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
                <Link
                  to={`/gym-owner/instructors/${instructor.id}/edit`}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <FiEdit2 className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-yellow-400">
                  <FiStar className="w-4 h-4 mr-1" />
                  <span className="text-white">{instructor.rating}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    instructor.status === "active"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {instructor.status === "active" ? (
                    <FiCheck className="w-4 h-4 inline mr-1" />
                  ) : (
                    <FiX className="w-4 h-4 inline mr-1" />
                  )}
                  {instructor.status}
                </span>
              </div>

              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <FiMail className="w-4 h-4 mr-2 text-violet-400" />
                  {instructor.email}
                </div>
                <div className="flex items-center">
                  <FiActivity className="w-4 h-4 mr-2 text-violet-400" />
                  {instructor.classesCount} classes taught
                </div>
                <div className="flex items-center">
                  <FiCalendar className="w-4 h-4 mr-2 text-violet-400" />
                  Joined {new Date(instructor.joinDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <FiClock className="w-4 h-4 mr-2 text-violet-400" />
                  {instructor.nextClass
                    ? `Next class: ${instructor.nextClass}`
                    : "No upcoming classes"}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {instructor.availability.map((time, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
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
                Are you sure you want to delete {selectedInstructor?.name}? This
                action cannot be undone.
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
