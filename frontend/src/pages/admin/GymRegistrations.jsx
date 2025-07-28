import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiCheck,
  FiX,
  FiEye,
  FiMoreVertical,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
  FiMail,
  FiPhone,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi";
import axios from "axios";
import { useAlert } from "../../contexts/AlertContext";

function GymRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const { showAlert } = useAlert();

  const statusOptions = [
    { value: "all", label: "All Status", color: "gray" },
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "approved", label: "Approved", color: "green" },
    { value: "rejected", label: "Rejected", color: "red" },
  ];

  const stats = [
    {
      title: "Pending Registrations",
      value: registrations.filter(r => r.status === 'pending').length,
      icon: FiClock,
      color: "yellow",
    },
    {
      title: "Approved This Month",
      value: registrations.filter(r => r.status === 'approved').length,
      icon: FiCheckCircle,
      color: "green",
    },
    {
      title: "Rejected This Month",
      value: registrations.filter(r => r.status === 'rejected').length,
      icon: FiXCircle,
      color: "red",
    },
    {
      title: "Total Applications",
      value: registrations.length,
      icon: FiMapPin,
      color: "violet",
    },
  ];

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/gyms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistrations(response.data.data || []);
    } catch (error) {
      showAlert('error', 'Failed to fetch gym registrations');
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (gymId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/gyms/${gymId}/approve`,
        { adminNotes: 'Gym registration approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showAlert('success', 'Gym registration approved successfully! User role updated to Gym Owner.');
        fetchRegistrations();
        setShowDetailsModal(false);
      }
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'Failed to approve gym');
      console.error('Error approving gym:', error);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      showAlert('error', 'Please provide a reason for rejection');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/gyms/${selectedRegistration._id}/reject`,
        { adminNotes: rejectReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showAlert('success', 'Gym registration rejected');
        fetchRegistrations();
        setShowRejectModal(false);
        setShowDetailsModal(false);
        setRejectReason('');
      }
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'Failed to reject gym');
      console.error('Error rejecting gym:', error);
    }
  };

  const filteredRegistrations = registrations.filter((registration) => {
    const matchesSearch =
      registration.gymName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.owner?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.address?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || registration.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalItems = filteredRegistrations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRegistrations = filteredRegistrations.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-500/10", text: "text-yellow-400", icon: FiClock },
      approved: { bg: "bg-green-500/10", text: "text-green-400", icon: FiCheckCircle },
      rejected: { bg: "bg-red-500/10", text: "text-red-400", icon: FiXCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4 mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Gym Registrations
          </h1>
          <p className="text-gray-400 mt-1">Review and approve gym registration applications</p>
        </div>
        <button
          onClick={fetchRegistrations}
          className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <FiRefreshCw className="w-5 h-5 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-500/10`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-2">{stat.title}</h3>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by gym name, email, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              />
            </div>
          </div>

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

      {/* Registrations Table */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left p-4 text-gray-400 font-medium">Gym Details</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Owner</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Location</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Applied On</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {currentRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-400">
                        No gym registrations found
                      </td>
                    </tr>
                  ) : (
                    currentRegistrations.map((registration) => (
                    <tr key={registration._id} className="hover:bg-gray-700/20 transition-colors">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-white">{registration.gymName}</div>
                          <div className="text-sm text-gray-400 mt-1">
                            Capacity: {registration.capacity} members
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="text-gray-300">
                            {registration.owner?.firstName || 'N/A'} {registration.owner?.lastName || ''}
                          </div>
                          <div className="text-sm text-gray-400">{registration.owner?.email || 'N/A'}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Role: <span className="capitalize">{registration.owner?.role || 'customer'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-gray-300">
                          <FiMapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {registration.address?.city}, {registration.address?.state}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-gray-300">
                          <FiCalendar className="w-4 h-4 mr-1 text-gray-400" />
                          {new Date(registration.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(registration.status)}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => {
                              setSelectedRegistration(registration);
                              setShowDetailsModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            title="View Details"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          {registration.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(registration._id)}
                                className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                                title="Approve"
                              >
                                <FiCheck className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedRegistration(registration);
                                  setShowRejectModal(true);
                                }}
                                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                title="Reject"
                              >
                                <FiX className="w-5 h-5" />
                              </button>
                            </>
                          )}
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
                  Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
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
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
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
                      } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
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
          </>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">Gym Registration Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Gym Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Gym Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Gym Name</label>
                    <p className="text-white">{selectedRegistration.gymName}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Capacity</label>
                    <p className="text-white">{selectedRegistration.capacity} members</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Established Year</label>
                    <p className="text-white">{selectedRegistration.establishedYear || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Status</label>
                    <p className="text-white capitalize">{selectedRegistration.status}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Verification Status</label>
                    <p className="text-white capitalize">{selectedRegistration.verificationStatus || 'unverified'}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Active</label>
                    <p className="text-white">{selectedRegistration.isActive ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-gray-400 text-sm">Description</label>
                    <p className="text-white">{selectedRegistration.description}</p>
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Owner Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Name</label>
                    <p className="text-white">
                      {selectedRegistration.owner?.firstName || 'N/A'} {selectedRegistration.owner?.lastName || ''}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Email</label>
                    <p className="text-white">{selectedRegistration.owner?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Current Role</label>
                    <p className="text-white capitalize">{selectedRegistration.owner?.role || 'customer'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Email</label>
                    <p className="text-white">{selectedRegistration.contactInfo?.email}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Phone</label>
                    <p className="text-white">{selectedRegistration.contactInfo?.phone}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Website</label>
                    <p className="text-white">
                      {selectedRegistration.contactInfo?.website ? (
                        <a 
                          href={selectedRegistration.contactInfo.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          {selectedRegistration.contactInfo.website}
                        </a>
                      ) : 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-gray-400 text-sm">Full Address</label>
                    <p className="text-white">
                      {selectedRegistration.address?.street}, {selectedRegistration.address?.city},{" "}
                      {selectedRegistration.address?.state} {selectedRegistration.address?.zipCode}, {selectedRegistration.address?.country}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Coordinates</label>
                    <p className="text-white">
                      {selectedRegistration.location?.coordinates ? 
                        `Lat: ${selectedRegistration.location.coordinates[1]}, Lng: ${selectedRegistration.location.coordinates[0]}`
                        : 'Not provided'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Facilities & Services */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Facilities</h3>
                  {selectedRegistration.facilities && selectedRegistration.facilities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedRegistration.facilities.map((facility, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No facilities listed</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Services</h3>
                  {selectedRegistration.services && selectedRegistration.services.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedRegistration.services.map((service, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No services listed</p>
                  )}
                </div>
              </div>

              {/* Amenities */}
              {selectedRegistration.amenities && selectedRegistration.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRegistration.amenities.map((amenity, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment */}
              {selectedRegistration.equipment && selectedRegistration.equipment.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Equipment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedRegistration.equipment.map((item, index) => (
                      <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                        <p className="text-white font-medium">{item.name}</p>
                        <div className="text-sm text-gray-400">
                          Qty: {item.quantity || 1} | Condition: {item.condition || 'good'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Operating Hours */}
              {selectedRegistration.operatingHours && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Operating Hours</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(selectedRegistration.operatingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between items-center bg-gray-700/50 rounded-lg p-3">
                        <span className="text-white capitalize font-medium">{day}</span>
                        <span className="text-gray-300">
                          {hours?.closed ? 'Closed' : 
                           hours?.open && hours?.close ? `${hours.open} - ${hours.close}` : 'Not set'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing */}
              {selectedRegistration.pricing && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Pricing</h3>
                  <div className="space-y-3">
                    {selectedRegistration.pricing.membershipPlans && selectedRegistration.pricing.membershipPlans.length > 0 && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Membership Plans</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedRegistration.pricing.membershipPlans.map((plan, index) => (
                            <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="text-white font-medium">{plan.name}</h5>
                                <span className="text-green-400 font-bold">Rs. {plan.price}</span>
                              </div>
                              <p className="text-gray-400 text-sm mb-2 capitalize">{plan.duration}</p>
                              {plan.benefits && plan.benefits.length > 0 && (
                                <div>
                                  <p className="text-gray-400 text-xs mb-1">Benefits:</p>
                                  <ul className="text-gray-300 text-xs list-disc list-inside">
                                    {plan.benefits.map((benefit, idx) => (
                                      <li key={idx}>{benefit}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedRegistration.pricing.dropInFee && (
                      <div>
                        <h4 className="text-white font-medium">Drop-in Fee</h4>
                        <p className="text-green-400 font-bold">Rs. {selectedRegistration.pricing.dropInFee}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Special Programs */}
              {selectedRegistration.specialPrograms && selectedRegistration.specialPrograms.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Special Programs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedRegistration.specialPrograms.map((program, index) => (
                      <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="text-white font-medium">{program.name}</h5>
                          {program.price && <span className="text-green-400 font-bold">Rs. {program.price}</span>}
                        </div>
                        {program.description && <p className="text-gray-400 text-sm mb-1">{program.description}</p>}
                        {program.duration && <p className="text-gray-400 text-xs">Duration: {program.duration}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {selectedRegistration.certifications && selectedRegistration.certifications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Certifications</h3>
                  <div className="space-y-2">
                    {selectedRegistration.certifications.map((cert, index) => (
                      <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-medium">{cert.name}</p>
                            {cert.issuedBy && <p className="text-gray-400 text-sm">Issued by: {cert.issuedBy}</p>}
                          </div>
                          <div className="text-right">
                            {cert.issuedDate && (
                              <p className="text-gray-400 text-xs">
                                Issued: {new Date(cert.issuedDate).toLocaleDateString()}
                              </p>
                            )}
                            {cert.expiryDate && (
                              <p className="text-gray-400 text-xs">
                                Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Media */}
              {selectedRegistration.socialMedia && Object.values(selectedRegistration.socialMedia).some(val => val) && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Social Media</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(selectedRegistration.socialMedia).map(([platform, url]) => 
                      url ? (
                        <a 
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-700/50 rounded-lg p-3 text-center hover:bg-gray-700 transition-colors"
                        >
                          <p className="text-white capitalize font-medium">{platform}</p>
                          <p className="text-blue-400 text-xs truncate">{url}</p>
                        </a>
                      ) : null
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedRegistration.tags && selectedRegistration.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRegistration.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Images */}
              {selectedRegistration.images && selectedRegistration.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedRegistration.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={image.url} 
                          alt={image.caption || `Gym image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        {image.isPrimary && (
                          <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded">
                            Primary
                          </span>
                        )}
                        {image.caption && (
                          <p className="text-gray-400 text-xs mt-1 truncate">{image.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Logo */}
              {selectedRegistration.logo && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Logo</h3>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={selectedRegistration.logo.url} 
                      alt="Gym Logo"
                      className="w-20 h-20 object-contain bg-white rounded-lg p-2"
                    />
                    <div className="text-gray-400 text-sm">
                      <p>Format: {selectedRegistration.logo.format}</p>
                      <p>Size: {Math.round(selectedRegistration.logo.size / 1024)} KB</p>
                      <p>Dimensions: {selectedRegistration.logo.width}x{selectedRegistration.logo.height}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rating */}
              {selectedRegistration.rating && selectedRegistration.rating.totalReviews > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Rating</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-2xl font-bold">
                        {selectedRegistration.rating.average.toFixed(1)}
                      </span>
                      <span className="text-yellow-400 ml-1">★</span>
                    </div>
                    <span className="text-gray-400">
                      ({selectedRegistration.rating.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Registration Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Applied On</label>
                    <p className="text-white">{new Date(selectedRegistration.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Last Updated</label>
                    <p className="text-white">{new Date(selectedRegistration.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              {selectedRegistration.adminNotes && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Admin Notes</h3>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-300">{selectedRegistration.adminNotes}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedRegistration.status === 'pending' && (
                <div className="flex gap-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleApprove(selectedRegistration._id)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <FiCheckCircle className="w-5 h-5 mr-2" />
                    Approve & Update Role
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    <FiXCircle className="w-5 h-5 mr-2" />
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">Reject Gym Registration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Reason for Rejection</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none resize-none"
                  rows="4"
                  placeholder="Enter reason for rejection..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GymRegistrations;