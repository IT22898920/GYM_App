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
  FiUser,
} from "react-icons/fi";
import AssignedMembers from "./AssignedMembers";

function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const stats = [
    {
      title: "Total Students",
      value: "124",
      change: "+12.5%",
      trend: "up",
      icon: FiUsers,
      color: "violet",
      description: "Active students",
    },
    {
      title: "Monthly Earnings",
      value: "$4,578",
      change: "+23.4%",
      trend: "up",
      icon: FiDollarSign,
      color: "emerald",
      description: "This month",
    },
    {
      title: "Classes Taught",
      value: "86",
      change: "+15.2%",
      trend: "up",
      icon: FiActivity,
      color: "blue",
      description: "This month",
    },
    {
      title: "Upcoming Classes",
      value: "12",
      change: "+8.7%",
      trend: "up",
      icon: FiCalendar,
      color: "amber",
      description: "Next 7 days",
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
          <p className="text-gray-400 mt-1">Welcome back, Instructor</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiActivity size={18} />
                <span>Overview</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('assignedMembers')}
              className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'assignedMembers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiUser size={18} />
                <span>Assigned Members</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && (
          <div>
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
          </div>
        )}
        {activeTab === 'assignedMembers' && <AssignedMembers />}
      </div>
    </div>
  );
}

export default Dashboard;
