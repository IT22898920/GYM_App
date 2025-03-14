import { useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FiDollarSign,
  FiCreditCard,
  FiCalendar,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiUsers,
  FiActivity,
  FiFilter,
  FiSearch,
  FiDownload,
  FiRefreshCw,
  FiPrinter,
  FiFileText,
  FiBarChart2,
  FiPieChart,
  FiTrendingUp,
  FiSettings,
  FiChevronDown,
  FiChevronUp,
  FiMoreVertical,
  FiSliders,
  FiEye,
} from "react-icons/fi";

const stripePromise = loadStripe("your_publishable_key");

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#fff",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": { color: "#aab7c4" },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

// Sample data for charts
const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 2000 },
  { name: "Apr", revenue: 2780 },
  { name: "May", revenue: 1890 },
  { name: "Jun", revenue: 2390 },
];

const pieData = [
  { name: "Memberships", value: 60 },
  { name: "Classes", value: 25 },
  { name: "Instructor Packages", value: 15 },
  { name: "Gym Registration", value: 20 },
];

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"];

function PaymentForm({ amount, onSuccess, onCancel, paymentType }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === "manual") {
      onSuccess({ paymentMethod: "manual", amount, type: paymentType });
      return;
    }
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);
    try {
      const { error } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });
      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }
      onSuccess({ paymentMethod: "card", amount, type: paymentType });
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Payment Method</h3>
          <span className="text-2xl font-bold text-white">${amount}</span>
        </div>
        <div className="space-y-4">
          <label
            className={`block p-4 rounded-lg border cursor-pointer transition-all ${
              paymentMethod === "card"
                ? "bg-violet-500/20 border-violet-500"
                : "bg-gray-700 border-gray-600"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="hidden"
            />
            <div className="flex items-center">
              <FiCreditCard className="w-5 h-5 mr-3 text-violet-400" />
              <div>
                <div className="font-medium text-white">Credit/Debit Card</div>
                <div className="text-sm text-gray-400">
                  Pay securely with your card
                </div>
              </div>
            </div>
          </label>
          <label
            className={`block p-4 rounded-lg border cursor-pointer transition-all ${
              paymentMethod === "manual"
                ? "bg-violet-500/20 border-violet-500"
                : "bg-gray-700 border-gray-600"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="manual"
              checked={paymentMethod === "manual"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="hidden"
            />
            <div className="flex items-center">
              <FiDollarSign className="w-5 h-5 mr-3 text-violet-400" />
              <div>
                <div className="font-medium text-white">Manual Payment</div>
                <div className="text-sm text-gray-400">
                  Pay at the front desk
                </div>
              </div>
            </div>
          </label>
        </div>
        {paymentMethod === "card" && (
          <div className="mt-4">
            <div className="p-4 bg-gray-700 rounded-lg">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={processing}
          className={`flex-1 p-3 bg-violet-600 text-white rounded-lg font-medium transition ${
            processing ? "opacity-75 cursor-not-allowed" : "hover:bg-violet-700"
          }`}
        >
          {processing ? "Processing..." : "Complete Payment"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 p-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function Finance() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("membership");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [showCharts, setShowCharts] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState("month");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [payments, setPayments] = useState([
    {
      id: 1,
      member: "John Doe",
      amount: 49.99,
      date: "2024-03-01",
      status: "completed",
      method: "card",
      type: "membership",
      plan: "Premium Monthly",
      nextPayment: "2024-04-01",
      duration: "1 month",
      autoRenew: true,
    },
    {
      id: 2,
      member: "Sarah Smith",
      amount: 99.99,
      date: "2024-03-02",
      status: "pending",
      method: "manual",
      type: "instructor_package",
      package: "50+ Students",
      features: ["Unlimited Classes", "Priority Support"],
      validUntil: "2024-04-02",
    },
    {
      id: 3,
      member: "Mike Johnson",
      amount: 29.99,
      date: "2024-03-03",
      status: "completed",
      method: "card",
      type: "class",
      class: "Yoga Basics",
      instructor: "Emma Wilson",
      schedule: "2024-03-05 10:00 AM",
    },
    {
      id: 4,
      member: "Anna Lee",
      amount: 199.99,
      date: "2024-03-10",
      status: "completed",
      method: "card",
      type: "gym_registration",
      plan: "Full Gym Access",
    },
  ]);

  const stats = {
    all: [
      {
        title: "Total Revenue",
        value: "$3,450.85",
        change: "+12.5%",
        icon: FiDollarSign,
        color: "green",
      },
      {
        title: "Active Members",
        value: "245",
        change: "+5.2%",
        icon: FiUsers,
        color: "blue",
      },
      {
        title: "Pending Payments",
        value: "$350.00",
        icon: FiClock,
        color: "yellow",
      },
    ],
    membership: [
      {
        title: "Membership Revenue",
        value: "$1,200.00",
        change: "+10%",
        icon: FiDollarSign,
        color: "green",
      },
    ],
    instructor_package: [
      {
        title: "Instructor Package Revenue",
        value: "$800.00",
        change: "+15%",
        icon: FiDollarSign,
        color: "green",
      },
    ],
    class: [
      {
        title: "Class Payment Revenue",
        value: "$600.00",
        change: "+8%",
        icon: FiDollarSign,
        color: "green",
      },
    ],
    gym_registration: [
      {
        title: "Gym Registration Revenue",
        value: "$199.99",
        change: "+8.3%",
        icon: FiDollarSign,
        color: "green",
      },
    ],
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Financial Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    const tableColumn = ["Member", "Amount", "Date", "Type", "Status"];
    const tableRows = payments.map((payment) => [
      payment.member,
      `$${payment.amount}`,
      payment.date,
      payment.type,
      payment.status,
    ]);
    doc.autoTable({
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 8 },
    });
    doc.save("financial-report.pdf");
  };

  const handleExportCSV = () => {
    const headers = ["Member", "Amount", "Date", "Type", "Status", "Method"];
    const csvData = payments.map((payment) => [
      payment.member,
      payment.amount,
      payment.date,
      payment.type,
      payment.status,
      payment.method,
    ]);
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "financial-report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePaymentSuccess = (paymentDetails) => {
    console.log("Payment successful:", paymentDetails);
    setShowPaymentModal(false);
    setSelectedPayment(null);
    setAmount("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Finance Management
          </h1>
          <p className="text-gray-400 mt-1">
            Track and manage all financial transactions
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <FiDollarSign className="w-5 h-5 mr-2" />
            Record Payment
          </button>
          <div className="relative group">
            <button className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              <FiDownload className="w-5 h-5 mr-2" />
              Export
              <FiChevronDown className="w-4 h-4 ml-2" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 hidden group-hover:block">
              <button
                onClick={handleExportPDF}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center"
              >
                <FiFileText className="w-4 h-4 mr-2" />
                Export as PDF
              </button>
              <button
                onClick={handleExportCSV}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Export as CSV
              </button>
              <button
                onClick={handlePrint}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center"
              >
                <FiPrinter className="w-4 h-4 mr-2" />
                Print Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Type Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "All Payments" },
          { id: "membership", label: "Memberships" },
          { id: "instructor_package", label: "Instructor Packages" },
          { id: "class", label: "Class Payments" },
          { id: "gym_registration", label: "Gym Registration" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? "bg-violet-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      {stats[activeTab] && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats[activeTab].map((stat, index) => (
            <div
              key={index}
              className="group bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] relative overflow-hidden"
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
                    {stat.change && (
                      <div
                        className={`flex items-center text-sm ${
                          stat.change.startsWith("+")
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {stat.change.startsWith("+") ? (
                          <FiTrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <FiTrendingUp className="h-4 w-4 mr-1" />
                        )}
                        {stat.change}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts Section */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Revenue Trend</h3>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="bg-gray-700 text-white rounded-lg px-3 py-1 border border-gray-600"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "0.5rem",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-medium text-white mb-6">
              Revenue Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "0.5rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-4 top-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 text-gray-400 rounded-lg hover:text-white transition-colors"
            >
              <FiSliders className="w-4 h-4" />
              Advanced Filters
              {showAdvancedFilters ? (
                <FiChevronUp className="w-4 h-4" />
              ) : (
                <FiChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        {showAdvancedFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-900/50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Payment Status
              </label>
              <select className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600">
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Payment Method
              </label>
              <select className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600">
                <option value="all">All Methods</option>
                <option value="card">Card</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Amount Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600"
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/50">
        <div className="p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-semibold text-white">
            Recent Transactions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left p-4 text-gray-400 font-medium">
                  Member
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Amount
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Date
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Type
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Details
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Method
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {payments
                .filter(
                  (payment) => activeTab === "all" || payment.type === activeTab
                )
                .map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-white">
                        {payment.member}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white">${payment.amount}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-400">{payment.date}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          payment.type === "membership"
                            ? "bg-blue-500/10 text-blue-400"
                            : payment.type === "gym_registration"
                            ? "bg-orange-500/10 text-orange-400"
                            : "bg-green-500/10 text-green-400"
                        }`}
                      >
                        {payment.type.charAt(0).toUpperCase() +
                          payment.type.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-400">
                        {payment.plan || payment.package || payment.class}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        {payment.method === "card" ? (
                          <FiCreditCard className="w-4 h-4 mr-2 text-violet-400" />
                        ) : (
                          <FiDollarSign className="w-4 h-4 mr-2 text-green-400" />
                        )}
                        <span className="text-gray-400 capitalize">
                          {payment.method}
                        </span>
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
                        {payment.status === "completed" && (
                          <FiCheckCircle className="w-4 h-4 mr-1" />
                        )}
                        {payment.status === "pending" && (
                          <FiAlertCircle className="w-4 h-4 mr-1" />
                        )}
                        {payment.status === "failed" && (
                          <FiXCircle className="w-4 h-4 mr-1" />
                        )}
                        {payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                          <FiMoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Record Payment
                </h3>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPayment(null);
                    setAmount("");
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiXCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Payment Type
                  </label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  >
                    <option value="membership">Membership Payment</option>
                    <option value="instructor_package">
                      Instructor Package
                    </option>
                    <option value="class">Class Payment</option>
                    <option value="gym_registration">Gym Registration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    placeholder="Enter amount"
                    step="0.01"
                    min="0"
                  />
                </div>
                {amount && (
                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      amount={amount}
                      paymentType={paymentType}
                      onSuccess={handlePaymentSuccess}
                      onCancel={() => {
                        setShowPaymentModal(false);
                        setSelectedPayment(null);
                        setAmount("");
                      }}
                    />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
