import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiCheck,
  FiX,
  FiShield,
  FiDollarSign,
  FiActivity,
  FiMapPin,
  FiArrowUp,
  FiArrowDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

function GymOwners() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const stats = [
    {
      title: "Total Gym Owners",
      value: "245",
      change: "+8.4%",
      trend: "up",
      icon: FiShield,
      color: "violet",
      description: "Registered gym owners",
    },
    {
      title: "Average Revenue",
      value: "$12,845",
      change: "+23.4%",
      trend: "up",
      icon: FiDollarSign,
      color: "emerald",
      description: "Per gym this month",
    },
    {
      title: "Active Gyms",
      value: "186",
      change: "+15.2%",
      trend: "up",
      icon: FiActivity,
      color: "blue",
      description: "Currently operating",
    },
    {
      title: "Locations",
      value: "32",
      change: "+18.7%",
      trend: "up",
      icon: FiMapPin,
      color: "amber",
      description: "Cities covered",
    },
  ];

  // Sample data for gym owners
  const gymOwners = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Gym Owner ${i + 1}`,
    email: `owner${i + 1}@example.com`,
    gymName: `Fitness Center ${i + 1}`,
    location: `City ${(i % 10) + 1}`,
    memberCount: Math.floor(Math.random() * 1000) + 100,
    status: Math.random() > 0.2 ? "active" : "inactive",
    joinDate: "2024-02-01",
    lastLogin: "2024-02-20 10:00",
    avatar: `https://i.pravatar.cc/150?img=${i % 70}`,
  }));

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const filteredOwners = gymOwners.filter((owner) => {
    const matchesSearch =
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.gymName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || owner.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalItems = filteredOwners.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOwners = filteredOwners.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Gym Owners
          </h1>
          <p className="text-gray-400 mt-1">Manage registered gym owners</p>
        </div>
        <Link
          to="/admin/users/gym-owners/add"
          className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Add Gym Owner
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

      {/* Filters and Search */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search gym owners..."
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
          </div>
        </div>
      </div>

      {/* Gym Owners Table */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left p-4 text-gray-400 font-medium">
                  Owner
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">Gym</th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Location
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Members
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
              {currentOwners.map((owner) => (
                <tr
                  key={owner.id}
                  className="hover:bg-gray-700/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={owner.avatar}
                        alt={owner.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-white">
                          {owner.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {owner.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{owner.gymName}</td>
                  <td className="p-4 text-gray-300">{owner.location}</td>
                  <td className="p-4 text-gray-300">{owner.memberCount}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        owner.status === "active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {owner.status === "active" ? (
                        <FiCheck className="w-4 h-4 mr-1" />
                      ) : (
                        <FiX className="w-4 h-4 mr-1" />
                      )}
                      {owner.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
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
    </div>
  );
}

export default GymOwners;
