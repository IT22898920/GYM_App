import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
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
  FiCheckCircle,
  FiAlertCircle,
  FiBarChart2,
  FiPieChart,
  FiGrid,
  FiUserPlus,
} from "react-icons/fi";

function Dashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");
  const [isLoaded, setIsLoaded] = useState(false);
  const [subscriptionStats, setSubscriptionStats] = useState(null);
  const [suspensionStats, setSuspensionStats] = useState(null);
  const [expiringSubscriptions, setExpiringSubscriptions] = useState([]);

  useEffect(() => {
    setIsLoaded(true);
    fetchSubscriptionStats();
    fetchSuspensionStats();
    fetchExpiringSubscriptions();
  }, []);

  const fetchSubscriptionStats = async () => {
    try {
      const response = await api.get("/admin/subscriptions/stats");
      setSubscriptionStats(response.data.data);
    } catch (error) {
      console.error("Error fetching subscription stats:", error);
    }
  };

  const fetchSuspensionStats = async () => {
    try {
      const response = await api.get("/admin/suspensions/stats");
      setSuspensionStats(response.data.data);
    } catch (error) {
      console.error("Error fetching suspension stats:", error);
    }
  };

  const fetchExpiringSubscriptions = async () => {
    try {
      const response = await api.get("/admin/subscriptions", {
        params: { expiringSoon: 7, limit: 5 }
      });
      setExpiringSubscriptions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching expiring subscriptions:", error);
    }
  };

  const stats = [
    {
      title: "Total Members",
      value: "2,543",
      change: "+12.5%",
      trend: "up",
      icon: FiUsers,
      color: "violet",
      description: "Active memberships this month",
    },
    {
      title: "Monthly Revenue",
      value: "$45,678",
      change: "+23.4%",
      trend: "up",
      icon: FiDollarSign,
      color: "emerald",
      description: "Total revenue for February",
    },
    {
      title: "Active Classes",
      value: "186",
      change: "-5.2%",
      trend: "down",
      icon: FiActivity,
      color: "blue",
      description: "Classes scheduled this week",
    },
    {
      title: "New Bookings",
      value: "432",
      change: "+18.7%",
      trend: "up",
      icon: FiCalendar,
      color: "amber",
      description: "Bookings in the last 7 days",
    },
  ];

  const recentMembers = [
    {
      name: "John Doe",
      email: "john@example.com",
      membership: "Premium",
      joinDate: "2024-02-15",
      status: "active",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Sarah Smith",
      email: "sarah@example.com",
      membership: "Basic",
      joinDate: "2024-02-14",
      status: "pending",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      name: "Mike Johnson",
      email: "mike@example.com",
      membership: "Premium",
      joinDate: "2024-02-13",
      status: "active",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  ];

  const upcomingClasses = [
    {
      name: "Morning Yoga",
      instructor: "Emma Wilson",
      time: "07:00 AM",
      attendees: 12,
      capacity: 15,
      status: "upcoming",
      type: "yoga",
    },
    {
      name: "HIIT Training",
      instructor: "Alex Thompson",
      time: "09:00 AM",
      attendees: 15,
      capacity: 15,
      status: "full",
      type: "hiit",
    },
    {
      name: "Strength Training",
      instructor: "David Brown",
      time: "11:00 AM",
      attendees: 8,
      capacity: 12,
      status: "upcoming",
      type: "strength",
    },
  ];

  const quickActions = [
    {
      title: "Subscriptions",
      icon: FiDollarSign,
      color: "violet",
      path: "/admin/subscriptions",
    },
    {
      title: "Suspensions",
      icon: FiAlertCircle,
      color: "red",
      path: "/admin/suspensions",
    },
    {
      title: "View Reports",
      icon: FiBarChart2,
      color: "emerald",
      path: "/admin/reports",
    },
    {
      title: "Manage Equipment",
      icon: FiGrid,
      color: "amber",
      path: "/admin/equipment",
    },
  ];

  return (
    <div
      className={`space-y-8 transition-all duration-1000 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Welcome to Admin Dashboard</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500 transition-colors"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <div className="flex gap-2">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className={`flex items-center gap-2 px-4 py-2 bg-${action.color}-500/10 text-${action.color}-400 rounded-lg hover:bg-${action.color}-500/20 transition-colors`}
              >
                <action.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{action.title}</span>
              </Link>
            ))}
          </div>
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

      {/* Subscription & Suspension Management Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Management Widget */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FiDollarSign className="text-violet-400" />
                Subscription Management
              </h2>
              <Link
                to="/admin/subscriptions"
                className="text-violet-400 hover:text-violet-300 transition-colors text-sm"
              >
                Manage
              </Link>
            </div>
          </div>
          <div className="p-6">
            {subscriptionStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Active Subscriptions</p>
                    <p className="text-2xl font-bold text-white">{subscriptionStats.totalActive || 0}</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      ${subscriptionStats.totalRevenue?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-400 text-sm font-medium mb-1">Expiring Soon (7 days)</p>
                      <p className="text-2xl font-bold text-amber-400">{subscriptionStats.expiringSoon || 0}</p>
                    </div>
                    <FiAlertCircle className="w-8 h-8 text-amber-400" />
                  </div>
                </div>
                {expiringSubscriptions.length > 0 && (
                  <div className="mt-4">
                    <p className="text-gray-400 text-sm mb-2">Upcoming Expirations:</p>
                    <div className="space-y-2">
                      {expiringSubscriptions.slice(0, 3).map((sub) => (
                        <div key={sub._id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">
                            {sub.firstName} {sub.lastName}
                          </span>
                          <span className="text-amber-400">
                            {sub.membershipPlan?.endDate
                              ? new Date(sub.membershipPlan.endDate).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">Loading subscription stats...</div>
            )}
          </div>
        </div>

        {/* Suspension Management Widget */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FiAlertCircle className="text-red-400" />
                Suspension Management
              </h2>
              <Link
                to="/admin/suspensions"
                className="text-red-400 hover:text-red-300 transition-colors text-sm"
              >
                Manage
              </Link>
            </div>
          </div>
          <div className="p-6">
            {suspensionStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 text-sm mb-1">Suspended Gyms</p>
                    <p className="text-2xl font-bold text-red-400">{suspensionStats.gymSuspensions || 0}</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 text-sm mb-1">Suspended Instructors</p>
                    <p className="text-2xl font-bold text-red-400">{suspensionStats.instructorSuspensions || 0}</p>
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Recent Suspensions (30 days)</p>
                  <p className="text-2xl font-bold text-white">{suspensionStats.recentSuspensions || 0}</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-400 text-sm mb-1">Total Unsuspensions</p>
                      <p className="text-2xl font-bold text-emerald-400">{suspensionStats.totalUnsuspensions || 0}</p>
                    </div>
                    <FiCheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">Loading suspension stats...</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Members & Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Members */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Recent Members
              </h2>
              <Link
                to="/admin/members"
                className="text-violet-400 hover:text-violet-300 transition-colors text-sm"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-700/50">
            {recentMembers.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-6 hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                        member.status === "active"
                          ? "bg-green-400"
                          : "bg-yellow-400"
                      }`}
                    ></div>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{member.name}</h3>
                    <p className="text-gray-400 text-sm">{member.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      member.membership === "Premium"
                        ? "bg-violet-500/10 text-violet-400"
                        : "bg-gray-500/10 text-gray-400"
                    }`}
                  >
                    {member.membership}
                  </span>
                  <p className="text-gray-500 text-sm mt-1">
                    {member.joinDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Upcoming Classes
              </h2>
              <Link
                to="/admin/classes"
                className="text-violet-400 hover:text-violet-300 transition-colors text-sm"
              >
                View schedule
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-700/50">
            {upcomingClasses.map((class_, index) => (
              <div
                key={index}
                className="p-6 hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        class_.type === "yoga"
                          ? "bg-violet-500/10 text-violet-400"
                          : class_.type === "hiit"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      <FiActivity className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{class_.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {class_.instructor}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <FiClock className="text-gray-400 w-4 h-4" />
                      <span className="text-gray-300">{class_.time}</span>
                    </div>
                    <div className="mt-1">
                      {class_.status === "full" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                          <FiAlertCircle className="w-3 h-3 mr-1" />
                          Full
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                          <FiCheckCircle className="w-3 h-3 mr-1" />
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-violet-400">
                          {Math.round(
                            (class_.attendees / class_.capacity) * 100
                          )}
                          % Full
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-gray-400">
                          {class_.attendees}/{class_.capacity} Spots
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-700">
                      <div
                        style={{
                          width: `${
                            (class_.attendees / class_.capacity) * 100
                          }%`,
                        }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-violet-500"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
