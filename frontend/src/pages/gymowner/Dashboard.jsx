import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiCalendar,
  FiArrowUp,
  FiArrowDown,
  FiMoreVertical,
  FiTrendingUp,
  FiClock,
  FiEdit3,
  FiSettings,
  FiImage,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const stats = [
    {
      title: "Total Members",
      value: "543",
      change: "+12.5%",
      trend: "up",
      icon: FiUsers,
      color: "violet",
      description: "Active memberships",
    },
    {
      title: "Monthly Revenue",
      value: "$45,678",
      change: "+23.4%",
      trend: "up",
      icon: FiDollarSign,
      color: "emerald",
      description: "This month",
    },
    {
      title: "Active Classes",
      value: "86",
      change: "-5.2%",
      trend: "down",
      icon: FiActivity,
      color: "blue",
      description: "Classes this week",
    },
    {
      title: "New Bookings",
      value: "132",
      change: "+18.7%",
      trend: "up",
      icon: FiCalendar,
      color: "amber",
      description: "Last 7 days",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Welcome back, Gym Owner</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`group bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] relative overflow-hidden ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gym Management */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Gym Management</h2>
            <FiSettings className="h-5 w-5 text-violet-400" />
          </div>
          
          <div className="space-y-4">
            <Link
              to="/gym-owner/edit-gym-details"
              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-violet-500/10 rounded-lg mr-3 group-hover:bg-violet-500/20 transition-colors">
                  <FiEdit3 className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Edit Gym Details</h3>
                  <p className="text-gray-400 text-sm">Update gym information, facilities, and services</p>
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-white transition-colors">
                →
              </div>
            </Link>

            <Link
              to="/gym-owner/manage-images"
              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-500/10 rounded-lg mr-3 group-hover:bg-blue-500/20 transition-colors">
                  <FiImage className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Manage Photos & Logo</h3>
                  <p className="text-gray-400 text-sm">Upload and manage gym photos and logo</p>
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-white transition-colors">
                →
              </div>
            </Link>

            <Link
              to="/gym-owner/update-location"
              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-500/10 rounded-lg mr-3 group-hover:bg-green-500/20 transition-colors">
                  <FiMapPin className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Update Location</h3>
                  <p className="text-gray-400 text-sm">Update gym address and map location</p>
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-white transition-colors">
                →
              </div>
            </Link>

            <Link
              to="/gym-owner/contact-info"
              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-amber-500/10 rounded-lg mr-3 group-hover:bg-amber-500/20 transition-colors">
                  <FiPhone className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Contact Information</h3>
                  <p className="text-gray-400 text-sm">Update phone, email, and social media</p>
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-white transition-colors">
                →
              </div>
            </Link>

            <Link
              to="/gym-owner/bank-account"
              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-emerald-500/10 rounded-lg mr-3 group-hover:bg-emerald-500/20 transition-colors">
                  <FiDollarSign className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Bank Account</h3>
                  <p className="text-gray-400 text-sm">Manage payment and bank details</p>
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-white transition-colors">
                →
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <FiTrendingUp className="h-5 w-5 text-green-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <span className="text-gray-300 text-sm">New member registration</span>
              </div>
              <span className="text-gray-400 text-xs">2 min ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span className="text-gray-300 text-sm">Class booking confirmed</span>
              </div>
              <span className="text-gray-400 text-xs">15 min ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-violet-400 rounded-full mr-3"></div>
                <span className="text-gray-300 text-sm">Payment received</span>
              </div>
              <span className="text-gray-400 text-xs">1 hour ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
                <span className="text-gray-300 text-sm">Equipment maintenance due</span>
              </div>
              <span className="text-gray-400 text-xs">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
