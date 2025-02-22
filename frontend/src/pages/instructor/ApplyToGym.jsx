import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiSearch,
  FiMapPin,
  FiStar,
  FiUsers,
  FiActivity,
  FiClock,
  FiCheck,
  FiUpload,
  FiCalendar,
  FiDollarSign,
} from "react-icons/fi";

function ApplyToGym() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGym, setSelectedGym] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [formData, setFormData] = useState({
    availability: [],
    resume: null,
    certifications: [],
    coverLetter: "",
    preferredSchedule: [],
    isFreelance: false,
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Sample data for gyms
  const gyms = [
    {
      id: 1,
      name: "FitZone Elite",
      location: "Downtown",
      rating: 4.8,
      reviews: 245,
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80",
      amenities: [
        "Cardio Equipment",
        "Weight Training",
        "Personal Training",
        "Yoga Studio",
      ],
      instructorCount: 24,
      memberCount: "500+",
      openPositions: ["Yoga Instructor", "HIIT Trainer", "Strength Coach"],
      payRange: "$30-50/hr",
      description:
        "Premier fitness facility with state-of-the-art equipment and a thriving community.",
    },
    {
      id: 2,
      name: "PowerFlex Gym",
      location: "Uptown",
      rating: 4.6,
      reviews: 189,
      image:
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80",
      amenities: ["CrossFit", "Olympic Lifting", "Group Classes", "Spa"],
      instructorCount: 18,
      memberCount: "350+",
      openPositions: ["CrossFit Coach", "Personal Trainer"],
      payRange: "$35-55/hr",
      description:
        "Specialized strength and conditioning facility focused on performance.",
    },
    {
      id: 3,
      name: "Wellness Hub",
      location: "West Side",
      rating: 4.9,
      reviews: 312,
      image:
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80",
      amenities: ["Pool", "Sauna", "Yoga Studio", "Pilates"],
      instructorCount: 32,
      memberCount: "600+",
      openPositions: ["Pilates Instructor", "Yoga Teacher", "Swimming Coach"],
      payRange: "$25-45/hr",
      description:
        "Holistic wellness center combining fitness, relaxation, and mindfulness.",
    },
  ];

  const availabilityOptions = [
    { value: "weekday-morning", label: "Weekday Mornings" },
    { value: "weekday-afternoon", label: "Weekday Afternoons" },
    { value: "weekday-evening", label: "Weekday Evenings" },
    { value: "weekend-morning", label: "Weekend Mornings" },
    { value: "weekend-afternoon", label: "Weekend Afternoons" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      if (name === "certifications") {
        setFormData((prev) => ({
          ...prev,
          [name]: [...prev.certifications, ...files],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: files[0],
        }));
      }
    } else if (type === "checkbox") {
      if (name === "availability") {
        const newAvailability = checked
          ? [...formData.availability, value]
          : formData.availability.filter((item) => item !== value);
        setFormData((prev) => ({
          ...prev,
          availability: newAvailability,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowApplicationModal(false);
    // Reset form
    setFormData({
      availability: [],
      resume: null,
      certifications: [],
      coverLetter: "",
      preferredSchedule: [],
      isFreelance: false,
    });
  };

  const filteredGyms = gyms.filter((gym) => {
    return (
      gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Apply to Gyms
          </h1>
          <p className="text-gray-400 mt-1">
            Find and apply to gyms looking for instructors
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4">
        <div className="relative">
          <FiSearch className="absolute left-4 top-3.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search gyms by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
          />
        </div>
      </div>

      {/* Gyms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGyms.map((gym) => (
          <div
            key={gym.id}
            className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all duration-300"
          >
            <div className="relative aspect-video">
              <img
                src={gym.image}
                alt={gym.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{gym.name}</h3>
                <div className="flex items-center">
                  <FiStar className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="text-white font-medium">{gym.rating}</span>
                  <span className="text-gray-400 text-sm ml-1">
                    ({gym.reviews})
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-400">
                  <FiMapPin className="w-4 h-4 mr-2 text-violet-400" />
                  {gym.location}
                </div>
                <div className="flex items-center text-gray-400">
                  <FiUsers className="w-4 h-4 mr-2 text-violet-400" />
                  {gym.instructorCount} instructors • {gym.memberCount} members
                </div>
                <div className="flex items-center text-gray-400">
                  <FiDollarSign className="w-4 h-4 mr-2 text-violet-400" />
                  {gym.payRange}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-white font-medium mb-2">Open Positions</h4>
                <div className="flex flex-wrap gap-2">
                  {gym.openPositions.map((position, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm"
                    >
                      {position}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedGym(gym);
                  setShowApplicationModal(true);
                }}
                className="w-full bg-violet-600 text-white py-3 rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedGym && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Apply to {selectedGym.name}
                </h3>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiArrowLeft className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Availability */}
                <div>
                  <label className="block text-gray-300 mb-4">
                    Availability
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availabilityOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center space-x-3 p-4 rounded-lg bg-gray-900/50 border border-gray-700/50 cursor-pointer hover:bg-gray-800/50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          name="availability"
                          value={option.value}
                          checked={formData.availability.includes(option.value)}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            formData.availability.includes(option.value)
                              ? "bg-violet-500 border-violet-500"
                              : "border-gray-600"
                          }`}
                        >
                          {formData.availability.includes(option.value) && (
                            <FiCheck className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-gray-300 mb-2">Resume</label>
                  <div className="relative">
                    <label className="flex items-center justify-center px-6 py-4 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-violet-500 transition-colors">
                      <input
                        type="file"
                        name="resume"
                        onChange={handleChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />
                      <FiUpload className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-gray-400">
                        {formData.resume
                          ? formData.resume.name
                          : "Upload resume (PDF, DOC, DOCX)"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-gray-300 mb-2">
                    Certifications
                  </label>
                  <div className="relative">
                    <label className="flex items-center justify-center px-6 py-4 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-violet-500 transition-colors">
                      <input
                        type="file"
                        name="certifications"
                        onChange={handleChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                        className="hidden"
                      />
                      <FiUpload className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-gray-400">
                        Upload certifications
                      </span>
                    </label>
                    {formData.certifications.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {Array.from(formData.certifications).map(
                          (file, index) => (
                            <div
                              key={index}
                              className="flex items-center text-gray-400"
                            >
                              <FiCheck className="w-4 h-4 text-green-400 mr-2" />
                              {file.name}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-gray-300 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    rows="4"
                    className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="Tell us why you'd be a great fit..."
                  ></textarea>
                </div>

                {/* Freelance Option */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isFreelance"
                        checked={formData.isFreelance}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          formData.isFreelance
                            ? "bg-violet-500 border-violet-500"
                            : "border-gray-600"
                        }`}
                      >
                        {formData.isFreelance && (
                          <FiCheck className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-gray-300">
                      I want to work as a freelance instructor
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowApplicationModal(false)}
                    className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center space-x-2"
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
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-5 h-5" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplyToGym;
