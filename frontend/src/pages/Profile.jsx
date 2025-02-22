import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  FiSunrise,
  FiSun,
  FiShield,
  FiBook,
  FiUsers,
  FiStar,
} from "react-icons/fi";

function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();

  // Determine user role based on URL path
  const getRole = () => {
    if (location.pathname.startsWith("/admin")) return "admin";
    if (location.pathname.startsWith("/gym-owner")) return "gym-owner";
    if (location.pathname.startsWith("/instructor")) return "instructor";
    return "admin";
  };

  const role = getRole();

  // Role-specific data
  const roleData = {
    admin: {
      title: "System Administrator",
      stats: [
        {
          title: "Total Users",
          value: "3,845",
          icon: FiUsers,
          color: "violet",
          description: "Platform users",
        },
        {
          title: "Active Gyms",
          value: "245",
          icon: FiActivity,
          color: "emerald",
          description: "Registered gyms",
        },
        {
          title: "System Uptime",
          value: "99.9%",
          icon: FiClock,
          color: "blue",
          description: "Last 30 days",
        },
        {
          title: "Response Time",
          value: "1.2s",
          icon: FiTrendingUp,
          color: "amber",
          description: "Average",
        },
      ],
      achievements: [
        {
          title: "System Optimization",
          description: "Improved platform performance by 40%",
          date: "2024-02-28",
          icon: FiActivity,
        },
        {
          title: "Security Update",
          description: "Successfully implemented new security protocols",
          date: "2024-03-01",
          icon: FiShield,
        },
      ],
    },
    "gym-owner": {
      title: "Gym Owner",
      stats: [
        {
          title: "Total Members",
          value: "543",
          icon: FiUsers,
          color: "violet",
          description: "Active members",
        },
        {
          title: "Monthly Revenue",
          value: "$45.6K",
          icon: FiDollarSign,
          color: "emerald",
          description: "This month",
        },
        {
          title: "Active Classes",
          value: "86",
          icon: FiActivity,
          color: "blue",
          description: "Running classes",
        },
        {
          title: "Retention Rate",
          value: "92%",
          icon: FiTrendingUp,
          color: "amber",
          description: "Last 3 months",
        },
      ],
      achievements: [
        {
          title: "Business Growth",
          description: "Achieved 50% membership growth",
          date: "2024-02-28",
          icon: FiTrendingUp,
        },
        {
          title: "Excellence Award",
          description: "Voted Best Gym in the City",
          date: "2024-03-01",
          icon: FiAward,
        },
      ],
    },
    instructor: {
      title: "Fitness Instructor",
      stats: [
        {
          title: "Total Students",
          value: "124",
          icon: FiUsers,
          color: "violet",
          description: "Active students",
        },
        {
          title: "Classes Taught",
          value: "86",
          icon: FiActivity,
          color: "emerald",
          description: "This month",
        },
        {
          title: "Rating",
          value: "4.9",
          icon: FiStar,
          color: "blue",
          description: "Average rating",
        },
        {
          title: "Experience",
          value: "5 yrs",
          icon: FiClock,
          color: "amber",
          description: "Teaching experience",
        },
      ],
      achievements: [
        {
          title: "Master Trainer",
          description: "Completed advanced certification",
          date: "2024-02-28",
          icon: FiBook,
        },
        {
          title: "Student Success",
          description: "Helped 100+ students reach their goals",
          date: "2024-03-01",
          icon: FiTarget,
        },
      ],
    },
  };

  // Sample user data - replace with actual data from your backend
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Street, San Francisco, CA",
    dateJoined: "2024-01-15",
    role: roleData[role].title,
    status: "Active",
    lastLogin: "2024-03-05 14:30",
    department: "Management",
    recentActivity: [
      {
        type: "login",
        description: "Logged in from San Francisco",
        date: "2024-03-05 14:30",
      },
      {
        type: "action",
        description: "Updated system settings",
        date: "2024-03-05 13:45",
      },
      {
        type: "notification",
        description: "Received new message from support team",
        date: "2024-03-05 12:30",
      },
    ],
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
              Member since {new Date(userData.dateJoined).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Role Details */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-6">Role Details</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-gray-400">
            <span>Role</span>
            <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full">
              {userData.role}
            </span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>Status</span>
            <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full">
              {userData.status}
            </span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>Last Login</span>
            <span>{userData.lastLogin}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>Department</span>
            <span>{userData.department}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="md:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roleData[role].stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-500/10`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">
                {stat.title}
              </h3>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <p className="text-sm text-gray-500">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="md:col-span-2">
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {userData.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg"
              >
                <div className="p-2 bg-violet-500/10 rounded-lg">
                  <FiActivity className="w-5 h-5 text-violet-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-300">{activity.description}</p>
                  <p className="text-sm text-gray-500 mt-1">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {roleData[role].achievements.map((achievement, index) => (
        <div
          key={index}
          className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-violet-500/10 rounded-lg">
              <achievement.icon className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                {achievement.title}
              </h4>
              <p className="text-gray-400 mb-2">{achievement.description}</p>
              <span className="text-sm text-gray-500">
                Achieved on {new Date(achievement.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Profile Header */}
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
          <p className="text-gray-400 mt-1">{userData.role}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-6 border-b border-gray-700">
        {[
          { id: "overview", label: "Overview", icon: FiUser },
          { id: "achievements", label: "Achievements", icon: FiAward },
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

      {/* Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "achievements" && renderAchievements()}
    </div>
  );
}

export default Profile;
