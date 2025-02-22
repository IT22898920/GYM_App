import { useState } from "react";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiAward,
  FiStar,
  FiUsers,
  FiActivity,
  FiClock,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

function VerifiedInstructors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");

  // Sample data - replace with actual data from your backend
  const instructors = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 123-4567",
      specialization: "Yoga",
      experience: "8 years",
      rating: 4.9,
      totalStudents: 156,
      classesCompleted: 450,
      joinDate: "2024-01-15",
      certifications: [
        "RYT 500 Certified Yoga Instructor",
        "Meditation Teacher Training",
      ],
      profileImage: "https://i.pravatar.cc/150?img=1",
      status: "active",
      schedule: [
        { day: "Monday", time: "07:00 AM", class: "Morning Yoga" },
        { day: "Wednesday", time: "06:00 PM", class: "Power Yoga" },
      ],
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike@example.com",
      phone: "+1 (555) 234-5678",
      specialization: "Strength Training",
      experience: "5 years",
      rating: 4.8,
      totalStudents: 98,
      classesCompleted: 320,
      joinDate: "2024-02-01",
      certifications: [
        "NASM Certified Personal Trainer",
        "CrossFit Level 2 Trainer",
      ],
      profileImage: "https://i.pravatar.cc/150?img=2",
      status: "active",
      schedule: [
        { day: "Tuesday", time: "08:00 AM", class: "Strength Basics" },
        { day: "Thursday", time: "05:30 PM", class: "Advanced Lifting" },
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

  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === "all" ||
      instructor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Verified Instructors
          </h1>
          <p className="text-gray-400 mt-1">
            View and manage verified instructors
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
                placeholder="Search instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full md:w-48 bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec === "All" ? "all" : spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInstructors.map((instructor) => (
          <div
            key={instructor.id}
            className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img
                      src={instructor.profileImage}
                      alt={instructor.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {instructor.name}
                    </h3>
                    <p className="text-violet-400">
                      {instructor.specialization}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <FiMoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <FiUsers className="w-5 h-5 text-violet-400" />
                    <span className="text-2xl font-bold text-white">
                      {instructor.totalStudents}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">Total Students</span>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <FiActivity className="w-5 h-5 text-violet-400" />
                    <span className="text-2xl font-bold text-white">
                      {instructor.classesCompleted}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    Classes Completed
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-gray-400">
                  <div className="flex items-center">
                    <FiStar className="w-4 h-4 mr-2 text-yellow-400" />
                    Rating
                  </div>
                  <span className="text-white font-medium">
                    {instructor.rating}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <div className="flex items-center">
                    <FiAward className="w-4 h-4 mr-2 text-violet-400" />
                    Experience
                  </div>
                  <span className="text-white">{instructor.experience}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <div className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-2 text-violet-400" />
                    Joined
                  </div>
                  <span className="text-white">
                    {new Date(instructor.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-white font-medium mb-2">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {instructor.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-white font-medium mb-2">Schedule</h4>
                <div className="space-y-2">
                  {instructor.schedule.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-gray-400 p-2 bg-gray-900/50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <FiClock className="w-4 h-4 mr-2 text-violet-400" />
                        <span>
                          {slot.day} at {slot.time}
                        </span>
                      </div>
                      <span className="text-white">{slot.class}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VerifiedInstructors;
