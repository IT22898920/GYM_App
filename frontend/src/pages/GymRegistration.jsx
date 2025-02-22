import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiCreditCard,
  FiCheck,
  FiActivity,
  FiDollarSign,
  FiClock,
} from "react-icons/fi";

function GymRegistration() {
  const { gymId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    emergencyContact: "",
    emergencyPhone: "",
    address: "",
    healthConditions: "",
    fitnessGoals: "",
    termsAccepted: false,
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Sample gym data - replace with actual data fetch based on gymId
  const gymDetails = {
    id: gymId,
    name: "FitZone Elite",
    location: "Downtown",
    membershipPlans: [
      {
        id: 1,
        name: "Basic",
        duration: "Monthly",
        price: 49.99,
        features: [
          "Access to gym equipment",
          "Locker room access",
          "Basic fitness assessment",
        ],
      },
      {
        id: 2,
        name: "Premium",
        duration: "Monthly",
        price: 79.99,
        features: [
          "All Basic features",
          "Group classes included",
          "Personal training session (1x/month)",
          "Nutrition consultation",
        ],
      },
      {
        id: 3,
        name: "Elite",
        duration: "Monthly",
        price: 129.99,
        features: [
          "All Premium features",
          "Unlimited personal training",
          "Priority class booking",
          "Spa access",
          "Guest passes (2x/month)",
        ],
      },
    ],
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsConfirmed(true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-gray-300 mb-2">First Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-3.5 text-gray-500" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="John"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-gray-300 mb-2">Last Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-3.5 text-gray-500" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-3.5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-gray-300 mb-2">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-3.5 text-gray-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-gray-300 mb-2">Date of Birth</label>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-3.5 text-gray-500" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-gray-300 mb-2">
                  Emergency Contact
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-3.5 text-gray-500" />
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="Emergency contact name"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-gray-300 mb-2">
                  Emergency Phone
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-3.5 text-gray-500" />
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-gray-300 mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="Your address"
              ></textarea>
            </div>

            <div className="group">
              <label className="block text-gray-300 mb-2">
                Health Conditions (Optional)
              </label>
              <textarea
                name="healthConditions"
                value={formData.healthConditions}
                onChange={handleChange}
                rows="2"
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="List any health conditions or injuries we should know about"
              ></textarea>
            </div>

            <div className="group">
              <label className="block text-gray-300 mb-2">Fitness Goals</label>
              <textarea
                name="fitnessGoals"
                value={formData.fitnessGoals}
                onChange={handleChange}
                rows="2"
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="What are your fitness goals?"
              ></textarea>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Choose Your Membership Plan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gymDetails.membershipPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`group cursor-pointer bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] relative overflow-hidden ${
                    selectedPlan === plan.id
                      ? "border-violet-500"
                      : "border-gray-700/50"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="text-3xl font-bold text-white mb-4">
                      ${plan.price}
                      <span className="text-sm font-normal text-gray-400">
                        /{plan.duration.toLowerCase()}
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-400"
                        >
                          <FiCheck className="w-5 h-5 text-violet-400 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {selectedPlan === plan.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                          <FiCheck className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Payment Information
            </h2>

            {/* Selected Plan Summary */}
            <div className="bg-gray-900/50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Selected Plan
                </h3>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Change Plan
                </button>
              </div>
              {selectedPlan && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Plan</span>
                    <span className="text-white">
                      {
                        gymDetails.membershipPlans.find(
                          (p) => p.id === selectedPlan
                        )?.name
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Duration</span>
                    <span className="text-white">
                      {
                        gymDetails.membershipPlans.find(
                          (p) => p.id === selectedPlan
                        )?.duration
                      }
                    </span>
                  </div>
                  <div className="h-px bg-gray-700 my-4"></div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Total</span>
                    <span className="text-2xl font-bold text-white">
                      $
                      {
                        gymDetails.membershipPlans.find(
                          (p) => p.id === selectedPlan
                        )?.price
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-gray-300 mb-4">Payment Method</label>
              <div className="grid grid-cols-2 gap-4">
                {["credit-card", "paypal"].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center justify-center gap-2 p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                      paymentMethod === method
                        ? "bg-violet-600 border-violet-500 text-white"
                        : "bg-gray-900/50 border-gray-700 text-gray-400 hover:bg-gray-800/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="hidden"
                    />
                    <FiCreditCard
                      className={`w-5 h-5 ${
                        paymentMethod === method
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                    />
                    {method === "credit-card" ? "Credit Card" : "PayPal"}
                  </label>
                ))}
              </div>
            </div>

            {/* Credit Card Form */}
            {paymentMethod === "credit-card" && (
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-gray-300 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-gray-300 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-gray-300 mb-2">CVC</label>
                    <input
                      type="text"
                      className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="group">
              <label className="flex items-center space-x-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      formData.termsAccepted
                        ? "bg-violet-500 border-violet-500"
                        : "border-gray-600"
                    }`}
                  >
                    {formData.termsAccepted && (
                      <FiCheck className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <span className="text-gray-300">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
        {/* Back Button */}
        <Link
          to="/find-gym"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 group transition-colors"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Gym Search
        </Link>

        <div className="max-w-4xl mx-auto">
          {!isConfirmed ? (
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50">
              {/* Progress Steps */}
              <div className="mb-12">
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-700 -translate-y-1/2"></div>
                  {["Personal Info", "Choose Plan", "Payment"].map(
                    (step, index) => (
                      <div
                        key={step}
                        className={`relative flex flex-col items-center ${
                          index + 1 === currentStep
                            ? "text-violet-400"
                            : index + 1 < currentStep
                            ? "text-green-400"
                            : "text-gray-500"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index + 1 === currentStep
                              ? "bg-violet-500"
                              : index + 1 < currentStep
                              ? "bg-green-500"
                              : "bg-gray-700"
                          } text-white text-sm transition-colors z-10`}
                        >
                          {index + 1 < currentStep ? (
                            <FiCheck className="w-5 h-5" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span className="mt-2 text-sm font-medium">{step}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {renderStep()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-8 border-t border-gray-700">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => prev + 1)}
                      className="ml-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 relative group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      <span className="relative z-10">Next</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={
                        !selectedPlan ||
                        !paymentMethod ||
                        !formData.termsAccepted ||
                        isProcessing
                      }
                      className="ml-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 relative group overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      <span className="relative z-10">
                        {isProcessing ? (
                          <svg
                            className="animate-spin h-5 w-5 text-white mx-auto"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          "Complete Registration"
                        )}
                      </span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            // Registration Success
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6">
                <FiCheck className="w-10 h-10 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Welcome to {gymDetails.name}!
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Your membership registration has been completed successfully
              </p>

              <div className="max-w-lg mx-auto bg-gray-900/50 rounded-xl p-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Membership Plan</span>
                    <span className="text-white">
                      {
                        gymDetails.membershipPlans.find(
                          (p) => p.id === selectedPlan
                        )?.name
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Duration</span>
                    <span className="text-white">
                      {
                        gymDetails.membershipPlans.find(
                          (p) => p.id === selectedPlan
                        )?.duration
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Location</span>
                    <span className="text-white">{gymDetails.location}</span>
                  </div>
                  <div className="h-px bg-gray-700 my-4"></div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Membership ID</span>
                    <span className="text-white font-mono">
                      {`MEM${Math.random()
                        .toString(36)
                        .substr(2, 9)
                        .toUpperCase()}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-400">
                  Check your email for your membership details and next steps.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/classes"
                    className="inline-flex items-center justify-center px-8 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    Browse Classes
                  </Link>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center justify-center px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Download Receipt
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GymRegistration;
