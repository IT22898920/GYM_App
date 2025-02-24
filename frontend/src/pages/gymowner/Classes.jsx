import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiCheck,
  FiX,
  FiActivity,
  FiDollarSign,
  FiClock,
  FiUser,
  FiMapPin,
  FiUsers,
  FiArrowUp,
  FiArrowDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiPlus,
} from "react-icons/fi";

function Classes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    price: "",
  });

  // Sample data for demonstration
  const classTypes = [
    "Yoga",
    "HIIT",
    "Strength Training",
    "Pilates",
    "CrossFit",
    "Zumba",
    "Boxing",
    "Spinning",
  ];

  const stats = [
    {
      title: "Total Classes",
      value: "86",
      change: "+12.5%",
      trend: "up",
      icon: FiActivity,
      color: "violet",
      description: "Active classes",
    },
    {
      title: "Total Students",
      value: "543",
      change: "+23.4%",
      trend: "up",
      icon: FiUsers,
      color: "emerald",
      description: "Enrolled students",
    },
    {
      title: "Class Revenue",
      value: "$12.4K",
      change: "+15.2%",
      trend: "up",
      icon: FiDollarSign,
      color: "blue",
      description: "This month",
    },
    {
      title: "Avg. Attendance",
      value: "92%",
      change: "+8.7%",
      trend: "up",
      icon: FiCalendar,
      color: "amber",
      description: "Class attendance",
    },
  ];

  // Sample data for classes
  const classes = [
    {
      id: 1,
      name: "Morning Yoga Flow",
      instructor: {
        name: "Sarah Johnson",
        image: "https://i.pravatar.cc/150?img=1",
        rating: 4.9,
      },
      type: "Yoga",
      schedule: {
        days: ["Monday", "Wednesday", "Friday"],
      },
      enrolled: 12,
      price: 25,
      status: "active",
      nextSession: "2024-03-10 07:00",
      description:
        "Start your day with energizing yoga poses and mindful breathing.",
    },
    {
      id: 2,
      name: "HIIT Blast",
      instructor: {
        name: "Mike Chen",
        image: "https://i.pravatar.cc/150?img=2",
        rating: 4.8,
      },
      type: "HIIT",
      schedule: {
        days: ["Tuesday", "Thursday"],
      },
      enrolled: 18,
      price: 30,
      status: "active",
      nextSession: "2024-03-11 18:00",
      description: "High-intensity interval training for maximum calorie burn.",
    },
    {
      id: 3,
      name: "Strength Basics",
      instructor: {
        name: "Emma Rodriguez",
        image: "https://i.pravatar.cc/150?img=3",
        rating: 4.7,
      },
      type: "Strength Training",
      schedule: {
        days: ["Monday", "Wednesday", "Friday"],
      },
      enrolled: 8,
      price: 28,
      status: "inactive",
      nextSession: null,
      description: "Foundation strength training for beginners.",
    },
  ];

  // Generate more sample data for pagination demonstration
  const generateClasses = () => {
    return Array.from({ length: 50 }, (_, index) => {
      const baseClass = classes[index % classes.length];
      return {
        ...baseClass,
        id: index + 1,
        name: `${baseClass.name} ${Math.floor(index / classes.length) + 1}`,
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    setShowCreateModal(false);
    setFormData({
      name: "",
      description: "",
      type: "",
      price: "",
    });
  };

  const allClasses = generateClasses();

  const handleDeleteClass = (classItem) => {
    setSelectedClass(classItem);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Handle delete logic here
    console.log("Deleting class:", selectedClass.id);
    setShowDeleteModal(false);
    setSelectedClass(null);
  };

  // Filtering and pagination
  const filteredClasses = allClasses.filter((classItem) => {
    const matchesSearch =
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.instructor.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || classItem.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalItems = filteredClasses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClasses = filteredClasses.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Classes
          </h1>
          <p className="text-gray-400 mt-1">Manage your gym's classes</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "table"
                  ? "bg-violet-600 text-white"
                  : "bg-gray-800/40 text-gray-400 hover:text-white"
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-violet-600 text-white"
                  : "bg-gray-800/40 text-gray-400 hover:text-white"
              }`}
            >
              Grid View
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowCreateModal(true)}
        className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
      >
        <FiPlus className="w-5 h-5 mr-2" />
        Create New Class
      </button>

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
                placeholder="Search classes..."
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
              <option value="all">All Classes</option>
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

      {viewMode === "table" ? (
        /* Classes Table */
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left p-4 text-gray-400 font-medium">
                    Class
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    Instructor
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    Schedule
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    Price
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
                {currentClasses.map((classItem) => (
                  <tr
                    key={classItem.id}
                    className="hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                          <FiActivity className="h-5 w-5 text-violet-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {classItem.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {classItem.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={classItem.instructor.image}
                          alt={classItem.instructor.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-gray-300">
                            {classItem.instructor.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            Rating: {classItem.instructor.rating}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-300">
                        {classItem.schedule.days.join(", ")}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500 rounded-full"
                            style={{
                              width: `${
                                (classItem.enrolled / classItem.capacity) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {classItem.enrolled}/{classItem.capacity}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-300">${classItem.price}</div>
                      <div className="text-sm text-gray-400">per class</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          classItem.status === "active"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {classItem.status === "active" ? (
                          <FiCheck className="w-4 h-4 mr-1" />
                        ) : (
                          <FiX className="w-4 h-4 mr-1" />
                        )}
                        {classItem.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleDeleteClass(classItem)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                        <Link
                          to={`/gym-owner/classes/${classItem.id}/edit`}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                          <FiMoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
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
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
                {totalItems} entries
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
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and one page before and after current page
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
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
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span key={pageNumber} className="text-gray-600">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronsRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Classes Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-violet-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {classItem.name}
                  </h3>
                  <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm">
                    {classItem.type}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteClass(classItem)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                  <Link
                    to={`/gym-owner/classes/${classItem.id}/edit`}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={classItem.instructor.image}
                  alt={classItem.instructor.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-gray-300">
                    {classItem.instructor.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    Rating: {classItem.instructor.rating}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-400">
                  <FiCalendar className="w-4 h-4 mr-2 text-violet-400" />
                  {classItem.schedule.days.join(", ")}
                </div>
                <div className="flex items-center text-gray-400">
                  <FiDollarSign className="w-4 h-4 mr-2 text-violet-400" />$
                  {classItem.price} per class
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Enrollment</span>
                  <span>
                    {classItem.enrolled}/{classItem.capacity}
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full"
                    style={{
                      width: `${
                        (classItem.enrolled / classItem.capacity) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    classItem.status === "active"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {classItem.status === "active" ? (
                    <FiCheck className="w-4 h-4 mr-1" />
                  ) : (
                    <FiX className="w-4 h-4 mr-1" />
                  )}
                  {classItem.status}
                </span>
                <Link
                  to={`/gym-owner/classes/${classItem.id}`}
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

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
                Delete Class
              </h3>

              <p className="text-gray-400 mb-6">
                Are you sure you want to delete {selectedClass?.name}? This
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
                  Delete Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Create/Edit Class Modal */}
      {(showCreateModal || selectedClass) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Modal Header */}
              <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
                <h3 className="text-2xl font-bold text-white">
                  {selectedClass ? "Edit Class" : "Create New Class"}
                </h3>
              </div>

              {/* Modal Content */}
              <div className="bg-gray-800 px-6 py-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Class Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                      placeholder="e.g., Morning Yoga Flow"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                      placeholder="Describe your class..."
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Class Type
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                      >
                        <option value="">Select type</option>
                        {classTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                        placeholder="25"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedClass(null);
                    setFormData({
                      name: "",
                      description: "",
                      type: "",
                      price: "",
                      capacity: "",
                    });
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  {selectedClass ? "Save Changes" : "Create Class"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Classes;
