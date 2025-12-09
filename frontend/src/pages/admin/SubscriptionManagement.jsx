import { useState, useEffect } from "react";
import api from "../../utils/api";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiRefreshCw,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

function SubscriptionManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGym, setSelectedGym] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [gyms, setGyms] = useState([]);
  const [members, setMembers] = useState([]);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);

  // Form states
  const [formData, setFormData] = useState({
    memberId: "",
    planName: "",
    price: "",
    features: "",
    startDate: "",
    duration: "30",
    paymentMethod: "manual",
    paymentStatus: "paid",
  });

  const [extendData, setExtendData] = useState({
    additionalDays: "30",
  });

  // Fetch subscriptions
  useEffect(() => {
    fetchSubscriptions();
    fetchStats();
    fetchGyms();
  }, [currentPage, itemsPerPage, selectedGym, selectedStatus, selectedPaymentStatus, searchTerm]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (selectedGym !== "all") params.gymId = selectedGym;
      if (selectedStatus !== "all") params.status = selectedStatus;
      if (selectedPaymentStatus !== "all") params.paymentStatus = selectedPaymentStatus;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get("/admin/subscriptions", { params });
      setSubscriptions(response.data.data || []);
      setTotalItems(response.data.pagination?.total || 0);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/subscriptions/stats");
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchGyms = async () => {
    try {
      const response = await api.get("/gyms");
      setGyms(response.data.data || []);
    } catch (error) {
      console.error("Error fetching gyms:", error);
    }
  };

  const fetchMembers = async (gymId) => {
    try {
      const response = await api.get(`/members?gym=${gymId}`);
      setMembers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleCreateSubscription = async (e) => {
    e.preventDefault();
    try {
      const featuresArray = formData.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f);

      await api.post(`/admin/subscriptions/${formData.memberId}/create`, {
        planName: formData.planName,
        price: parseFloat(formData.price),
        features: featuresArray,
        startDate: formData.startDate,
        duration: parseInt(formData.duration),
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentStatus,
      });

      setShowCreateModal(false);
      setFormData({
        memberId: "",
        planName: "",
        price: "",
        features: "",
        startDate: "",
        duration: "30",
        paymentMethod: "manual",
        paymentStatus: "paid",
      });
      fetchSubscriptions();
      fetchStats();
    } catch (error) {
      console.error("Error creating subscription:", error);
      alert("Failed to create subscription: " + (error.response?.data?.message || error.message));
    }
  };

  const handleExtendSubscription = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/subscriptions/${selectedMember}/extend`, {
        additionalDays: parseInt(extendData.additionalDays),
      });

      setShowExtendModal(false);
      setSelectedMember(null);
      setExtendData({ additionalDays: "30" });
      fetchSubscriptions();
      fetchStats();
    } catch (error) {
      console.error("Error extending subscription:", error);
      alert("Failed to extend subscription: " + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdatePaymentStatus = async (memberId, newStatus) => {
    try {
      await api.put(`/admin/subscriptions/${memberId}/update`, {
        paymentStatus: newStatus,
      });
      fetchSubscriptions();
      fetchStats();
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status");
    }
  };

  const fetchSubscriptionHistory = async (memberId) => {
    try {
      const response = await api.get(`/admin/subscriptions/${memberId}/history`);
      setSubscriptionHistory(response.data.data || []);
      setShowHistoryModal(true);
    } catch (error) {
      console.error("Error fetching subscription history:", error);
      alert("Failed to fetch subscription history");
    }
  };

  const statsCards = stats
    ? [
        {
          title: "Total Active",
          value: stats.totalActive || 0,
          change: "+12.5%",
          trend: "up",
          icon: FiUsers,
          color: "violet",
        },
        {
          title: "Total Revenue",
          value: `$${stats.totalRevenue?.toFixed(2) || "0.00"}`,
          change: "+23.4%",
          trend: "up",
          icon: FiDollarSign,
          color: "emerald",
        },
        {
          title: "Expiring Soon",
          value: stats.expiringSoon || 0,
          change: "-5.2%",
          trend: "down",
          icon: FiClock,
          color: "amber",
        },
        {
          title: "Overdue",
          value: stats.paymentStatus?.overdue || 0,
          change: "+8.7%",
          trend: "up",
          icon: FiAlertCircle,
          color: "red",
        },
      ]
    : [];

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getStatusBadge = (status) => {
    const badges = {
      active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
      inactive: "bg-gray-500/20 text-gray-400 border-gray-500/50",
      suspended: "bg-red-500/20 text-red-400 border-red-500/50",
    };
    return badges[status] || badges.inactive;
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      paid: "bg-green-500/20 text-green-400 border-green-500/50",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      overdue: "bg-red-500/20 text-red-400 border-red-500/50",
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Subscription Management
          </h1>
          <p className="text-gray-400 mt-1">Manage member subscriptions manually</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Create Subscription
        </button>
      </div>

      {/* Stats Grid */}
      {statsCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === "up" ? (
                      <FiTrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
                    ) : (
                      <FiTrendingDown className="w-4 h-4 text-red-400 mr-1" />
                    )}
                    <span
                      className={`text-sm ${
                        stat.trend === "up" ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
            />
          </div>
          <select
            value={selectedGym}
            onChange={(e) => setSelectedGym(e.target.value)}
            className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Gyms</option>
            {gyms.map((gym) => (
              <option key={gym._id} value={gym._id}>
                {gym.gymName}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Member</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Gym</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Plan</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                  Payment Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">End Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-400">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">
                        {sub.firstName} {sub.lastName}
                      </div>
                      <div className="text-sm text-gray-400">{sub.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {sub.gym?.gymName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {sub.membershipPlan?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      ${sub.membershipPlan?.price?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                          sub.status
                        )}`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={sub.paymentDetails?.paymentStatus || "pending"}
                        onChange={(e) =>
                          handleUpdatePaymentStatus(sub._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium border bg-transparent ${getPaymentStatusBadge(
                          sub.paymentDetails?.paymentStatus || "pending"
                        )}`}
                      >
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {sub.membershipPlan?.endDate
                        ? new Date(sub.membershipPlan.endDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedMember(sub._id);
                            fetchSubscriptionHistory(sub._id);
                          }}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                          title="View History"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMember(sub._id);
                            setShowExtendModal(true);
                          }}
                          className="p-2 text-violet-400 hover:bg-violet-500/20 rounded-lg transition-colors"
                          title="Extend Subscription"
                        >
                          <FiCalendar className="w-4 h-4" />
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
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-700/50 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} subscriptions
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
                className="p-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Create Subscription Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Create New Subscription</h2>
            <form onSubmit={handleCreateSubscription} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Member
                </label>
                <select
                  required
                  value={formData.memberId}
                  onChange={(e) => {
                    setFormData({ ...formData, memberId: e.target.value });
                    const member = members.find((m) => m._id === e.target.value);
                    if (member) {
                      fetchMembers(member.gym);
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="">Select a member...</option>
                  {members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.firstName} {member.lastName} - {member.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.planName}
                    onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    placeholder="e.g., Premium Monthly"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Features (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  placeholder="Feature 1, Feature 2, Feature 3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    placeholder="30"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="manual">Manual</option>
                    <option value="card">Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Create Subscription
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Extend Subscription Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Extend Subscription</h2>
            <form onSubmit={handleExtendSubscription} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Days
                </label>
                <input
                  type="number"
                  required
                  value={extendData.additionalDays}
                  onChange={(e) =>
                    setExtendData({ ...extendData, additionalDays: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  placeholder="30"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Extend Subscription
                </button>
                <button
                  type="button"
                  onClick={() => setShowExtendModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscription History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Subscription History</h2>
              <button
                onClick={() => {
                  setShowHistoryModal(false);
                  setSubscriptionHistory([]);
                }}
                className="text-gray-400 hover:text-white"
              >
                <FiXCircle className="w-6 h-6" />
              </button>
            </div>
            {subscriptionHistory.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No history found</div>
            ) : (
              <div className="space-y-4">
                {subscriptionHistory.map((history, index) => (
                  <div
                    key={index}
                    className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          history.action === "created"
                            ? "bg-green-500/20 text-green-400"
                            : history.action === "updated"
                            ? "bg-blue-500/20 text-blue-400"
                            : history.action === "extended"
                            ? "bg-violet-500/20 text-violet-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {history.action.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(history.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      {history.previousPlan && (
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Previous Plan:</p>
                          <p className="text-white font-medium">{history.previousPlan.name}</p>
                          <p className="text-gray-300 text-sm">
                            ${history.previousPlan.price?.toFixed(2)} -{" "}
                            {history.previousPlan.endDate
                              ? new Date(history.previousPlan.endDate).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      )}
                      {history.newPlan && (
                        <div>
                          <p className="text-gray-400 text-sm mb-1">New Plan:</p>
                          <p className="text-white font-medium">{history.newPlan.name}</p>
                          <p className="text-gray-300 text-sm">
                            ${history.newPlan.price?.toFixed(2)} -{" "}
                            {history.newPlan.endDate
                              ? new Date(history.newPlan.endDate).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      )}
                    </div>
                    {history.notes && (
                      <p className="text-gray-400 text-sm mt-2">Notes: {history.notes}</p>
                    )}
                    {history.performedBy && (
                      <p className="text-gray-500 text-xs mt-2">
                        Performed by: {history.performedBy.firstName} {history.performedBy.lastName}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionManagement;

