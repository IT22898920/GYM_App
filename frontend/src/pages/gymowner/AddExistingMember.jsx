import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";
import api from "../../utils/api";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiUserPlus,
  FiCheckCircle,
  FiActivity,
  FiAlertCircle,
  FiArrowLeft,
  FiDollarSign,
  FiClock
} from "react-icons/fi";

function AddExistingMember() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [mode, setMode] = useState("search"); // "search" or "register"
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("email");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [adding, setAdding] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [lastPaymentDate, setLastPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dateOfBirth: "",
    height: "",
    weight: "",
    waist: "",
    hips: "",
    biceps: "",
    thighs: "",
    bmi: "",
    bodyFat: "",
    fitnessGoals: []
  });

  // Fetch membership plans on component mount
  const fetchMembershipPlans = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/members/membership-plans`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMembershipPlans(data.data.membershipPlans || []);
        if (data.data.membershipPlans?.length > 0) {
          setSelectedPlan(data.data.membershipPlans[0].name);
        }
      }
    } catch (error) {
      console.error("Error fetching membership plans:", error);
      showAlert("Failed to fetch membership plans", "error");
    } finally {
      setLoading(false);
    }
  };

  // Load membership plans when mode changes to register
  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === "register" && membershipPlans.length === 0) {
      fetchMembershipPlans();
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate BMI when height or weight changes
    if (name === "height" || name === "weight") {
      const height = name === "height" ? parseFloat(value) : parseFloat(formData.height);
      const weight = name === "weight" ? parseFloat(value) : parseFloat(formData.weight);

      if (height && weight) {
        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        setFormData(prev => ({
          ...prev,
          bmi: bmi
        }));
      }
    }
  };

  // Register new user as existing member
  const handleRegisterNewMember = async () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.password || !selectedPlan) {
      showAlert("Please fill in all required fields", "error");
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      showAlert("Passwords do not match", "error");
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      showAlert("Password must be at least 6 characters long", "error");
      return;
    }

    setAdding(true);
    try {
      const selectedPlanDetails = membershipPlans.find(
        plan => plan.name === selectedPlan
      );

      // Calculate next payment date (30 days from last payment)
      const lastPayment = new Date(lastPaymentDate);
      const nextPayment = new Date(lastPayment);
      nextPayment.setDate(nextPayment.getDate() + 30);

      const response = await api.addExistingUserAsMember({
        // No userId since we're creating a new user
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password, // Custom password
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        membershipPlan: selectedPlan,
        membershipPrice: selectedPlanDetails.price,
        membershipFeatures: selectedPlanDetails.benefits || selectedPlanDetails.features || [],
        bodyMeasurements: {
          height: formData.height || null,
          weight: formData.weight || null,
          waist: formData.waist || null,
          hips: formData.hips || null,
          biceps: formData.biceps || null,
          thighs: formData.thighs || null,
          bmi: formData.bmi || null,
          bodyFat: formData.bodyFat || null
        },
        fitnessGoals: formData.fitnessGoals,
        paymentDetails: {
          paymentStatus: paymentStatus,
          lastPaymentDate: lastPaymentDate,
          nextPaymentDate: nextPayment.toISOString().split('T')[0]
        },
        isNewExistingMember: true, // Flag to indicate this is a new user being registered as existing member
        useCustomPassword: true // Flag to use custom password instead of generating
      });

      if (response.success) {
        console.log("🔐 New Member Login Credentials:", {
          email: formData.email,
          password: formData.password,
          name: `${formData.firstName} ${formData.lastName}`
        });
        
        showAlert(
          `Member registered successfully! 🎉\n\nLogin Credentials:\nEmail: ${formData.email}\nPassword: ${formData.password}\n\nThey can now login as a customer. Credentials also sent via notification.`,
          "success"
        );
        navigate("/gym-owner/members");
      } else {
        throw new Error(response.message || "Failed to register member");
      }
    } catch (error) {
      console.error("Error registering member:", error);
      showAlert(error.message || "Failed to register member", "error");
    } finally {
      setAdding(false);
    }
  };

  // Search for existing users
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      showAlert("Please enter a search term", "error");
      return;
    }

    setSearching(true);
    try {
      const response = await api.searchExistingUsers(searchTerm, searchType);
      if (response.success) {
        setSearchResults(response.data);
        if (response.data.length === 0) {
          showAlert("No users found with this " + searchType, "info");
        }
      }
    } catch (error) {
      console.error("Error searching users:", error);
      showAlert("Failed to search users", "error");
    } finally {
      setSearching(false);
    }
  };

  // Fetch membership plans when a user is selected
  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setLoading(true);
    
    // Pre-fill form data with user information
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      gender: user.gender || "",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : "",
      height: "",
      weight: "",
      waist: "",
      hips: "",
      biceps: "",
      thighs: "",
      bmi: "",
      bodyFat: "",
      fitnessGoals: []
    });
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/members/membership-plans`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMembershipPlans(data.data.membershipPlans || []);
        if (data.data.membershipPlans?.length > 0) {
          setSelectedPlan(data.data.membershipPlans[0].name);
        }
      }
    } catch (error) {
      console.error("Error fetching membership plans:", error);
      showAlert("Failed to fetch membership plans", "error");
    } finally {
      setLoading(false);
    }
  };

  // Add selected user as member
  const handleAddMember = async () => {
    if (!selectedUser || !selectedPlan) {
      showAlert("Please select a user and membership plan", "error");
      return;
    }

    setAdding(true);
    try {
      const selectedPlanDetails = membershipPlans.find(
        plan => plan.name === selectedPlan
      );

      // Calculate next payment date (30 days from last payment)
      const lastPayment = new Date(lastPaymentDate);
      const nextPayment = new Date(lastPayment);
      nextPayment.setDate(nextPayment.getDate() + 30);

      const response = await api.addExistingUserAsMember({
        userId: selectedUser._id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        membershipPlan: selectedPlan,
        membershipPrice: selectedPlanDetails.price,
        membershipFeatures: selectedPlanDetails.benefits || selectedPlanDetails.features || [],
        bodyMeasurements: {
          height: formData.height || null,
          weight: formData.weight || null,
          waist: formData.waist || null,
          hips: formData.hips || null,
          biceps: formData.biceps || null,
          thighs: formData.thighs || null,
          bmi: formData.bmi || null,
          bodyFat: formData.bodyFat || null
        },
        fitnessGoals: formData.fitnessGoals,
        paymentDetails: {
          paymentStatus: paymentStatus,
          lastPaymentDate: lastPaymentDate,
          nextPaymentDate: nextPayment.toISOString().split('T')[0]
        },
        isExistingMember: true
      });

      if (response.success) {
        showAlert("Member added successfully! Login credentials have been sent to their email.", "success");
        navigate("/gym-owner/members");
      } else {
        throw new Error(response.message || "Failed to add member");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      showAlert(error.message || "Failed to add member", "error");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Add Existing Member</h1>
            <p className="text-gray-400">Add people who are already attending your gym but not registered in the system</p>
          </div>
          <button
            onClick={() => navigate("/gym-owner/members")}
            className="flex items-center px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Back to Members
          </button>
        </div>

        {/* Mode Selection */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30">
          <h2 className="text-xl font-semibold text-white mb-4">Choose Registration Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleModeChange("search")}
              className={`p-4 rounded-lg border transition-all text-left ${
                mode === "search"
                  ? "bg-violet-600/20 border-violet-500"
                  : "bg-gray-900/50 border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center space-x-3">
                <FiSearch className="w-6 h-6 text-violet-400" />
                <div>
                  <h3 className="text-white font-medium">Find Existing User</h3>
                  <p className="text-gray-400 text-sm">Search for users already in the system</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => handleModeChange("register")}
              className={`p-4 rounded-lg border transition-all text-left ${
                mode === "register"
                  ? "bg-violet-600/20 border-violet-500"
                  : "bg-gray-900/50 border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center space-x-3">
                <FiUserPlus className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="text-white font-medium">Register New Person</h3>
                  <p className="text-gray-400 text-sm">Register someone completely new to the system</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Search Section - Only show if mode is search */}
        {mode === "search" && (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FiSearch className="w-5 h-5 mr-2 text-violet-400" />
              Search Existing Users
            </h2>

          <div className="space-y-4">
            {/* Search Type Selection */}
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="email"
                  checked={searchType === "email"}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="mr-2 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-gray-300">Search by Email</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="phone"
                  checked={searchType === "phone"}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="mr-2 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-gray-300">Search by Phone</span>
              </label>
            </div>

            {/* Search Input */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={searchType === "email" ? "Enter email address..." : "Enter phone number..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full bg-gray-900/50 text-white rounded-lg pl-10 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                />
                {searchType === "email" ? (
                  <FiMail className="absolute left-3 top-3.5 text-gray-500" />
                ) : (
                  <FiPhone className="absolute left-3 top-3.5 text-gray-500" />
                )}
              </div>
              <button
                onClick={handleSearch}
                disabled={searching}
                className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {searching ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <FiSearch className="w-5 h-5 mr-2" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
          </div>
        )}

        {/* Registration Form - Only show if mode is register */}
        {mode === "register" && (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FiUserPlus className="w-5 h-5 mr-2 text-green-400" />
              Register New Person as Existing Member
            </h2>
            
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <FiAlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-300 font-medium mb-1">
                    About This Feature
                  </p>
                  <p className="text-xs text-gray-400">
                    Use this to register people who are already attending your gym but aren't in the digital system yet. 
                    If someone with this email already exists in the system, they'll be added to your gym as a member.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="Enter first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="Enter password"
                    minLength="6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="Confirm password"
                    minLength="6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Body Measurements (Optional) */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Body Measurements (Optional)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      BMI
                    </label>
                    <input
                      type="number"
                      name="bmi"
                      value={formData.bmi}
                      readOnly
                      className="w-full bg-gray-700/50 text-gray-400 rounded-lg px-4 py-3 border border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Waist (cm)
                    </label>
                    <input
                      type="number"
                      name="waist"
                      value={formData.waist}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Payment Status
                    </label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Last Payment Date
                    </label>
                    <input
                      type="date"
                      value={lastPaymentDate}
                      onChange={(e) => setLastPaymentDate(e.target.value)}
                      className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <FiClock className="w-5 h-5 text-violet-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-violet-300">
                        Next payment will be due 30 days from the last payment date
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Next Payment: {new Date(new Date(lastPaymentDate).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Membership Plan Selection */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Select Membership Plan *</h3>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-600 mx-auto"></div>
                  </div>
                ) : membershipPlans.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FiAlertCircle className="w-12 h-12 mx-auto mb-2" />
                    <p>No membership plans available. Please create plans first.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {membershipPlans.map((plan) => (
                      <label
                        key={plan.name}
                        className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedPlan === plan.name
                            ? "bg-violet-600/20 border-violet-500"
                            : "bg-gray-900/50 border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="plan"
                          value={plan.name}
                          checked={selectedPlan === plan.name}
                          onChange={(e) => setSelectedPlan(e.target.value)}
                          className="hidden"
                        />
                        <div className="space-y-2">
                          <h4 className="text-white font-medium">{plan.name}</h4>
                          <p className="text-2xl font-bold text-violet-400">
                            ${plan.price}
                            <span className="text-sm text-gray-400 font-normal">/month</span>
                          </p>
                          {plan.features && (
                            <ul className="space-y-1">
                              {plan.features.slice(0, 3).map((feature, idx) => (
                                <li key={idx} className="text-gray-400 text-sm">
                                  • {feature}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setMode("search");
                    setFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phoneNumber: "",
                      password: "",
                      confirmPassword: "",
                      gender: "",
                      dateOfBirth: "",
                      height: "",
                      weight: "",
                      waist: "",
                      hips: "",
                      biceps: "",
                      thighs: "",
                      bmi: "",
                      bodyFat: "",
                      fitnessGoals: []
                    });
                  }}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegisterNewMember}
                  disabled={adding || !selectedPlan}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {adding ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                      Registering...
                    </>
                  ) : (
                    <>
                      <FiUserPlus className="w-5 h-5 mr-2" />
                      Register as Member
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Results - Only show if mode is search */}
        {mode === "search" && searchResults.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30">
            <h2 className="text-xl font-semibold text-white mb-4">
              Search Results ({searchResults.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedUser?._id === user._id
                      ? "bg-violet-600/20 border-violet-500"
                      : "bg-gray-900/50 border-gray-700 hover:border-gray-600"
                  }`}
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                        <FiUser className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        {user.phoneNumber && (
                          <p className="text-gray-400 text-sm">{user.phoneNumber}</p>
                        )}
                      </div>
                    </div>
                    {selectedUser?._id === user._id && (
                      <FiCheckCircle className="w-5 h-5 text-violet-400" />
                    )}
                  </div>
                  
                  {/* User Details */}
                  <div className="mt-3 space-y-1 text-sm">
                    {user.currentGym && (
                      <div className="flex items-center text-yellow-400">
                        <FiAlertCircle className="w-4 h-4 mr-2" />
                        Already member at: {user.currentGym}
                      </div>
                    )}
                    {user.role && (
                      <div className="flex items-center text-gray-400">
                        <FiActivity className="w-4 h-4 mr-2" />
                        Role: {user.role}
                      </div>
                    )}
                    {user.dateOfBirth && (
                      <div className="flex items-center text-gray-400">
                        <FiCalendar className="w-4 h-4 mr-2" />
                        DOB: {new Date(user.dateOfBirth).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected User & Membership Plan - Only show if mode is search */}
        {mode === "search" && selectedUser && (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30">
            <h2 className="text-xl font-semibold text-white mb-4">
              Membership Details
            </h2>

            {/* Selected User Info */}
            <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-2">Selected User</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-gray-400 text-sm">{selectedUser.email}</p>
                </div>
              </div>
            </div>

            {/* Payment History Section */}
            <div className="mb-6 space-y-4">
              <h3 className="text-gray-400 text-sm mb-3">Payment Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Last Payment Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Last Payment Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={lastPaymentDate}
                      onChange={(e) => setLastPaymentDate(e.target.value)}
                      className="w-full bg-gray-900/50 text-white rounded-lg pl-10 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    />
                    <FiCalendar className="absolute left-3 top-3.5 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <FiClock className="w-5 h-5 text-violet-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-violet-300">
                      Next payment will be due 30 days from the last payment date
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Next Payment: {new Date(new Date(lastPaymentDate).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Membership Plan Selection */}
            <div>
              <h3 className="text-gray-400 text-sm mb-3">Select Membership Plan</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-600 mx-auto"></div>
                </div>
              ) : membershipPlans.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FiAlertCircle className="w-12 h-12 mx-auto mb-2" />
                  <p>No membership plans available. Please create plans first.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {membershipPlans.map((plan) => (
                    <label
                      key={plan.name}
                      className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedPlan === plan.name
                          ? "bg-violet-600/20 border-violet-500"
                          : "bg-gray-900/50 border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={plan.name}
                        checked={selectedPlan === plan.name}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        className="hidden"
                      />
                      <div className="space-y-2">
                        <h4 className="text-white font-medium">{plan.name}</h4>
                        <p className="text-2xl font-bold text-violet-400">
                          ${plan.price}
                          <span className="text-sm text-gray-400 font-normal">/month</span>
                        </p>
                        {plan.features && (
                          <ul className="space-y-1">
                            {plan.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="text-gray-400 text-sm">
                                • {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setSelectedPlan("");
                }}
                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                disabled={adding || !selectedPlan}
                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {adding ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <FiUserPlus className="w-5 h-5 mr-2" />
                    Add as Member
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddExistingMember;