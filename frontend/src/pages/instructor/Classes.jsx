import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiX,
  FiCheck,
  FiFilter,
  FiActivity,
  FiMapPin,
  FiArrowUp,
} from "react-icons/fi";

function Classes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    date: "",
    time: "",
    duration: "",
    price: "",
    capacity: "",
    location: "",
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
      value: "24",
      change: "+12.5%",
      trend: "up",
      icon: FiCalendar,
      color: "violet",
      description: "Active classes",
    },
    {
      title: "Total Students",
      value: "156",
      change: "+23.4%",
      trend: "up",
      icon: FiUsers,
      color: "emerald",
      description: "Enrolled students",
    },
    {
      title: "Revenue",
      value: "$4,578",
      change: "+15.2%",
      trend: "up",
      icon: FiDollarSign,
      color: "blue",
      description: "This month",
    },
    {
      title: "Completion Rate",
      value: "92%",
      change: "+18.7%",
      trend: "up",
      icon: FiActivity,
      color: "amber",
      description: "Class completion",
    },
  ];

  const classes = [
    {
      id: 1,
      name: "Morning Yoga Flow",
      type: "Yoga",
      date: "2024-03-15",
      time: "07:00",
      duration: "60",
      price: 25,
      capacity: 15,
      enrolled: 8,
      location: "Studio A",
      status: "upcoming",
      description:
        "Start your day with energizing yoga poses and mindful breathing.",
    },
    {
      id: 2,
      name: "HIIT Blast",
      type: "HIIT",
      date: "2024-03-15",
      time: "18:00",
      duration: "45",
      price: 30,
      capacity: 20,
      enrolled: 15,
      location: "Main Floor",
      status: "active",
      description: "High-intensity interval training for maximum calorie burn.",
    },
    {
      id: 3,
      name: "Strength Basics",
      type: "Strength Training",
      date: "2024-03-14",
      time: "10:00",
      duration: "50",
      price: 28,
      capacity: 12,
      enrolled: 12,
      location: "Weight Room",
      status: "completed",
      description: "Foundation strength training for beginners.",
    },
  ];

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
      date: "",
      time: "",
      duration: "",
      price: "",
      capacity: "",
      location: "",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-violet-500/10 text-violet-400";
      case "active":
        return "bg-green-500/10 text-green-400";
      case "completed":
        return "bg-blue-500/10 text-blue-400";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            My Classes
          </h1>
          <p className="text-gray-400 mt-1">Manage your classes and schedule</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Create New Class
        </button>
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
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 text-gray-400 rounded-lg hover:text-white transition-colors">
              <FiFilter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-violet-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {cls.name}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    cls.status
                  )}`}
                >
                  {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedClass(cls)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-gray-400">
                <FiCalendar className="w-4 h-4 mr-2 text-violet-400" />
                {new Date(cls.date).toLocaleDateString()} at {cls.time}
              </div>
              <div className="flex items-center text-gray-400">
                <FiClock className="w-4 h-4 mr-2 text-violet-400" />
                {cls.duration} minutes
              </div>
              <div className="flex items-center text-gray-400">
                <FiMapPin className="w-4 h-4 mr-2 text-violet-400" />
                {cls.location}
              </div>
              <div className="flex items-center text-gray-400">
                <FiDollarSign className="w-4 h-4 mr-2 text-violet-400" />$
                {cls.price} per person
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Enrollment</span>
                <span>
                  {cls.enrolled}/{cls.capacity}
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full"
                  style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }}
                ></div>
              </div>
            </div>

            <button className="mt-4 w-full bg-violet-600/20 text-violet-400 py-2 rounded-lg hover:bg-violet-600/30 transition-colors">
              View Details
            </button>
          </div>
        ))}
      </div>

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
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                        placeholder="e.g., Studio A"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Time</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Duration (min)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                        placeholder="60"
                      />
                    </div>
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
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Capacity
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                        placeholder="15"
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
                      date: "",
                      time: "",
                      duration: "",
                      price: "",
                      capacity: "",
                      location: "",
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
