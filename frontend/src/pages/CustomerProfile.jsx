import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiActivity,
  FiHeart,
  FiClock,
  FiTrendingUp,
  FiAward,
  FiDollarSign,
  FiBarChart2,
  FiTarget,
  FiCheck,
  FiX,
  FiSun,
  FiSunrise,
} from "react-icons/fi";

function CustomerProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Sample user data - replace with actual data from your backend
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Fitness Street, San Francisco, CA",
    dateJoined: "2024-01-15",
    membershipPlan: "Premium",
    membershipStatus: "Active",
    nextPayment: "2024-03-15",
    gym: "FitZone Elite",
    fitnessGoals: ["Lose 10 pounds", "Improve strength", "Better flexibility"],
    upcomingClasses: [
      {
        id: 1,
        name: "Morning Yoga",
        instructor: "Sarah Johnson",
        date: "2024-03-10",
        time: "07:00 AM",
        location: "Studio A",
      },
      {
        id: 2,
        name: "HIIT Training",
        instructor: "Mike Chen",
        date: "2024-03-12",
        time: "06:00 PM",
        location: "Main Floor",
      },
    ],
    classHistory: [
      {
        id: 3,
        name: "Strength Training",
        instructor: "Emma Rodriguez",
        date: "2024-03-05",
        time: "08:00 AM",
        location: "Weight Room",
        status: "Completed",
      },
      {
        id: 4,
        name: "Spinning",
        instructor: "Alex Thompson",
        date: "2024-03-03",
        time: "05:30 PM",
        location: "Spin Studio",
        status: "Missed",
      },
    ],
    progress: {
      workoutsCompleted: 24,
      hoursSpent: 36,
      averageRating: 4.8,
      achievements: [
        {
          title: "Early Bird",
          description: "Completed 10 morning classes",
          date: "2024-02-28",
          icon: FiSunrise,
        },
        {
          title: "Consistency King",
          description: "Worked out 4 weeks in a row",
          date: "2024-03-01",
          icon: FiAward,
        },
      ],
      stats: [
        {
          label: "Weight",
          current: 165,
          target: 155,
          unit: "lbs",
          progress: 50,
        },
        {
          label: "Body Fat",
          current: 18,
          target: 15,
          unit: "%",
          progress: 65,
        },
        {
          label: "Muscle Mass",
          current: 140,
          target: 145,
          unit: "lbs",
          progress: 80,
        },
      ],
    },
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save changes to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
  };

  const renderOverview = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Personal Information
            </h3>
            <button
              onClick={handleEdit}
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              <FiEdit2 className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center text-gray-400">
              <FiUser className="w-5 h-5 mr-3 text-violet-400" />
              <span>{userData.name}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <FiMail className="w-5 h-5 mr-3 text-violet-400" />
              <span>{userData.email}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <FiPhone className="w-5 h-5 mr-3 text-violet-400" />
              <span>{userData.phone}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <FiMapPin className="w-5 h-5 mr-3 text-violet-400" />
              <span>{userData.address}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <FiCalendar className="w-5 h-5 mr-3 text-violet-400" />
              <span>
                Member since{" "}
                {new Date(userData.dateJoined).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Membership Details */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-6">
            Membership Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-gray-400">
              <span>Plan</span>
              <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full">
                {userData.membershipPlan}
              </span>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <span>Status</span>
              <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full">
                {userData.membershipStatus}
              </span>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <span>Next Payment</span>
              <span>{new Date(userData.nextPayment).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <span>Home Gym</span>
              <span>{userData.gym}</span>
            </div>
          </div>
        </div>

        {/* Fitness Goals */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Fitness Goals</h3>
            <button
              onClick={handleEdit}
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              <FiEdit2 className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            {userData.fitnessGoals.map((goal, index) => (
              <div key={index} className="flex items-center text-gray-400">
                <FiTarget className="w-5 h-5 mr-3 text-violet-400" />
                <span>{goal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-6">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <FiActivity className="w-5 h-5 text-violet-400" />
                <span className="text-2xl font-bold text-white">
                  {userData.progress.workoutsCompleted}
                </span>
              </div>
              <span className="text-sm text-gray-400">Workouts Completed</span>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <FiClock className="w-5 h-5 text-violet-400" />
                <span className="text-2xl font-bold text-white">
                  {userData.progress.hoursSpent}h
                </span>
              </div>
              <span className="text-sm text-gray-400">Hours Spent</span>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <FiHeart className="w-5 h-5 text-violet-400" />
                <span className="text-2xl font-bold text-white">
                  {userData.progress.averageRating}
                </span>
              </div>
              <span className="text-sm text-gray-400">Average Rating</span>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <FiTrendingUp className="w-5 h-5 text-violet-400" />
                <span className="text-2xl font-bold text-white">85%</span>
              </div>
              <span className="text-sm text-gray-400">Goal Progress</span>
            </div>
          </div>
        </div>
      </div>
      {/* "View My Workout" Button */}
      <div className="mt-8 text-center">
        <Link
          to="/view-my-workout"
          className="px-6 py-3 bg-violet-500 hover:bg-violet-600 transition-colors rounded-full text-white font-semibold"
        >
          View My Workout
        </Link>
      </div>
    </>
  );

  const renderClasses = () => (
    <div className="space-y-8">
      {/* Upcoming Classes */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">
          Upcoming Classes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userData.upcomingClasses.map((cls) => (
            <div
              key={cls.id}
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">
                    {cls.name}
                  </h4>
                  <p className="text-gray-400 flex items-center">
                    <FiUser className="w-4 h-4 mr-2 text-violet-400" />
                    {cls.instructor}
                  </p>
                </div>
                <Link
                  to={`/book-class/${cls.id}`}
                  className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm hover:bg-violet-500/20 transition-colors"
                >
                  View Details
                </Link>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-gray-400">
                  <FiCalendar className="w-4 h-4 mr-2 text-violet-400" />
                  {new Date(cls.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-400">
                  <FiClock className="w-4 h-4 mr-2 text-violet-400" />
                  {cls.time}
                </div>
                <div className="flex items-center text-gray-400">
                  <FiMapPin className="w-4 h-4 mr-2 text-violet-400" />
                  {cls.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class History */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Class History</h3>
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/50">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left p-4 text-gray-400 font-medium">
                  Class
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Instructor
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Date & Time
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Location
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {userData.classHistory.map((cls) => (
                <tr
                  key={cls.id}
                  className="hover:bg-gray-700/20 transition-colors"
                >
                  <td className="p-4">
                    <span className="text-white">{cls.name}</span>
                  </td>
                  <td className="p-4 text-gray-400">{cls.instructor}</td>
                  <td className="p-4 text-gray-400">
                    {new Date(cls.date).toLocaleDateString()} at {cls.time}
                  </td>
                  <td className="p-4 text-gray-400">{cls.location}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        cls.status === "Completed"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {cls.status === "Completed" ? (
                        <FiCheck className="w-4 h-4 mr-1" />
                      ) : (
                        <FiX className="w-4 h-4 mr-1" />
                      )}
                      {cls.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-8">
      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {userData.progress.stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">{stat.label}</h4>
              <FiBarChart2 className="w-5 h-5 text-violet-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-gray-400">
                <span>Current</span>
                <span className="text-white font-semibold">
                  {stat.current}
                  {stat.unit}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Target</span>
                <span className="text-violet-400 font-semibold">
                  {stat.target}
                  {stat.unit}
                </span>
              </div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-700">
                  <div
                    style={{ width: `${stat.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-violet-500"
                  ></div>
                </div>
                <span className="text-sm text-gray-400 mt-1">
                  {stat.progress}% Complete
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userData.progress.achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-violet-500/10 rounded-lg">
                  <FiAward className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {achievement.title}
                  </h4>
                  <p className="text-gray-400 mb-2">
                    {achievement.description}
                  </p>
                  <span className="text-sm text-gray-500">
                    Earned on {new Date(achievement.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-gray-900/50 to-indigo-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-br from-violet-500/5 to-indigo-500/5 rounded-full animate-float"
              style={{
                width: Math.random() * 300 + 50 + "px",
                height: Math.random() * 300 + 50 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div
        className={`container mx-auto px-4 relative transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Profile Header */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                {userData.name}
              </h1>
              <p className="text-gray-400 mt-1">
                Member since{" "}
                {new Date(userData.dateJoined).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex space-x-6 border-b border-gray-700">
            {[
              { id: "overview", label: "Overview", icon: FiUser },
              { id: "classes", label: "Classes", icon: FiCalendar },
              { id: "progress", label: "Progress", icon: FiActivity },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-violet-500 text-violet-400"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "classes" && renderClasses()}
          {activeTab === "progress" && renderProgress()}
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;
