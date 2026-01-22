import { useState, useEffect } from "react";
import api from "../../utils/api";
import {
  FiSearch,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiUsers,
  FiShield,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiEye,
  FiRefreshCw,
  FiLock,
  FiUnlock,
} from "react-icons/fi";

function SuspensionManagement() {
  const [activeTab, setActiveTab] = useState("gyms"); // "gyms" or "instructors"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100); // Increased to show more items
  const [loading, setLoading] = useState(false);
  const [gyms, setGyms] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [allGyms, setAllGyms] = useState([]); // Store all gyms for stats
  const [allInstructors, setAllInstructors] = useState([]); // Store all instructors for stats
  const [totalItems, setTotalItems] = useState(0);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showUnsuspendModal, setShowUnsuspendModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [suspensionHistory, setSuspensionHistory] = useState([]);
  const [suspendForm, setSuspendForm] = useState({
    reason: "",
    unsuspendDate: "",
    notes: "",
    gymId: "", // For gym-specific instructor suspension
  });

  useEffect(() => {
    if (activeTab === "gyms") {
      fetchGyms();
    } else {
      fetchInstructors();
    }
  }, [activeTab, currentPage, itemsPerPage, selectedStatus, searchTerm]);

  const fetchGyms = async () => {
    setLoading(true);
    try {
      // Fetch all gyms with a high limit to get all registered gyms
      const params = {
        limit: 1000, // High limit to get all gyms
      };
      // Don't filter by status on backend - get all gyms
      if (searchTerm) {
        // You might need to add search functionality to your API
      }

      const response = await api.get("/gyms", { params });
      let allGyms = response.data || [];
      
      // Apply search filter if needed
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        allGyms = allGyms.filter(
          (g) =>
            g.gymName?.toLowerCase().includes(searchLower) ||
            g.owner?.firstName?.toLowerCase().includes(searchLower) ||
            g.owner?.lastName?.toLowerCase().includes(searchLower) ||
            g.contactInfo?.email?.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply status filter on frontend if needed
      let filteredGyms = allGyms;
      if (selectedStatus !== "all") {
        if (selectedStatus === "suspended") {
          filteredGyms = allGyms.filter((g) => g.status === "suspended" || !g.isActive);
        } else if (selectedStatus === "approved") {
          filteredGyms = allGyms.filter((g) => g.status === "approved" && g.isActive);
        } else if (selectedStatus === "pending") {claud
          filteredGyms = allGyms.filter((g) => g.status === "pending");
        }
      }
      
      // Store all filtered gyms for stats calculation
      setAllGyms(filteredGyms);
      
      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedGyms = filteredGyms.slice(startIndex, endIndex);
      
      setGyms(paginatedGyms);
      setTotalItems(filteredGyms.length);
    } catch (error) {
      console.error("Error fetching gyms:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      // Fetch all instructors with a high limit
      const params = {
        limit: 1000, // High limit to get all instructors
        role: "instructor",
        status: "all", // Get all instructors regardless of status
      };
      if (searchTerm) {
        params.search = searchTerm;
      }

      // Use the admin users endpoint to get all instructors
      const response = await api.getUsersAdmin(params);
      let allInstructors = response.data || [];
      
      // Apply search filter if not already applied by API
      if (searchTerm && !params.search) {
        const searchLower = searchTerm.toLowerCase();
        allInstructors = allInstructors.filter(
          (i) =>
            i.firstName?.toLowerCase().includes(searchLower) ||
            i.lastName?.toLowerCase().includes(searchLower) ||
            i.email?.toLowerCase().includes(searchLower) ||
            i.specialization?.some((s) => s.toLowerCase().includes(searchLower))
        );
      }
      
      // Apply status filter on frontend if needed
      let filteredInstructors = allInstructors;
      if (selectedStatus !== "all") {
        if (selectedStatus === "suspended") {
          filteredInstructors = allInstructors.filter(
            (i) => !i.isActive || i.suspensionStatus?.isSuspended
          );
        } else if (selectedStatus === "active") {
          filteredInstructors = allInstructors.filter(
            (i) => i.isActive && !i.suspensionStatus?.isSuspended
          );
        }
      }
      
      // Store all filtered instructors for stats calculation
      setAllInstructors(filteredInstructors);
      
      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedInstructors = filteredInstructors.slice(startIndex, endIndex);
      
      setInstructors(paginatedInstructors);
      setTotalItems(filteredInstructors.length);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "gyms") {
        await api.put(`/gyms/${selectedItem}/suspend`, {
          reason: suspendForm.reason,
          unsuspendDate: suspendForm.unsuspendDate || null,
          notes: suspendForm.notes,
        });
      } else {
        await api.put(`/instructors/admin/instructor/${selectedItem}/suspend`, {
          reason: suspendForm.reason,
          gymId: suspendForm.gymId || null, // null = global suspension
          unsuspendDate: suspendForm.unsuspendDate || null,
          notes: suspendForm.notes,
        });
      }

      setShowSuspendModal(false);
      setSelectedItem(null);
      setSuspendForm({ reason: "", unsuspendDate: "", notes: "", gymId: "" });
      if (activeTab === "gyms") {
        fetchGyms();
      } else {
        fetchInstructors();
      }
    } catch (error) {
      console.error("Error suspending:", error);
      alert("Failed to suspend: " + (error.response?.data?.message || error.message));
    }
  };

  const handleUnsuspend = async () => {
    try {
      if (activeTab === "gyms") {
        await api.put(`/gyms/${selectedItem}/unsuspend`, {
          notes: suspendForm.notes,
        });
      } else {
        await api.put(`/instructors/admin/instructor/${selectedItem}/unsuspend`, {
          gymId: suspendForm.gymId || null, // null = global unsuspension
          notes: suspendForm.notes,
        });
      }

      setShowUnsuspendModal(false);
      setSelectedItem(null);
      setSuspendForm({ reason: "", unsuspendDate: "", notes: "", gymId: "" });
      if (activeTab === "gyms") {
        fetchGyms();
      } else {
        fetchInstructors();
      }
    } catch (error) {
      console.error("Error unsuspending:", error);
      alert("Failed to unsuspend: " + (error.response?.data?.message || error.message));
    }
  };

  const getStatusBadge = (status, isActive) => {
    if (status === "suspended" || !isActive) {
      return "bg-red-500/20 text-red-400 border-red-500/50";
    }
    if (status === "approved" && isActive) {
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
    }
    if (status === "pending") {
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    }
    return "bg-gray-500/20 text-gray-400 border-gray-500/50";
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Helpers
  const isGymSuspended = (gym) => gym.status === "suspended";
  const isInstructorSuspended = (instructor) =>
    !instructor.isActive || instructor.suspensionStatus?.isSuspended;

  // Calculate stats from all data, not just current page
  const suspendedGyms = allGyms.filter(isGymSuspended);
  const suspendedInstructors = allInstructors.filter(isInstructorSuspended);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Suspension Management
          </h1>
          <p className="text-gray-400 mt-1">Manage gym and instructor suspensions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Suspended Gyms</p>
              <p className="text-2xl font-bold text-white">{suspendedGyms.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
              <FiShield className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Suspended Instructors</p>
              <p className="text-2xl font-bold text-white">{suspendedInstructors.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
              <FiUsers className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Active Gyms</p>
              <p className="text-2xl font-bold text-white">
                {allGyms.filter((g) => g.status === "approved" && g.isActive).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FiCheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Active Instructors</p>
              <p className="text-2xl font-bold text-white">
                {allInstructors.filter((i) => i.isActive && !i.suspensionStatus?.isSuspended).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FiCheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-1">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab("gyms");
              setCurrentPage(1);
            }}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "gyms"
                ? "bg-violet-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Gyms
          </button>
          <button
            onClick={() => {
              setActiveTab("instructors");
              setCurrentPage(1);
            }}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "instructors"
                ? "bg-violet-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Instructors
          </button>
          <button
            onClick={async () => {
              try {
                const response = await api.get("/admin/suspensions/history", {
                  params: { limit: 50 }
                });
                setSuspensionHistory(response.data.data || []);
                setShowHistoryModal(true);
              } catch (error) {
                console.error("Error fetching suspension history:", error);
                alert("Failed to fetch suspension history");
              }
            }}
            className="px-4 py-2 rounded-lg transition-colors bg-gray-700/50 text-gray-300 hover:bg-gray-700"
          >
            <FiEye className="w-4 h-4 inline mr-2" />
            History
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Status</option>
            {activeTab === "gyms" ? (
              <>
                <option value="approved">Approved</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </>
            ) : (
              <>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </>
            )}
          </select>
          <button
            onClick={() => {
              if (activeTab === "gyms") fetchGyms();
              else fetchInstructors();
            }}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                {activeTab === "gyms" ? (
                  <>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Gym Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Owner</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Suspension Reason
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Suspended At
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Actions
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Instructor
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Specialization
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Suspension Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                      Actions
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {loading ? (
                <tr>
                  <td
                    colSpan={activeTab === "gyms" ? 6 : 5}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : activeTab === "gyms" ? (
                gyms.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                      No gyms found
                    </td>
                  </tr>
                ) : (
                  gyms.map((gym) => (
                    <tr key={gym._id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{gym.gymName}</div>
                        <div className="text-sm text-gray-400">{gym.gymType}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {gym.owner?.firstName} {gym.owner?.lastName}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                            gym.status,
                            gym.isActive
                          )}`}
                        >
                          {isGymSuspended(gym) ? "Suspended" : gym.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {gym.suspensionDetails?.reason || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {gym.suspensionDetails?.suspendedAt
                          ? new Date(gym.suspensionDetails.suspendedAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {isGymSuspended(gym) ? (
                            <button
                              onClick={() => {
                                setSelectedItem(gym._id);
                                setShowUnsuspendModal(true);
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-lg hover:bg-emerald-500/30 hover:border-emerald-500 transition-all text-sm font-medium shadow-sm hover:shadow-emerald-500/20"
                            >
                              <FiUnlock className="w-4 h-4" />
                              Unsuspend
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedItem(gym._id);
                                setShowSuspendModal(true);
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 hover:border-red-500 transition-all text-sm font-medium shadow-sm hover:shadow-red-500/20"
                            >
                              <FiLock className="w-4 h-4" />
                              Suspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )
              ) : instructors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    No instructors found
                  </td>
                </tr>
              ) : (
                instructors.map((instructor) => (
                  <tr key={instructor._id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">
                        {instructor.firstName} {instructor.lastName}
                      </div>
                      <div className="text-sm text-gray-400">{instructor.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {instructor.specialization?.join(", ") || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          isInstructorSuspended(instructor)
                            ? "bg-red-500/20 text-red-400 border-red-500/50"
                            : "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                        }`}
                      >
                        {isInstructorSuspended(instructor) ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {instructor.suspensionStatus?.suspendedGyms?.length > 0
                        ? `Gym-specific (${instructor.suspensionStatus.suspendedGyms.length})`
                        : instructor.suspensionStatus?.isSuspended
                        ? "Global"
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isInstructorSuspended(instructor) ? (
                          <button
                            onClick={() => {
                              setSelectedItem(instructor._id);
                              setShowUnsuspendModal(true);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-lg hover:bg-emerald-500/30 hover:border-emerald-500 transition-all text-sm font-medium shadow-sm hover:shadow-emerald-500/20"
                          >
                            <FiUnlock className="w-4 h-4" />
                            Unsuspend
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedItem(instructor._id);
                              setShowSuspendModal(true);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 hover:border-red-500 transition-all text-sm font-medium shadow-sm hover:shadow-red-500/20"
                          >
                            <FiLock className="w-4 h-4" />
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-700/50 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">
              Suspend {activeTab === "gyms" ? "Gym" : "Instructor"}
            </h2>
            <form onSubmit={handleSuspend} className="space-y-4">
              {activeTab === "instructors" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Suspension Type
                  </label>
                  <select
                    value={suspendForm.gymId ? "gym" : "global"}
                    onChange={(e) => {
                      if (e.target.value === "global") {
                        setSuspendForm({ ...suspendForm, gymId: "" });
                      }
                    }}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="global">Global (All Gyms)</option>
                    <option value="gym">Gym-Specific</option>
                  </select>
                  {suspendForm.gymId && (
                    <input
                      type="text"
                      placeholder="Enter Gym ID"
                      value={suspendForm.gymId}
                      onChange={(e) =>
                        setSuspendForm({ ...suspendForm, gymId: e.target.value })
                      }
                      className="w-full mt-2 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    />
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reason <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  value={suspendForm.reason}
                  onChange={(e) => setSuspendForm({ ...suspendForm, reason: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  rows="3"
                  placeholder="Enter suspension reason..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Auto-Unsuspend Date (Optional)
                </label>
                <input
                  type="date"
                  value={suspendForm.unsuspendDate}
                  onChange={(e) =>
                    setSuspendForm({ ...suspendForm, unsuspendDate: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                <textarea
                  value={suspendForm.notes}
                  onChange={(e) => setSuspendForm({ ...suspendForm, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  rows="2"
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Suspend
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSuspendModal(false);
                    setSelectedItem(null);
                    setSuspendForm({ reason: "", unsuspendDate: "", notes: "", gymId: "" });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unsuspend Modal */}
      {showUnsuspendModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">
              Unsuspend {activeTab === "gyms" ? "Gym" : "Instructor"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUnsuspend();
              }}
              className="space-y-4"
            >
              {activeTab === "instructors" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Unsuspension Type
                  </label>
                  <select
                    value={suspendForm.gymId ? "gym" : "global"}
                    onChange={(e) => {
                      if (e.target.value === "global") {
                        setSuspendForm({ ...suspendForm, gymId: "" });
                      }
                    }}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="global">Global (All Gyms)</option>
                    <option value="gym">Gym-Specific</option>
                  </select>
                  {suspendForm.gymId && (
                    <input
                      type="text"
                      placeholder="Enter Gym ID"
                      value={suspendForm.gymId}
                      onChange={(e) =>
                        setSuspendForm({ ...suspendForm, gymId: e.target.value })
                      }
                      className="w-full mt-2 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    />
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                <textarea
                  value={suspendForm.notes}
                  onChange={(e) => setSuspendForm({ ...suspendForm, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  rows="3"
                  placeholder="Notes about unsuspension..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Unsuspend
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUnsuspendModal(false);
                    setSelectedItem(null);
                    setSuspendForm({ reason: "", unsuspendDate: "", notes: "", gymId: "" });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suspension History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Suspension History</h2>
              <button
                onClick={() => {
                  setShowHistoryModal(false);
                  setSuspensionHistory([]);
                }}
                className="text-gray-400 hover:text-white"
              >
                <FiXCircle className="w-6 h-6" />
              </button>
            </div>
            {suspensionHistory.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No history found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Action</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Reason</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Suspension Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Performed By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {suspensionHistory.map((history, index) => (
                      <tr key={index} className="hover:bg-gray-700/30">
                        <td className="px-4 py-3 text-gray-300 capitalize">{history.entityType}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              history.action === "suspended"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-emerald-500/20 text-emerald-400"
                            }`}
                          >
                            {history.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-300">{history.reason || "N/A"}</td>
                        <td className="px-4 py-3 text-gray-300 capitalize">
                          {history.suspensionType || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {new Date(history.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {history.suspendedBy?.firstName} {history.suspendedBy?.lastName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SuspensionManagement;

