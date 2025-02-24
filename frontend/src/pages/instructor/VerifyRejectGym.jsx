import { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiCheck,
  FiX,
  FiMapPin,
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiClock,
  FiStar,
  FiMail,
  FiPhone,
  FiGlobe,
  FiInstagram,
  FiMessageSquare,
} from "react-icons/fi";

function VerifyRejectGym() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedGym, setSelectedGym] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample data for gym requests
  const gymRequests = [
    {
      id: 1,
      name: "FitZone Elite",
      email: "info@fitzone.com",
      phone: "(555) 123-4567",
      location: "123 Fitness Street, San Francisco, CA",
      description:
        "Premier fitness facility with state-of-the-art equipment and expert trainers.",
      memberCount: "500+",
      instructorCount: 24,
      facilities: [
        "Cardio Equipment",
        "Weight Training",
        "Personal Training",
        "Yoga Studio",
      ],
      classes: ["Morning Yoga", "HIIT", "Strength Training"],
      rating: 4.8,
      reviews: 245,
      requestDate: "2024-03-01",
      proposedSalary: "$45-60/hr",
      benefits: [
        "Health Insurance",
        "401k",
        "Flexible Schedule",
        "Professional Development",
      ],
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80",
      website: "https://fitzone.com",
      social: {
        instagram: "fitzone",
      },
      message:
        "We would love to have you join our team of expert trainers. Your expertise in yoga would be a perfect fit for our morning and evening classes.",
      status: "pending",
    },
    {
      id: 2,
      name: "PowerFlex Gym",
      email: "info@powerflex.com",
      phone: "(555) 234-5678",
      location: "456 Strength Ave, Los Angeles, CA",
      description:
        "Specialized strength and conditioning facility focused on performance.",
      memberCount: "350+",
      instructorCount: 18,
      facilities: ["CrossFit", "Olympic Lifting", "Group Classes", "Spa"],
      classes: ["CrossFit WOD", "Powerlifting", "Olympic Lifting"],
      rating: 4.6,
      reviews: 189,
      requestDate: "2024-03-02",
      proposedSalary: "$50-70/hr",
      benefits: [
        "Performance Bonuses",
        "Equipment Allowance",
        "Continuing Education",
      ],
      image:
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80",
      website: "https://powerflex.com",
      social: {
        instagram: "powerflex",
      },
      message:
        "Your strength training background aligns perfectly with our facility's focus. We offer competitive compensation and opportunities for growth.",
      status: "pending",
    },
  ];

  const handleApprove = async (gymId) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    console.log("Approving gym:", gymId);
  };

  const handleReject = async (gymId) => {
    if (!rejectReason.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowRejectModal(false);
    setRejectReason("");
    setSelectedGym(null);
    console.log("Rejecting gym:", gymId, "Reason:", rejectReason);
  };

  const filteredRequests = gymRequests.filter((gym) => {
    const matchesSearch =
      gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || gym.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Gym Requests
          </h1>
          <p className="text-gray-400 mt-1">
            Review and manage gym join requests
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-4 top-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search gyms..."
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
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 text-gray-400 rounded-lg hover:text-white transition-colors">
              <FiFilter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Gym Requests */}
      <div className="space-y-6">
        {filteredRequests.map((gym) => (
          <div
            key={gym.id}
            className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 rounded-xl overflow-hidden">
                  <img
                    src={gym.image}
                    alt={gym.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {gym.name}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-white">{gym.rating}</span>
                      <span className="text-gray-400 text-sm ml-1">
                        ({gym.reviews} reviews)
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center text-gray-400">
                      <FiMapPin className="w-4 h-4 mr-1" />
                      {gym.location}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleApprove(gym.id)}
                  className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
                >
                  <FiCheck className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedGym(gym);
                    setShowRejectModal(true);
                  }}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <FiUsers className="w-5 h-5 text-violet-400" />
                  <span className="text-xl font-bold text-white">
                    {gym.memberCount}
                  </span>
                </div>
                <span className="text-sm text-gray-400">Members</span>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <FiActivity className="w-5 h-5 text-violet-400" />
                  <span className="text-xl font-bold text-white">
                    {gym.instructorCount}
                  </span>
                </div>
                <span className="text-sm text-gray-400">Instructors</span>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <FiDollarSign className="w-5 h-5 text-violet-400" />
                  <span className="text-xl font-bold text-white">
                    {gym.proposedSalary}
                  </span>
                </div>
                <span className="text-sm text-gray-400">Proposed Rate</span>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <FiClock className="w-5 h-5 text-violet-400" />
                  <span className="text-xl font-bold text-white">
                    {new Date(gym.requestDate).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-sm text-gray-400">Request Date</span>
              </div>
            </div>

            {/* Description & Message */}
            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">About the Gym</h4>
                <p className="text-gray-400">{gym.description}</p>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Message</h4>
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FiMessageSquare className="w-4 h-4 text-violet-400 mr-2" />
                    <span className="text-gray-400">From Gym Management</span>
                  </div>
                  <p className="text-gray-300">{gym.message}</p>
                </div>
              </div>
            </div>

            {/* Facilities & Classes */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-2">Facilities</h4>
                <div className="flex flex-wrap gap-2">
                  {gym.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Classes</h4>
                <div className="flex flex-wrap gap-2">
                  {gym.classes.map((className, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-900/50 text-gray-300 rounded-full text-sm"
                    >
                      {className}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-6">
              <h4 className="text-white font-medium mb-2">Benefits</h4>
              <div className="flex flex-wrap gap-2">
                {gym.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact & Social */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center text-gray-400">
                  <FiMail className="w-4 h-4 mr-2 text-violet-400" />
                  {gym.email}
                </div>
                <div className="flex items-center text-gray-400">
                  <FiPhone className="w-4 h-4 mr-2 text-violet-400" />
                  {gym.phone}
                </div>
                <div className="flex items-center text-gray-400">
                  <FiGlobe className="w-4 h-4 mr-2 text-violet-400" />
                  <a
                    href={gym.website}
                    className="hover:text-violet-400 transition-colors"
                  >
                    {gym.website.replace("https://", "")}
                  </a>
                </div>
              </div>
              <div className="space-y-2">
                {gym.social.instagram && (
                  <div className="flex items-center text-gray-400">
                    <FiInstagram className="w-4 h-4 mr-2 text-violet-400" />
                    <a
                      href={`https://instagram.com/${gym.social.instagram}`}
                      className="hover:text-violet-400 transition-colors"
                    >
                      @{gym.social.instagram}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedGym && (
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
                Reject Request from {selectedGym.name}
              </h3>

              <div className="mt-4">
                <label className="block text-gray-400 mb-2">
                  Reason for Rejection
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  rows="4"
                  placeholder="Please provide a reason for rejection..."
                ></textarea>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason("");
                    setSelectedGym(null);
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedGym.id)}
                  disabled={!rejectReason.trim() || isSubmitting}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
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
                      <span>Rejecting...</span>
                    </>
                  ) : (
                    <>
                      <FiX className="w-5 h-5" />
                      <span>Reject Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyRejectGym;
