import { useState } from "react";
import {
  FiDollarSign,
  FiSearch,
  FiFilter,
  FiDownload,
  FiArrowUp,
  FiArrowDown,
  FiCreditCard,
  FiCalendar,
  FiCheck,
  FiX,
  FiMoreVertical,
  FiActivity,
  FiUsers,
  FiTrendingUp,
  FiClock,
} from "react-icons/fi";

function Finance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("month");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const stats = [
    {
      title: "Total Revenue",
      value: "$45,678",
      change: "+23.4%",
      trend: "up",
      icon: FiDollarSign,
      color: "violet",
      description: "This month",
    },
    {
      title: "Pending Payments",
      value: "$2,845",
      change: "-12.5%",
      trend: "down",
      icon: FiCreditCard,
      color: "emerald",
      description: "To be processed",
    },
    {
      title: "Active Bookings",
      value: "186",
      change: "+15.2%",
      trend: "up",
      icon: FiActivity,
      color: "blue",
      description: "Current period",
    },
    {
      title: "Revenue/Booking",
      value: "$32.45",
      change: "+8.7%",
      trend: "up",
      icon: FiTrendingUp,
      color: "amber",
      description: "Average",
    },
  ];

  // Sample data for payments
  const payments = [
    {
      id: 1,
      customer: {
        name: "John Doe",
        email: "john@example.com",
        image: "https://i.pravatar.cc/150?img=1",
      },
      class: "Morning Yoga",
      instructor: "Sarah Johnson",
      gym: "FitZone Elite",
      amount: 25.0,
      status: "pending",
      date: "2024-03-10",
      paymentMethod: "Credit Card",
      transactionId: "TXN123456",
    },
    {
      id: 2,
      customer: {
        name: "Sarah Smith",
        email: "sarah@example.com",
        image: "https://i.pravatar.cc/150?img=2",
      },
      class: "HIIT Training",
      instructor: "Mike Chen",
      gym: "PowerFlex Gym",
      amount: 30.0,
      status: "completed",
      date: "2024-03-09",
      paymentMethod: "PayPal",
      transactionId: "TXN123457",
    },
  ];

  const handleProcessPayment = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    // Handle payment processing
    console.log("Processing payment:", selectedPayment.id);
    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Finance Management
          </h1>
          <p className="text-gray-400 mt-1">Manage payments and transactions</p>
        </div>
        <button
          onClick={() => {}}
          className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <FiDownload className="w-5 h-5 mr-2" />
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] relative overflow-hidden"
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

      {/* Filters */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-4 top-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 text-gray-400 rounded-lg hover:text-white transition-colors">
              <FiFilter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left p-4 text-gray-400 font-medium">
                  Customer
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Class
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Instructor
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">Gym</th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Amount
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Date
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-700/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={payment.customer.image}
                        alt={payment.customer.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-white">
                          {payment.customer.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {payment.customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{payment.class}</td>
                  <td className="p-4 text-gray-300">{payment.instructor}</td>
                  <td className="p-4 text-gray-300">{payment.gym}</td>
                  <td className="p-4">
                    <div className="text-white font-medium">
                      ${payment.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        payment.status === "completed"
                          ? "bg-green-500/10 text-green-400"
                          : payment.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {payment.status === "completed" ? (
                        <FiCheck className="w-4 h-4 mr-1" />
                      ) : payment.status === "pending" ? (
                        <FiClock className="w-4 h-4 mr-1" />
                      ) : (
                        <FiX className="w-4 h-4 mr-1" />
                      )}
                      {payment.status.charAt(0).toUpperCase() +
                        payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      {payment.status === "pending" && (
                        <button
                          onClick={() => handleProcessPayment(payment)}
                          className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-lg hover:bg-violet-500/20 transition-colors"
                        >
                          Process
                        </button>
                      )}
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <FiMoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Processing Modal */}
      {showPaymentModal && selectedPayment && (
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
                Process Payment
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-400">
                  <span>Customer</span>
                  <span className="text-white">
                    {selectedPayment.customer.name}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Class</span>
                  <span className="text-white">{selectedPayment.class}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Amount</span>
                  <span className="text-white">
                    ${selectedPayment.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Payment Method</span>
                  <span className="text-white">
                    {selectedPayment.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Transaction ID</span>
                  <span className="text-white">
                    {selectedPayment.transactionId}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPayment}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Finance;
