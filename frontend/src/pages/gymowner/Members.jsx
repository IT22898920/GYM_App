import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";
import api from "../../utils/api";
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
  FiEye,
  FiCreditCard,
  FiAlertCircle,
} from "react-icons/fi";

function Members() {
  const { showAlert } = useAlert();
  
  // -------------------------------
  // 1. State for Members
  // -------------------------------
  const [members, setMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    monthlyRevenue: 0,
    avgAttendance: 0,
    retentionRate: 0
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("table");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [instructorsLoading, setInstructorsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [memberToConfirm, setMemberToConfirm] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMembers: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch members and stats on component mount
  useEffect(() => {
    fetchMembers();
    fetchMemberStats();
    fetchPendingMembers();
  }, [currentPage, searchTerm, selectedFilter]);

  // Fetch instructors only once on component mount
  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: selectedFilter
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/members?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }

      const data = await response.json();
      setMembers(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching members:', error);
      showAlert('error', 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/members/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPendingMembers = async () => {
    try {
      setPendingLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/members?status=inactive&limit=50`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending members');
      }

      const data = await response.json();
      
      // Filter for members with pending payment status
      const pending = data.data.filter(member => 
        member.paymentDetails?.paymentStatus === 'pending' || 
        (member.status === 'inactive' && member.paymentDetails?.method === 'manual')
      );
      setPendingMembers(pending);
    } catch (error) {
      console.error('Error fetching pending members:', error);
    } finally {
      setPendingLoading(false);
    }
  };

  const showConfirmPaymentModal = (member) => {
    setMemberToConfirm(member);
    setShowConfirmModal(true);
  };

  const confirmPayment = async () => {
    if (!memberToConfirm) return;
    
    try {
      setIsConfirming(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/members/${memberToConfirm._id}/confirm-payment`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to confirm payment');
      }

      setShowConfirmModal(false);
      showAlert('success', `🎉 Payment confirmed for ${memberToConfirm.firstName} ${memberToConfirm.lastName}! Customer has been notified.`);
      fetchMembers();
      fetchPendingMembers();
      fetchMemberStats();
      setMemberToConfirm(null);
    } catch (error) {
      console.error('Error confirming payment:', error);
      showAlert('error', 'Failed to confirm payment');
    } finally {
      setIsConfirming(false);
    }
  };

  const viewReceipt = (receiptPath, memberName) => {
    setSelectedReceipt({
      path: receiptPath,
      memberName: memberName
    });
    setShowReceiptModal(true);
  };

  const statsData = [
    {
      title: "Total Members",
      value: stats.totalMembers.toString(),
      change: "+12.5%",
      trend: "up",
      icon: FiUsers,
      color: "violet",
      description: "Active members",
    },
    {
      title: "Monthly Revenue",
      value: `$${(stats.monthlyRevenue / 1000).toFixed(1)}K`,
      change: "+23.4%",
      trend: "up",
      icon: FiDollarSign,
      color: "emerald",
      description: "From memberships",
    },
    {
      title: "Attendance Rate",
      value: `${stats.avgAttendance}%`,
      change: "+5.2%",
      trend: "up",
      icon: FiActivity,
      color: "blue",
      description: "Monthly average",
    },
    {
      title: "Retention Rate",
      value: `${stats.retentionRate}%`,
      change: "+8.7%",
      trend: "up",
      icon: FiHeart,
      color: "amber",
      description: "Last 3 months",
    },
  ];

  // Fetch gym instructors
  const fetchInstructors = async () => {
    try {
      setInstructorsLoading(true);
      // First get the gym details to get the gym ID
      const gymResponse = await api.getGymsByOwner();
      if (gymResponse.success && gymResponse.data.length > 0) {
        const gymId = gymResponse.data[0]._id;
        const response = await api.getGymInstructors(gymId);
        if (response.success) {
          setInstructors(response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      showAlert('Failed to fetch instructors', 'error');
    } finally {
      setInstructorsLoading(false);
    }
  };

  // -------------------------------
  // 2. Handle Assign/Update
  // -------------------------------
  const handleAssignInstructor = (member) => {
    setSelectedMember(member);
    setSelectedInstructor(member.assignedInstructor?._id || "");
    setShowAssignModal(true);
  };

  const confirmAssignment = async () => {
    if (!selectedInstructor) return;

    setIsUpdating(true);

    try {
      const response = await api.assignInstructorToMember(selectedMember._id, selectedInstructor);

      if (response.success) {
        // Refresh members list
        await fetchMembers();

        // Close modal and reset state
        setShowAssignModal(false);
        setSelectedMember(null);
        setSelectedInstructor("");

        showAlert('Instructor assigned successfully!', 'success');
      } else {
        throw new Error(response.message || 'Failed to assign instructor');
      }
    } catch (error) {
      console.error("Error assigning instructor:", error);
      showAlert(error.message || 'Failed to assign instructor', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this member?')) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/members/${memberId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete member');
      }

      showAlert('success', 'Member deleted successfully');
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      showAlert('error', 'Failed to delete member');
    }
  };

  // -------------------------------
  // 3. Pagination handlers
  // -------------------------------
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handle search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

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
          {/* Add Member Dropdown */}
          <div className="relative group">
            <button className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
              <FiPlus className="w-5 h-5 mr-2" />
              Add Member
              <FiChevronRight className="w-4 h-4 ml-2 transform group-hover:rotate-90 transition-transform" />
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <Link
                  to="/gym-owner/add-member"
                  className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <FiUserPlus className="w-5 h-5 mr-3 text-green-400" />
                  <div>
                    <div className="font-medium">Add New Member</div>
                    <div className="text-sm text-gray-400">Create new account & add to gym</div>
                  </div>
                </Link>
                <Link
                  to="/gym-owner/add-existing-member"
                  className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <FiSearch className="w-5 h-5 mr-3 text-violet-400" />
                  <div>
                    <div className="font-medium">Add Existing User</div>
                    <div className="text-sm text-gray-400">Search & add existing users</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
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

      {/* Pending Payments Section */}
      {pendingMembers.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-xl border border-yellow-500/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <FiAlertCircle className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Payment Verification Required</h2>
                <p className="text-gray-400">Members waiting for payment confirmation</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
              {pendingMembers.length} pending
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pendingLoading ? (
              <div className="col-span-full flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
              </div>
            ) : (
              pendingMembers.map((member) => (
                <div
                  key={member._id}
                  className="bg-gray-800/60 backdrop-blur-lg rounded-lg p-4 border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-semibold">
                        {member.firstName[0]}{member.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          {member.firstName} {member.lastName}
                        </h3>
                        <p className="text-sm text-gray-400">{member.email}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                      Pending
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-400 mb-4">
                    <div className="flex justify-between">
                      <span>Plan:</span>
                      <span className="text-white">{member.membershipPlan?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Joined:</span>
                      <span className="text-white">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="text-white">Bank Transfer</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {/* View Receipt Button - if receipt exists */}
                    <button
                      onClick={() => viewReceipt(member.paymentDetails?.receiptPath || 'sample-receipt', `${member.firstName} ${member.lastName}`)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FiEye className="w-4 h-4 mr-1" />
                      View Receipt
                    </button>
                    
                    {/* Confirm Payment Button */}
                    <button
                      onClick={() => showConfirmPaymentModal(member)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FiCreditCard className="w-4 h-4 mr-1" />
                      Confirm Payment
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

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
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-400">
                      No members found. Add your first member!
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                  <tr
                    key={member._id}
                    className="hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-semibold">
                          {member.firstName[0]}{member.lastName[0]}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {member.firstName} {member.lastName}
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
                        {member.phoneNumber}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm">
                        {member.membershipPlan.name}
                      </span>
                    </td>

                    {/* 
                      --- Instructor Cell ---
                      If a member has an instructor, we show a "Update Instructor" button.
                      Otherwise, we show "Assign Instructor" (only for active members).
                    */}
                    <td className="p-4">
                      {member.assignedInstructor ? (
                        <div>
                          <div className="text-sm text-gray-300">
                            {member.assignedInstructor.firstName} {member.assignedInstructor.lastName}
                          </div>
                          {member.status === "active" && (
                            <button
                              onClick={() => handleAssignInstructor(member)}
                              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                            >
                              Change
                            </button>
                          )}
                        </div>
                      ) : member.status === "active" ? (
                        <button
                          onClick={() => handleAssignInstructor(member)}
                          className="flex items-center text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          <FiUserPlus className="w-4 h-4 mr-1" />
                          Assign Instructor
                        </button>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          Only active members
                        </span>
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
                          to={`/gym-owner/members/${member._id}/progress`}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <FiBarChart2 className="w-5 h-5" />
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMember(member._id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                          <FiMoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
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
                Showing {members.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {Math.min(currentPage * itemsPerPage, pagination.totalMembers)} of{" "}
                {pagination.totalMembers} entries
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
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and one page around current page
                    if (
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
                  disabled={!pagination.hasNextPage}
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
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
          ) : members.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-400">
              No members found. Add your first member!
            </div>
          ) : (
            members.map((member) => (
            <div
              key={member._id}
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-violet-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-violet-500 flex items-center justify-center text-white font-semibold">
                    {member.firstName[0]}{member.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {member.firstName} {member.lastName}
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
                  <button 
                    onClick={() => handleDeleteMember(member._id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
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
                    {member.phoneNumber}
                  </div>
                  {member.address && (
                    <div className="flex items-center">
                      <FiMapPin className="w-4 h-4 mr-2 text-violet-400" />
                      {member.address}
                    </div>
                  )}
                  <div className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-2 text-violet-400" />
                    Last visit: {member.lastVisit ? new Date(member.lastVisit).toLocaleDateString() : 'Never'}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm">
                    {member.membershipPlan.name} Plan
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      member.paymentDetails?.paymentStatus === "paid"
                        ? "bg-green-500/10 text-green-400"
                        : member.paymentDetails?.paymentStatus === "pending"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {member.paymentDetails?.paymentStatus?.charAt(0).toUpperCase() +
                      member.paymentDetails?.paymentStatus?.slice(1)}
                  </span>
                </div>

                {/* Instructor Assignment */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Assigned Instructor</span>
                    {member.assignedInstructor ? (
                      member.status === "active" ? (
                        <button
                          onClick={() => handleAssignInstructor(member)}
                          className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          <FiUserCheck className="w-4 h-4 mr-1" />
                          Update Instructor
                        </button>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          Only active members
                        </span>
                      )
                    ) : member.status === "active" ? (
                      <button
                        onClick={() => handleAssignInstructor(member)}
                        className="flex items-center text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        <FiUserPlus className="w-4 h-4 mr-1" />
                        Assign Instructor
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        Only active members
                      </span>
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
                  {member.fitnessGoals?.map((goal, index) => (
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
                    to={`/gym-owner/members/${member._id}/progress`}
                    className="flex items-center justify-center px-4 py-2 bg-violet-600/20 text-violet-400 rounded-lg hover:bg-violet-600/30 transition-colors"
                  >
                    <FiBarChart2 className="w-4 h-4 mr-2" />
                    View Progress
                  </Link>
                  <Link
                    to={`/gym-owner/members/${member._id}/details`}
                    className="flex items-center justify-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          )))}
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
                  {selectedMember.assignedInstructor ? "Update" : "Assign"} Instructor
                  for {selectedMember.firstName} {selectedMember.lastName}
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
                {selectedMember.assignedInstructor && (
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">
                      Current Instructor
                    </div>
                    <div className="text-white">
                      {selectedMember.assignedInstructor.firstName} {selectedMember.assignedInstructor.lastName}
                    </div>
                  </div>
                )}

                {/* Instructor Selection */}
                <div className="grid grid-cols-1 gap-4">
                  {instructorsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-600 mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading instructors...</p>
                    </div>
                  ) : instructors.length === 0 ? (
                    <div className="text-center py-8 bg-gray-900/50 rounded-lg border border-gray-700">
                      <FiUsers className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h4 className="text-gray-300 font-medium mb-2">No Instructors Available</h4>
                      <p className="text-gray-400 text-sm">Add instructors to your gym to assign them to members</p>
                    </div>
                  ) : (
                    instructors.map((gymInstructor) => (
                      <label
                        key={gymInstructor._id}
                        className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                          selectedInstructor === gymInstructor.instructor?._id
                            ? "bg-violet-500/10 border-violet-500"
                            : "bg-gray-900/50 border-gray-700 hover:bg-gray-800/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="instructor"
                          value={gymInstructor.instructor?._id || ''}
                          checked={selectedInstructor === gymInstructor.instructor?._id}
                          onChange={(e) => setSelectedInstructor(e.target.value)}
                          className="hidden"
                        />
                        <div className="flex items-center space-x-4 flex-1">
                          <img
                            src={`https://ui-avatars.com/api/?name=${gymInstructor.instructor?.firstName || 'Unknown'}+${gymInstructor.instructor?.lastName || 'User'}&background=8b5cf6&color=fff&size=150`}
                            alt={`${gymInstructor.instructor?.firstName || 'Unknown'} ${gymInstructor.instructor?.lastName || 'User'}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-medium">
                                {gymInstructor.instructor?.firstName || 'Unknown'} {gymInstructor.instructor?.lastName || 'User'}
                              </h4>
                              <div className="flex items-center">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  gymInstructor.isActive 
                                    ? 'bg-green-500/10 text-green-400' 
                                    : 'bg-red-500/10 text-red-400'
                                }`}>
                                  {gymInstructor.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                            <p className="text-violet-400 text-sm">
                              {gymInstructor.specialization || 'General Fitness'}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                              <span>{gymInstructor.instructor?.experience || 0} years experience</span>
                              <span>
                                Added: {new Date(gymInstructor.addedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))
                  )}
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

      {/* Receipt Viewing Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            {/* Modal Overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowReceiptModal(false)}
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            {/* Modal Content */}
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Payment Receipt Verification
                  </h3>
                  <p className="text-gray-400 mt-1">
                    Member: {selectedReceipt.memberName}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowReceiptModal(false);
                    setSelectedReceipt(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Receipt Display Area */}
              <div className="bg-gray-900/50 rounded-lg p-4 mb-6 min-h-[400px] max-h-[600px] overflow-auto">
                {selectedReceipt.path && selectedReceipt.path !== 'sample-receipt' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    {selectedReceipt.path.endsWith('.pdf') ? (
                      <iframe
                        src={selectedReceipt.path.startsWith('http') 
                          ? selectedReceipt.path 
                          : `${import.meta.env.VITE_SERVER_URL}/${selectedReceipt.path}`}
                        className="w-full h-[500px] rounded-lg"
                        title="Payment Receipt"
                      />
                    ) : (
                      <img
                        src={selectedReceipt.path.startsWith('http') 
                          ? selectedReceipt.path 
                          : `${import.meta.env.VITE_SERVER_URL}/${selectedReceipt.path}`}
                        alt="Payment Receipt"
                        className="max-w-full h-auto rounded-lg"
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                    <FiAlertCircle className="w-16 h-16 mb-4" />
                    <p className="text-lg">Sample Receipt</p>
                    <p className="text-sm mt-2">No receipt uploaded for this member</p>
                    <div className="mt-8 p-6 bg-gray-800 rounded-lg max-w-md">
                      <h4 className="text-white font-semibold mb-3">Bank Transfer Details (Sample)</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Date:</span>
                          <span className="text-white">{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Amount:</span>
                          <span className="text-white">LKR 5,000.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Reference:</span>
                          <span className="text-white">TRX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Bank:</span>
                          <span className="text-white">Commercial Bank</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Verification Actions */}
              <div className="bg-gray-900/30 rounded-lg p-4 mb-4">
                <h4 className="text-white font-medium mb-3">Verification Checklist</h4>
                <div className="space-y-2">
                  <label className="flex items-center text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" className="mr-3 w-4 h-4 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500" />
                    Amount matches the membership fee
                  </label>
                  <label className="flex items-center text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" className="mr-3 w-4 h-4 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500" />
                    Transaction date is recent
                  </label>
                  <label className="flex items-center text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" className="mr-3 w-4 h-4 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500" />
                    Reference number is valid
                  </label>
                  <label className="flex items-center text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" className="mr-3 w-4 h-4 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500" />
                    Bank account details match
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    window.open(`${import.meta.env.VITE_SERVER_URL}/${selectedReceipt.path}`, '_blank');
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <FiEye className="w-4 h-4 mr-2" />
                  Open in New Tab
                </button>
                <button
                  onClick={() => {
                    setShowReceiptModal(false);
                    setSelectedReceipt(null);
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Beautiful Payment Confirmation Modal */}
      {showConfirmModal && memberToConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            {/* Enhanced Modal Overlay with Blur */}
            <div
              className="fixed inset-0 transition-all duration-300"
              aria-hidden="true"
              onClick={() => !isConfirming && setShowConfirmModal(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 via-purple-900/50 to-indigo-900/50 backdrop-blur-sm"></div>
            </div>

            {/* Beautiful Modal Content */}
            <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 shadow-2xl rounded-3xl border border-violet-500/20">
              
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 animate-pulse"></div>
              </div>
              
              {/* Success Icon with Animation */}
              <div className="relative flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <FiCreditCard className="w-10 h-10 text-white animate-pulse" />
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full opacity-30 animate-ping"></div>
                </div>
              </div>

              {/* Title with Gradient Text */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                  🎉 Confirm Payment
                </h3>
                <p className="text-gray-300 text-sm">
                  You're about to activate this member's premium experience
                </p>
              </div>

              {/* Member Information Card */}
              <div className="bg-gradient-to-r from-violet-900/30 via-purple-900/30 to-indigo-900/30 rounded-2xl p-4 mb-6 border border-violet-500/20">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {memberToConfirm.firstName.charAt(0)}{memberToConfirm.lastName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg">
                      {memberToConfirm.firstName} {memberToConfirm.lastName}
                    </h4>
                    <p className="text-gray-400 text-sm">{memberToConfirm.email}</p>
                    <p className="text-emerald-400 text-sm font-medium">
                      💰 {memberToConfirm.membershipPlan?.name} Plan
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirmation Benefits */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <FiStar className="w-4 h-4 mr-2 text-yellow-400" />
                  What happens next:
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    Member status will be activated immediately
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
                    Welcome notification sent to customer
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse"></div>
                    Full gym access granted
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isConfirming}
                  className="flex-1 px-4 py-3 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-600/50 transition-all duration-300 font-medium disabled:opacity-50 border border-gray-600/50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPayment}
                  disabled={isConfirming}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
                >
                  {isConfirming ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Confirming...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FiCheck className="w-5 h-5 mr-2" />
                      Confirm Payment
                    </div>
                  )}
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => !isConfirming && setShowConfirmModal(false)}
                disabled={isConfirming}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-700/50 disabled:opacity-50"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Members;
