import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiCheck,
  FiX,
  FiActivity,
  FiDollarSign,
  FiArrowUp,
  FiArrowDown,
  FiCalendar,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBarChart2,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiUserPlus,
  FiStar,
  FiUserCheck,
} from "react-icons/fi";

function Members() {
  // -------------------------------
  // 1. State for Members
  // -------------------------------
  const [members, setMembers] = useState(() => generateMembers());

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("table");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const stats = [
    {
      title: "Total Members",
      value: "543",
      change: "+12.5%",
      trend: "up",
      icon: FiUsers,
      color: "violet",
      description: "Active members",
    },
    {
      title: "Monthly Revenue",
      value: "$45.6K",
      change: "+23.4%",
      trend: "up",
      icon: FiDollarSign,
      color: "emerald",
      description: "From memberships",
    },
    {
      title: "Attendance Rate",
      value: "78%",
      change: "+5.2%",
      trend: "up",
      icon: FiActivity,
      color: "blue",
      description: "Monthly average",
    },
    {
      title: "Retention Rate",
      value: "92%",
      change: "+8.7%",
      trend: "up",
      icon: FiHeart,
      color: "amber",
      description: "Last 3 months",
    },
  ];

  // Sample data for instructors
  const instructors = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialization: "Yoga",
      rating: 4.9,
      availability: ["Morning", "Evening"],
      experience: "5 years",
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Mike Chen",
      specialization: "Strength Training",
      rating: 4.8,
      availability: ["Afternoon", "Evening"],
      experience: "7 years",
      image: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      specialization: "HIIT",
      rating: 4.7,
      availability: ["Morning", "Afternoon"],
      experience: "4 years",
      image: "https://i.pravatar.cc/150?img=3",
    },
  ];

  // -------------------------------
  // 2. Generate Member Data
  // -------------------------------
  function generateMembers() {
    const baseMembers = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Fitness Street, NY",
        joinDate: "2024-02-15",
        plan: "Premium",
        status: "active",
        lastVisit: "2024-03-05",
        attendance: 85,
        image: "https://i.pravatar.cc/150?img=1",
        nextPayment: "2024-04-01",
        paymentStatus: "paid",
        goals: ["Weight Loss", "Muscle Gain"],
        instructor: "Sarah Johnson",
        classesAttended: 24,
        progress: 75,
      },
      {
        id: 2,
        name: "Sarah Smith",
        email: "sarah@example.com",
        phone: "+1 (555) 234-5678",
        address: "456 Health Ave, NY",
        joinDate: "2024-01-20",
        plan: "Basic",
        status: "active",
        lastVisit: "2024-03-06",
        attendance: 92,
        image: "https://i.pravatar.cc/150?img=2",
        nextPayment: "2024-03-20",
        paymentStatus: "pending",
        goals: ["Flexibility", "Cardio"],
        instructor: "Mike Chen",
        classesAttended: 18,
        progress: 60,
      },
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike@example.com",
        phone: "+1 (555) 345-6789",
        address: "789 Wellness Blvd, NY",
        joinDate: "2024-02-01",
        plan: "Elite",
        status: "inactive",
        lastVisit: "2024-02-28",
        attendance: 45,
        image: "https://i.pravatar.cc/150?img=3",
        nextPayment: "2024-03-01",
        paymentStatus: "overdue",
        goals: ["Strength Training"],
        instructor: null,
        classesAttended: 12,
        progress: 30,
      },
    ];

    // Generate 50 members for demonstration
    return Array.from({ length: 50 }, (_, index) => {
      const baseMember = baseMembers[index % baseMembers.length];
      return {
        ...baseMember,
        id: index + 1,
        name: `${baseMember.name} ${
          Math.floor(index / baseMembers.length) + 1
        }`,
        email: `member${index + 1}@example.com`,
      };
    });
  }

  // -------------------------------
  // 3. Handle Assign/Update
  // -------------------------------
  const handleAssignInstructor = (member) => {
    setSelectedMember(member);
    setSelectedInstructor(member.instructor || "");
    setShowAssignModal(true);
  };

  const confirmAssignment = async () => {
    if (!selectedInstructor) return;

    setIsUpdating(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update the instructor in the state
      setMembers((prevMembers) => {
        return prevMembers.map((m) => {
          if (m.id === selectedMember.id) {
            return {
              ...m,
              instructor: selectedInstructor,
            };
          }
          return m;
        });
      });

      // Close modal and reset state
      setShowAssignModal(false);
      setSelectedMember(null);
      setSelectedInstructor("");

      console.log("Instructor assigned/updated successfully!");
    } catch (error) {
      console.error("Error assigning instructor:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // -------------------------------
  // 4. Filtering / Pagination
  // -------------------------------
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || member.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalItems = filteredMembers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Members
          </h1>
          <p className="text-gray-400 mt-1">Manage your gym's members</p>
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
          <button className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
            <FiPlus className="w-5 h-5 mr-2" />
            Add Member
          </button>
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
                placeholder="Search members..."
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
              <option value="all">All Members</option>
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

      {/* TABLE VIEW */}
      {viewMode === "table" ? (
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left p-4 text-gray-400 font-medium">
                    Member
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    Contact
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    Plan
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    Instructor
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    Progress
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
                {currentMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-white">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            Joined{" "}
                            {new Date(member.joinDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-300">{member.email}</div>
                      <div className="text-sm text-gray-400">
                        {member.phone}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm">
                        {member.plan}
                      </span>
                    </td>

                    {/* 
                      --- Instructor Cell ---
                      If a member has an instructor, we show a "Update Instructor" button.
                      Otherwise, we show "Assign Instructor".
                    */}
                    <td className="p-4">
                      {member.instructor ? (
                        <button
                          onClick={() => handleAssignInstructor(member)}
                          className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          <FiUserCheck className="w-4 h-4 mr-1" />
                          Update Instructor
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAssignInstructor(member)}
                          className="flex items-center text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          <FiUserPlus className="w-4 h-4 mr-1" />
                          Assign Instructor
                        </button>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500 rounded-full"
                            style={{ width: `${member.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {member.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          member.status === "active"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {member.status === "active" ? (
                          <FiCheck className="w-4 h-4 mr-1" />
                        ) : (
                          <FiX className="w-4 h-4 mr-1" />
                        )}
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/gym-owner/members/${member.id}/progress`}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <FiBarChart2 className="w-5 h-5" />
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                          <FiTrash2 className="w-5 h-5" />
                        </button>
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
                    // Show first page, last page, current page, and one page around current page
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
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentMembers.map((member) => (
            <div
              key={member.id}
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-violet-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {member.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        member.status === "active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {member.status === "active" ? (
                        <FiCheck className="w-4 h-4 inline mr-1" />
                      ) : (
                        <FiX className="w-4 h-4 inline mr-1" />
                      )}
                      {member.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2 text-gray-400">
                  <div className="flex items-center">
                    <FiMail className="w-4 h-4 mr-2 text-violet-400" />
                    {member.email}
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="w-4 h-4 mr-2 text-violet-400" />
                    {member.phone}
                  </div>
                  <div className="flex items-center">
                    <FiMapPin className="w-4 h-4 mr-2 text-violet-400" />
                    {member.address}
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-2 text-violet-400" />
                    Last visit: {member.lastVisit}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm">
                    {member.plan} Plan
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      member.paymentStatus === "paid"
                        ? "bg-green-500/10 text-green-400"
                        : member.paymentStatus === "pending"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {member.paymentStatus?.charAt(0).toUpperCase() +
                      member.paymentStatus?.slice(1)}
                  </span>
                </div>

                {/* Instructor Assignment */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Assigned Instructor</span>
                    {member.instructor ? (
                      <button
                        onClick={() => handleAssignInstructor(member)}
                        className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <FiUserCheck className="w-4 h-4 mr-1" />
                        Update Instructor
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAssignInstructor(member)}
                        className="flex items-center text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        <FiUserPlus className="w-4 h-4 mr-1" />
                        Assign Instructor
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{member.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full"
                      style={{ width: `${member.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {member.goals.map((goal, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-900/50 text-gray-300 rounded-full text-sm"
                    >
                      {goal}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to={`/gym-owner/members/${member.id}/progress`}
                    className="flex items-center justify-center px-4 py-2 bg-violet-600/20 text-violet-400 rounded-lg hover:bg-violet-600/30 transition-colors"
                  >
                    <FiBarChart2 className="w-4 h-4 mr-2" />
                    View Progress
                  </Link>
                  <Link
                    to={`/gym-owner/members/${member.id}/details`}
                    className="flex items-center justify-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign/Update Instructor Modal */}
      {showAssignModal && selectedMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            {/* Modal Overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            {/* Modal Content */}
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {selectedMember.instructor ? "Update" : "Assign"} Instructor
                  for {selectedMember.name}
                </h3>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedMember(null);
                    setSelectedInstructor("");
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Current Instructor (if any) */}
                {selectedMember.instructor && (
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">
                      Current Instructor
                    </div>
                    <div className="text-white">
                      {selectedMember.instructor}
                    </div>
                  </div>
                )}

                {/* Instructor Selection */}
                <div className="grid grid-cols-1 gap-4">
                  {instructors.map((instructor) => (
                    <label
                      key={instructor.id}
                      className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                        selectedInstructor === instructor.name
                          ? "bg-violet-500/10 border-violet-500"
                          : "bg-gray-900/50 border-gray-700 hover:bg-gray-800/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="instructor"
                        value={instructor.name}
                        checked={selectedInstructor === instructor.name}
                        onChange={(e) => setSelectedInstructor(e.target.value)}
                        className="hidden"
                      />
                      <div className="flex items-center space-x-4 flex-1">
                        <img
                          src={instructor.image}
                          alt={instructor.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-white font-medium">
                              {instructor.name}
                            </h4>
                            <div className="flex items-center text-yellow-400">
                              <FiStar className="w-4 h-4 mr-1" />
                              <span className="text-white">
                                {instructor.rating}
                              </span>
                            </div>
                          </div>
                          <p className="text-violet-400 text-sm">
                            {instructor.specialization}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                            <span>{instructor.experience}</span>
                            <span>
                              Available: {instructor.availability.join(", ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedMember(null);
                      setSelectedInstructor("");
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAssignment}
                    disabled={!selectedInstructor || isUpdating}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isUpdating ? (
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
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-5 h-5" />
                        <span>
                          {selectedMember.instructor ? "Update" : "Assign"}{" "}
                          Instructor
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Members;
