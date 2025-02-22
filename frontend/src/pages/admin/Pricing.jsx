import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiDollarSign,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiCheck,
  FiX,
  FiSearch,
  FiFilter,
  FiArrowUp,
  FiArrowDown,
  FiUsers,
  FiClock,
  FiTrendingUp,
  FiPercent,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

function Pricing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGym, setSelectedGym] = useState("all");
  const [selectedPlanType, setSelectedPlanType] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const stats = [
    {
      title: "Total Revenue",
      value: "$45,678",
      change: "+23.4%",
      trend: "up",
      icon: FiDollarSign,
      color: "violet",
      description: "Monthly recurring revenue",
    },
    {
      title: "Active Plans",
      value: "186",
      change: "+15.2%",
      trend: "up",
      icon: FiUsers,
      color: "emerald",
      description: "Current subscriptions",
    },
    {
      title: "Avg. Duration",
      value: "8.5mo",
      change: "+5.7%",
      trend: "up",
      icon: FiClock,
      color: "blue",
      description: "Subscription length",
    },
    {
      title: "Conversion Rate",
      value: "68%",
      change: "+12.3%",
      trend: "up",
      icon: FiPercent,
      color: "amber",
      description: "Trial to paid",
    },
  ];

  // Sample data for pricing plans
  const pricingPlans = [
    {
      id: 1,
      name: "Basic Monthly",
      gym: "FitZone Elite",
      type: "Monthly",
      price: 49.99,
      subscribers: 245,
      revenue: 12245.55,
      features: [
        "Access to gym equipment",
        "Locker room access",
        "Basic fitness assessment",
      ],
      status: "active",
    },
    {
      id: 2,
      name: "Premium Quarterly",
      gym: "PowerFlex Gym",
      type: "Quarterly",
      price: 129.99,
      subscribers: 156,
      revenue: 20278.44,
      features: [
        "All Basic features",
        "Group classes included",
        "Personal training session (1x/month)",
        "Nutrition consultation",
      ],
      status: "active",
    },
    {
      id: 3,
      name: "Elite Annual",
      gym: "Wellness Hub",
      type: "Annual",
      price: 599.99,
      subscribers: 89,
      revenue: 53399.11,
      features: [
        "All Premium features",
        "Unlimited personal training",
        "Priority class booking",
        "Spa access",
        "Guest passes (2x/month)",
      ],
      status: "active",
    },
  ];

  // Generate more sample data for pagination demonstration
  const allPlans = [...Array(50)].map((_, index) => {
    const basePlan = pricingPlans[index % pricingPlans.length];
    return {
      ...basePlan,
      id: index + 1,
      name: `${basePlan.name} ${Math.floor(index / pricingPlans.length) + 1}`,
    };
  });

  const gyms = [
    { value: "all", label: "All Gyms" },
    { value: "FitZone Elite", label: "FitZone Elite" },
    { value: "PowerFlex Gym", label: "PowerFlex Gym" },
    { value: "Wellness Hub", label: "Wellness Hub" },
  ];

  const planTypes = [
    { value: "all", label: "All Types" },
    { value: "Monthly", label: "Monthly" },
    { value: "Quarterly", label: "Quarterly" },
    { value: "Annual", label: "Annual" },
  ];

  const filteredPlans = allPlans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.gym.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGym = selectedGym === "all" || plan.gym === selectedGym;
    const matchesPlanType =
      selectedPlanType === "all" || plan.type === selectedPlanType;

    return matchesSearch && matchesGym && matchesPlanType;
  });

  // Pagination calculations
  const totalItems = filteredPlans.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlans = filteredPlans.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Pricing Management
          </h1>
          <p className="text-gray-400 mt-1">
            Manage pricing plans and subscriptions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Add New Plan
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
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-4 top-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={selectedGym}
              onChange={(e) => setSelectedGym(e.target.value)}
              className="bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              {gyms.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={selectedPlanType}
              onChange={(e) => setSelectedPlanType(e.target.value)}
              className="bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              {planTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Plans Table */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left p-4 text-gray-400 font-medium">
                  Plan Name
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">Gym</th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Type
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Price
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Subscribers
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Revenue
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
              {currentPlans.map((plan) => (
                <tr
                  key={plan.id}
                  className="hover:bg-gray-700/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-medium text-white">{plan.name}</div>
                    <div className="text-sm text-gray-400">
                      {plan.features.length} features
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{plan.gym}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm">
                      {plan.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-white font-medium">${plan.price}</div>
                    <div className="text-sm text-gray-400">
                      per {plan.type.toLowerCase()}
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{plan.subscribers}</td>
                  <td className="p-4">
                    <div className="text-white font-medium">
                      ${plan.revenue.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">monthly</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        plan.status === "active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {plan.status === "active" ? (
                        <FiCheck className="w-4 h-4 mr-1" />
                      ) : (
                        <FiX className="w-4 h-4 mr-1" />
                      )}
                      {plan.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedPlan(plan)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="More"
                      >
                        <FiMoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-4 py-3 border-t border-gray-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="bg-gray-900/50 text-white rounded-lg px-2 py-1 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              {[5, 10, 25, 50].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-400">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
              {totalItems} entries
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronsLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show first page, last page, current page, and one page before and after current page
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`min-w-[2.5rem] h-10 rounded-lg ${
                          currentPage === pageNumber
                            ? "bg-violet-600 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                        } transition-colors`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span key={pageNumber} className="text-gray-600">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronsRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Plan Modal */}
      {(showAddModal || selectedPlan) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Modal Header */}
              <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
                <h3 className="text-2xl font-bold text-white">
                  {selectedPlan ? "Edit Plan" : "Add New Plan"}
                </h3>
              </div>

              {/* Modal Content */}
              <div className="bg-gray-800 px-6 py-4">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Plan Name
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                        placeholder="Basic Monthly"
                        value={selectedPlan?.name || ""}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Gym</label>
                      <select className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none">
                        {gyms
                          .filter((gym) => gym.value !== "all")
                          .map((gym) => (
                            <option key={gym.value} value={gym.value}>
                              {gym.label}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Plan Type
                      </label>
                      <select className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none">
                        {planTypes
                          .filter((type) => type.value !== "all")
                          .map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Price</label>
                      <div className="relative">
                        <span className="absolute left-4 top-2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          className="w-full bg-gray-900/50 text-white rounded-lg pl-8 pr-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                          placeholder="49.99"
                          value={selectedPlan?.price || ""}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Features</label>
                    <div className="space-y-2">
                      {(selectedPlan?.features || ["", "", ""]).map(
                        (feature, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              className="flex-1 bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                              placeholder="Enter feature"
                              value={feature}
                            />
                            <button
                              type="button"
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-violet-500 transition-colors"
                      >
                        <FiPlus className="w-5 h-5 mr-2" />
                        Add Feature
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedPlan(null);
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  {selectedPlan ? "Save Changes" : "Add Plan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pricing;
