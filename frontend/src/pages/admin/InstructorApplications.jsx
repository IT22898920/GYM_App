import { useState } from "react";
import {
  FiSearch,
  FiCheck,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiAward,
  FiDownload,
  FiEye,
  FiMessageSquare,
  FiActivity,
  FiClock,
  FiMapPin,
} from "react-icons/fi";

function InstructorApplications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Sample data - replace with actual data from your backend
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
      profileImage: "https://i.pravatar.cc/150?img=1",
      status: "pending",
      motivation:
        "I am passionate about helping others achieve their fitness goals and have been working in the fitness industry for over 5 years. I specialize in strength training and have helped numerous clients transform their lives through proper exercise and nutrition guidance. My approach combines scientific principles with practical experience to deliver results-driven training programs.",
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
      profileImage: "https://i.pravatar.cc/150?img=2",
      status: "pending",
      motivation:
        "With 8 years of experience teaching yoga, I've developed a unique approach that combines traditional practices with modern wellness principles. I'm excited to bring my expertise to your platform and help members achieve both physical and mental well-being. My teaching philosophy emphasizes mindfulness, proper alignment, and personalized attention to each student's needs.",
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

  const filteredApplications = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Search and Filters */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-4 top-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredApplications.map((application) => (
          <div
            key={application.id}
            className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img
                      src={application.profileImage}
                      alt={application.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
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
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-400">
                    <FiAward className="w-4 h-4 mr-2 text-violet-400" />
                    {application.experience} of experience
                  </div>
                  <div className="flex items-center text-gray-400">
                    <FiDownload className="w-4 h-4 mr-2 text-violet-400" />
                    <button className="text-violet-400 hover:text-violet-300 transition-colors">
                      Download Resume
                    </button>
                  </div>
                </div>
              </div>

              {/* Specialization & Experience */}
              <div className="mt-6">
                <h4 className="text-white font-medium mb-4 flex items-center">
                  <FiActivity className="w-5 h-5 mr-2 text-violet-400" />
                  Specialization & Experience
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900/50 rounded-lg p-4">
                  <div>
                    <h5 className="text-gray-300 font-medium mb-2">
                      Primary Focus
                    </h5>
                    <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm">
                      {application.specialization}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-gray-300 font-medium mb-2">
                      Certifications
                    </h5>
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
                </div>
              </div>

              {/* Availability & Location */}
              <div className="mt-6">
                <h4 className="text-white font-medium mb-4 flex items-center">
                  <FiClock className="w-5 h-5 mr-2 text-violet-400" />
                  Availability & Location
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900/50 rounded-lg p-4">
                  <div>
                    <h5 className="text-gray-300 font-medium mb-2">
                      Available Times
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {application.availability.map((time, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-gray-300 font-medium mb-2">
                      Location & Type
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-400">
                        <FiMapPin className="w-4 h-4 mr-2 text-violet-400" />
                        {application.preferredLocation}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <FiUser className="w-4 h-4 mr-2 text-violet-400" />
                        {application.isFreelance
                          ? "Freelance Instructor"
                          : "Full-time Instructor"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivation */}
              <div className="mt-6">
                <h4 className="text-white font-medium mb-4 flex items-center">
                  <FiMessageSquare className="w-5 h-5 mr-2 text-violet-400" />
                  Why They Want to Join Our Team
                </h4>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-400 leading-relaxed">
                    {application.motivation}
                  </p>
                </div>
              </div>
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

export default InstructorApplications;
