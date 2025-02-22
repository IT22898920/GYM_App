import { useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiCheck,
  FiX,
  FiFilter,
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiCalendar,
  FiArrowUp,
  FiArrowDown,
  FiEye,
  FiX as FiClose,
  FiMail,
  FiPhone,
  FiCalendar as FiJoinDate,
  FiStar,
  FiAward,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

function Instructors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Stats data
  const stats = [
    {
      title: "Total Instructors",
      value: "48",
      change: "+12.5%",
      trend: "up",
      icon: FiUsers,
      color: "violet",
      description: "Active instructors this month",
    },
    {
      title: "Average Earnings",
      value: "$2,845",
      change: "+23.4%",
      trend: "up",
      icon: FiDollarSign,
      color: "emerald",
      description: "Per instructor this month",
    },
    {
      title: "Total Classes",
      value: "186",
      change: "-5.2%",
      trend: "down",
      icon: FiActivity,
      color: "blue",
      description: "Classes scheduled this week",
    },
    {
      title: "Class Bookings",
      value: "432",
      change: "+18.7%",
      trend: "up",
      icon: FiCalendar,
      color: "amber",
      description: "Bookings in the last 7 days",
    },
  ];

  // Sample data - replace with actual data from your backend
  const instructors = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      specialization: "Yoga",
      status: "active",
      joinDate: "2024-01-15",
      classesCount: 24,
      rating: 4.8,
      image: "https://i.pravatar.cc/150?img=1",
      bio: "Certified yoga instructor with over 5 years of experience. Specializes in Vinyasa and Hatha yoga.",
      certifications: ["RYT 200", "Vinyasa Flow Certified", "Meditation Guide"],
      schedule: [
        { day: "Monday", time: "9:00 AM - 10:30 AM", class: "Morning Yoga" },
        { day: "Wednesday", time: "6:00 PM - 7:30 PM", class: "Power Yoga" },
        { day: "Friday", time: "8:00 AM - 9:30 AM", class: "Gentle Flow" },
      ],
      achievements: [
        "Instructor of the Month - January 2024",
        "100+ Classes Conducted",
        "Average Rating 4.8/5",
      ],
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah.smith@example.com",
      phone: "+1 (555) 234-5678",
      specialization: "HIIT",
      status: "active",
      joinDate: "2024-01-20",
      classesCount: 18,
      rating: 4.9,
      image: "https://i.pravatar.cc/150?img=2",
      bio: "Former professional athlete turned fitness instructor. Expert in high-intensity interval training.",
      certifications: ["NASM CPT", "HIIT Specialist", "Nutrition Coach"],
      schedule: [
        { day: "Tuesday", time: "7:00 AM - 8:00 AM", class: "Morning HIIT" },
        { day: "Thursday", time: "5:30 PM - 6:30 PM", class: "Cardio Blast" },
        {
          day: "Saturday",
          time: "10:00 AM - 11:00 AM",
          class: "Weekend Warriors",
        },
      ],
      achievements: [
        "Best New Instructor 2024",
        "Perfect Attendance Award",
        "Client Transformation Champion",
      ],
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.j@example.com",
      phone: "+1 (555) 345-6789",
      specialization: "Strength Training",
      status: "inactive",
      joinDate: "2024-02-01",
      classesCount: 12,
      rating: 4.7,
      image: "https://i.pravatar.cc/150?img=3",
      bio: "Passionate about helping others achieve their strength goals. Specializes in powerlifting and functional training.",
      certifications: ["CSCS", "Powerlifting Coach", "First Aid Certified"],
      schedule: [
        { day: "Monday", time: "4:00 PM - 5:30 PM", class: "Strength Basics" },
        {
          day: "Wednesday",
          time: "7:00 PM - 8:30 PM",
          class: "Advanced Lifting",
        },
        {
          day: "Saturday",
          time: "9:00 AM - 10:30 AM",
          class: "Functional Strength",
        },
      ],
      achievements: [
        "Powerlifting Competition Winner",
        "Most Improved Instructor",
        "Safety Excellence Award",
      ],
    },
  ];

  const specializations = [
    "All",
    "Yoga",
    "HIIT",
    "Strength Training",
    "Pilates",
    "CrossFit",
    "Zumba",
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Generate more sample data for pagination demonstration
  const generateMoreInstructors = () => {
    const baseInstructors = instructors;
    let extendedInstructors = [];

    // Generate 50 instructors for demonstration
    for (let i = 0; i < 50; i++) {
      const baseInstructor = baseInstructors[i % baseInstructors.length];
      extendedInstructors.push({
        ...baseInstructor,
        id: i + 1,
        name: `${baseInstructor.name} ${
          Math.floor(i / baseInstructors.length) + 1
        }`,
        email: `instructor${i + 1}${baseInstructor.email.substring(
          baseInstructor.email.indexOf("@")
        )}`,
      });
    }

    return extendedInstructors;
  };

  const allInstructors = generateMoreInstructors();

  const filteredInstructors = allInstructors.filter((instructor) => {
    const matchesSearch =
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || instructor.status === selectedStatus;
    const matchesSpecialization =
      selectedSpecialization === "all" ||
      instructor.specialization === selectedSpecialization;

    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  // Pagination calculations
  const totalItems = filteredInstructors.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInstructors = filteredInstructors.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleViewInstructor = (instructor) => {
    setSelectedInstructor(instructor);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Instructors
          </h1>
          <p className="text-gray-400 mt-1">Manage your fitness instructors</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
          <FiPlus className="w-5 h-5 mr-2" />
          Add Instructor
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

      {/* Filters and Search */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec.toLowerCase()}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Instructors Table */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left p-4 text-gray-400 font-medium">
                  Instructor
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Contact
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Specialization
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Classes
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Rating
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {currentInstructors.map((instructor) => (
                <tr
                  key={instructor.id}
                  className="hover:bg-gray-700/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={instructor.image}
                        alt={instructor.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-white">
                          {instructor.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          Joined {instructor.joinDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-white">{instructor.email}</div>
                    <div className="text-sm text-gray-400">
                      {instructor.phone}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-violet-500/10 text-violet-400">
                      {instructor.specialization}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        instructor.status === "active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {instructor.status === "active" ? (
                        <FiCheck className="w-4 h-4 mr-1" />
                      ) : (
                        <FiX className="w-4 h-4 mr-1" />
                      )}
                      {instructor.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-white">{instructor.classesCount}</div>
                    <div className="text-sm text-gray-400">classes</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-white">{instructor.rating}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleViewInstructor(instructor)}
                        className="p-2 text-gray-400 hover:text-violet-400 transition-colors"
                        title="View Details"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="More"
                      >
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

      {/* Instructor Details Modal */}
      {showModal && selectedInstructor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {/* Modal Header */}
              <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">
                  Instructor Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiClose className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="bg-gray-800 px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column - Basic Info */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <img
                        src={selectedInstructor.image}
                        alt={selectedInstructor.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-violet-500/20"
                      />
                      <h4 className="text-xl font-bold text-white">
                        {selectedInstructor.name}
                      </h4>
                      <span className="px-3 py-1 rounded-full text-sm bg-violet-500/10 text-violet-400 inline-block mt-2">
                        {selectedInstructor.specialization}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-gray-400">
                        <FiMail className="w-5 h-5" />
                        <span>{selectedInstructor.email}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-400">
                        <FiPhone className="w-5 h-5" />
                        <span>{selectedInstructor.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-400">
                        <FiJoinDate className="w-5 h-5" />
                        <span>Joined {selectedInstructor.joinDate}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-400">
                        <FiStar className="w-5 h-5 text-yellow-400" />
                        <span>{selectedInstructor.rating} Rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column - Schedule & Classes */}
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <FiClock className="w-5 h-5 mr-2" /> Schedule
                      </h5>
                      <div className="space-y-3">
                        {selectedInstructor.schedule.map((item, index) => (
                          <div
                            key={index}
                            className="bg-gray-700/30 rounded-lg p-3"
                          >
                            <div className="font-medium text-white">
                              {item.class}
                            </div>
                            <div className="text-sm text-gray-400">
                              {item.day}
                            </div>
                            <div className="text-sm text-gray-400">
                              {item.time}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Certifications & Achievements */}
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <FiAward className="w-5 h-5 mr-2" /> Certifications
                      </h5>
                      <div className="space-y-2">
                        {selectedInstructor.certifications.map(
                          (cert, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-gray-400"
                            >
                              <FiCheck className="w-4 h-4 text-green-400" />
                              <span>{cert}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <FiAward className="w-5 h-5 mr-2" /> Achievements
                      </h5>
                      <div className="space-y-2">
                        {selectedInstructor.achievements.map(
                          (achievement, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-gray-400"
                            >
                              <FiCheck className="w-4 h-4 text-green-400" />
                              <span>{achievement}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
                  <h5 className="text-lg font-semibold text-white mb-2">Bio</h5>
                  <p className="text-gray-400">{selectedInstructor.bio}</p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
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

export default Instructors;
