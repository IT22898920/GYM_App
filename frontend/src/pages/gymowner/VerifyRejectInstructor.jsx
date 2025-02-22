import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiCheck,
  FiX,
  FiActivity,
  FiDownload,
  FiEye,
  FiMessageSquare,
  FiStar,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiAward,
} from "react-icons/fi";

function VerifyRejectInstructor() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Sample data for instructor applications
  const applications = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      specialization: "Strength Training",
      experience: "5 years",
      availability: [
        "Weekday Mornings",
        "Weekday Evenings",
        "Weekend Afternoons",
      ],
      preferredLocation: "Downtown Center",
      isFreelance: true,
      certifications: [
        "NASM Certified Personal Trainer",
        "CrossFit Level 2 Trainer",
      ],
      applicationDate: "2024-03-01",
      resume: "john-smith-resume.pdf",
      coverLetter:
        "I am passionate about helping others achieve their fitness goals and have been working in the fitness industry for over 5 years. I specialize in strength training and have helped numerous clients transform their lives through proper exercise and nutrition guidance.",
      status: "pending",
      profileImage: "https://i.pravatar.cc/150?img=1",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 2,
      name: "Sarah Chen",
      email: "sarah@example.com",
      phone: "+1 (555) 234-5678",
      specialization: "Yoga",
      experience: "8 years",
      availability: [
        "Weekday Mornings",
        "Weekend Mornings",
        "Weekend Afternoons",
      ],
      preferredLocation: "Uptown Studio",
      isFreelance: false,
      certifications: [
        "RYT 500 Certified Yoga Instructor",
        "Meditation Teacher Training",
      ],
      applicationDate: "2024-03-02",
      resume: "sarah-chen-resume.pdf",
      coverLetter:
        "With 8 years of experience teaching yoga, I've developed a unique approach that combines traditional practices with modern wellness principles. I'm excited to bring my expertise to your platform and help members achieve both physical and mental well-being.",
      status: "pending",
      profileImage: "https://i.pravatar.cc/150?img=2",
      rating: 4.9,
      reviews: 156,
    },
  ];

  const handleApprove = (applicationId) => {
    // Handle application approval
    console.log("Approving application:", applicationId);
  };

  const handleReject = (applicationId) => {
    // Handle application rejection
    console.log(
      "Rejecting application:",
      applicationId,
      "Reason:",
      rejectReason
    );
    setShowRejectModal(false);
    setRejectReason("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Instructor Applications
          </h1>
          <p className="text-gray-400 mt-1">
            Review and manage instructor applications
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiUser className="absolute left-4 top-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              />
            </div>
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {applications.map((application) => (
          <div
            key={application.id}
            className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img
                    src={application.profileImage}
                    alt={application.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {application.name}
                  </h3>
                  <p className="text-violet-400">
                    {application.specialization}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleApprove(application.id)}
                  className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
                >
                  <FiCheck className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedApplication(application.id);
                    setShowRejectModal(true);
                  }}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-400">
                  <FiMail className="w-4 h-4 mr-2 text-violet-400" />
                  {application.email}
                </div>
                <div className="flex items-center text-gray-400">
                  <FiPhone className="w-4 h-4 mr-2 text-violet-400" />
                  {application.phone}
                </div>
                <div className="flex items-center text-gray-400">
                  <FiCalendar className="w-4 h-4 mr-2 text-violet-400" />
                  Applied on{" "}
                  {new Date(application.applicationDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-400">
                  <FiStar className="w-4 h-4 mr-2 text-yellow-400" />
                  {application.rating} ({application.reviews} reviews)
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-400">
                  <FiAward className="w-4 h-4 mr-2 text-violet-400" />
                  {application.experience} of experience
                </div>
                <div className="flex items-center text-gray-400">
                  <FiMapPin className="w-4 h-4 mr-2 text-violet-400" />
                  {application.preferredLocation}
                </div>
                <div className="flex items-center text-gray-400">
                  <FiClock className="w-4 h-4 mr-2 text-violet-400" />
                  {application.availability.join(", ")}
                </div>
                <div className="flex items-center text-gray-400">
                  <FiDollarSign className="w-4 h-4 mr-2 text-violet-400" />
                  {application.isFreelance
                    ? "Freelance Instructor"
                    : "Full-time Instructor"}
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="mt-6">
              <h4 className="text-white font-medium mb-4">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {application.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Cover Letter */}
            <div className="mt-6">
              <h4 className="text-white font-medium mb-4">Cover Letter</h4>
              <p className="text-gray-400">{application.coverLetter}</p>
            </div>

            {/* Resume */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center text-gray-400">
                <FiDownload className="w-4 h-4 mr-2 text-violet-400" />
                <span>Resume: {application.resume}</span>
              </div>
              <button className="text-violet-400 hover:text-violet-300 transition-colors">
                Download Resume
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
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
                Reject Application
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
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedApplication)}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  Reject Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyRejectInstructor;
