import { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiUser,
  FiActivity,
  FiClock,
  FiMapPin,
  FiMail,
  FiPhone,
  FiCheck,
  FiX,
  FiSend,
  FiAward,
  FiCalendar,
} from "react-icons/fi";

function ApplyToInstructor() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample data for instructors
  const instructors = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 123-4567",
      specialization: "Yoga",
      experience: "8 years",
      rating: 4.9,
      reviews: 156,
      location: "San Francisco, CA",
      availability: ["Morning", "Evening"],
      certifications: [
        "RYT 500 Certified Yoga Instructor",
        "Meditation Teacher Training",
      ],
      image: "https://i.pravatar.cc/150?img=1",
      status: "available",
      classes: ["Vinyasa Flow", "Power Yoga", "Meditation"],
      achievements: ["Instructor of the Year 2023", "500+ Classes Taught"],
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike@example.com",
      phone: "+1 (555) 234-5678",
      specialization: "Strength Training",
      experience: "5 years",
      rating: 4.8,
      reviews: 124,
      location: "Los Angeles, CA",
      availability: ["Afternoon", "Evening"],
      certifications: [
        "NASM Certified Personal Trainer",
        "CrossFit Level 2 Trainer",
      ],
      image: "https://i.pravatar.cc/150?img=2",
      status: "available",
      classes: ["Strength Basics", "HIIT", "CrossFit"],
      achievements: [
        "Best Personal Trainer 2023",
        "Client Transformation Award",
      ],
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      email: "emma@example.com",
      phone: "+1 (555) 345-6789",
      specialization: "HIIT",
      experience: "6 years",
      rating: 4.7,
      reviews: 98,
      location: "New York, NY",
      availability: ["Morning", "Afternoon"],
      certifications: [
        "ACE Certified Personal Trainer",
        "TRX Suspension Training",
      ],
      image: "https://i.pravatar.cc/150?img=3",
      status: "available",
      classes: ["HIIT Blast", "Core Conditioning", "Circuit Training"],
      achievements: [
        "Most Innovative Trainer 2023",
        "300+ Client Success Stories",
      ],
    },
  ];

  const specializations = [
    "All",
    "Yoga",
    "Strength Training",
    "HIIT",
    "Pilates",
    "CrossFit",
    "Zumba",
  ];

  const handleSendRequest = async () => {
    if (!requestMessage.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Handle success
    setIsSubmitting(false);
    setShowRequestModal(false);
    setRequestMessage("");
    setSelectedInstructor(null);
  };

  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.specialization
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === "all" ||
      instructor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Apply to Instructors
          </h1>
          <p className="text-gray-400 mt-1">
            Find and send requests to instructors to join your gym
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
                placeholder="Search instructors by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec.toLowerCase()}>
                  {spec}
                </option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 text-gray-400 rounded-lg hover:text-white transition-colors">
              <FiFilter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstructors.map((instructor) => (
          <div
            key={instructor.id}
            className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-violet-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]"
          >
            <div className="flex items-start space-x-4 mb-6">
              <img
                src={instructor.image}
                alt={instructor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {instructor.name}
                </h3>
                <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm">
                  {instructor.specialization}
                </span>
              </div>
              <div className="flex items-center">
                <FiStar className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="text-white font-medium">
                  {instructor.rating}
                </span>
                <span className="text-gray-400 text-sm ml-1">
                  ({instructor.reviews})
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-400">
                <FiUser className="w-4 h-4 mr-2 text-violet-400" />
                {instructor.experience} experience
              </div>
              <div className="flex items-center text-gray-400">
                <FiMapPin className="w-4 h-4 mr-2 text-violet-400" />
                {instructor.location}
              </div>
              <div className="flex items-center text-gray-400">
                <FiClock className="w-4 h-4 mr-2 text-violet-400" />
                Available: {instructor.availability.join(", ")}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-white font-medium mb-2">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {instructor.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-900/50 text-gray-300 rounded-full text-sm"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-white font-medium mb-2">Classes</h4>
              <div className="flex flex-wrap gap-2">
                {instructor.classes.map((className, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm"
                  >
                    {className}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-white font-medium mb-2">Achievements</h4>
              <div className="space-y-2">
                {instructor.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center text-gray-400">
                    <FiAward className="w-4 h-4 mr-2 text-violet-400" />
                    {achievement}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedInstructor(instructor);
                setShowRequestModal(true);
              }}
              className="w-full bg-violet-600 text-white py-3 rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center space-x-2"
            >
              <FiSend className="w-5 h-5" />
              <span>Send Request</span>
            </button>
          </div>
        ))}
      </div>

      {/* Request Modal */}
      {showRequestModal && selectedInstructor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Send Request to {selectedInstructor.name}
                </h3>
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setSelectedInstructor(null);
                    setRequestMessage("");
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Instructor Summary */}
                <div className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-lg">
                  <img
                    src={selectedInstructor.image}
                    alt={selectedInstructor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-medium text-white">
                      {selectedInstructor.name}
                    </h4>
                    <p className="text-violet-400">
                      {selectedInstructor.specialization}
                    </p>
                    <div className="flex items-center mt-1">
                      <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-white">
                        {selectedInstructor.rating}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">
                        ({selectedInstructor.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center text-gray-400 mb-2">
                      <FiMail className="w-4 h-4 mr-2 text-violet-400" />
                      Email
                    </div>
                    <div className="text-white">{selectedInstructor.email}</div>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center text-gray-400 mb-2">
                      <FiPhone className="w-4 h-4 mr-2 text-violet-400" />
                      Phone
                    </div>
                    <div className="text-white">{selectedInstructor.phone}</div>
                  </div>
                </div>

                {/* Request Message */}
                <div>
                  <label className="block text-gray-300 mb-2">
                    Message to Instructor
                  </label>
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    rows="4"
                    className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="Write your message to the instructor..."
                  ></textarea>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowRequestModal(false);
                      setSelectedInstructor(null);
                      setRequestMessage("");
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendRequest}
                    disabled={!requestMessage.trim() || isSubmitting}
                    className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        <span>Send Request</span>
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

export default ApplyToInstructor;