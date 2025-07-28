import { useState, useEffect } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FiCreditCard, FiDollarSign, FiArrowLeft, FiLoader } from "react-icons/fi";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const stripePromise = loadStripe("your_publishable_key");

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#fff",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const fitnessGoals = [
  "Weight Loss",
  "Muscle Gain",
  "Strength Training",
  "Cardio Fitness",
  "Flexibility",
  "Body Recomposition",
  "Athletic Performance",
  "General Fitness",
];

function PaymentForm({ onSuccess, onCancel, selectedPlan }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === "manual") {
      onSuccess({ paymentMethod: "manual" });
      return;
    }

    if (!stripe || !elements) {
      return;
    }

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

      onSuccess({ paymentMethod: "card" });
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Payment Method</h2>
        <span className="text-2xl font-bold text-white">
          Rs. {selectedPlan.price}
        </span>
      </div>

      <div className="space-y-4">
        <label
          className={`block p-4 rounded-lg border cursor-pointer transition-all ${
            paymentMethod === "card"
              ? "bg-violet-900/20 border-violet-500"
              : "bg-gray-800 border-gray-700 hover:border-gray-600"
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
              ? "bg-violet-900/20 border-violet-500"
              : "bg-gray-800 border-gray-700 hover:border-gray-600"
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
              <div className="text-sm text-gray-400">Pay at the front desk</div>
            </div>
          </div>
        </label>

        {paymentMethod === "card" && (
          <div className="mt-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={processing}
          className="flex-1 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
        >
          Complete Registration
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function CustomerRegisterGym() {
  const { gymId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [gym, setGym] = useState(null);
  const [gymLoading, setGymLoading] = useState(true);
  const [gymError, setGymError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    height: "",
    weight: "",
    bmi: "",
    bodyFat: "",
    waist: "",
    hips: "",
    biceps: "",
    thighs: "",
    plan: "basic",
    fitnessGoals: [],
    paymentMethod: "card",
  });

  const [errors, setErrors] = useState({});

  // Fetch gym data
  useEffect(() => {
    const fetchGym = async () => {
      if (!gymId) {
        setGymError('No gym ID provided');
        setGymLoading(false);
        return;
      }

      try {
        setGymLoading(true);
        setGymError(null);
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/gyms/${gymId}`);
        
        if (response.data.success) {
          setGym(response.data.data);
        } else {
          setGymError('Failed to load gym information');
        }
      } catch (error) {
        console.error('Error fetching gym:', error);
        setGymError('Failed to load gym information. Please try again.');
      } finally {
        setGymLoading(false);
      }
    };

    fetchGym();
  }, [gymId]);

  // Use gym's membership plans if available, otherwise use default plans
  const plans = gym?.pricing?.membershipPlans && gym.pricing.membershipPlans.length > 0 
    ? gym.pricing.membershipPlans.map(plan => ({
        name: plan.name,
        price: plan.price,
        period: `/${plan.duration}`,
        features: plan.benefits || [
          "Access to gym equipment",
          "Locker room access",
          "Basic fitness assessment",
        ],
      }))
    : [
        {
          name: "Basic",
          price: 29.99,
          period: "/month",
          features: [
            "Access to gym equipment",
            "Locker room access",
            "Basic fitness assessment",
          ],
        },
        {
          name: "Premium",
          price: 49.99,
          period: "/month",
          features: [
            "All Basic features",
            "2 Personal training sessions",
            "Nutrition consultation",
          ],
        },
        {
          name: "Elite",
          price: 99.99,
          period: "/month",
          features: [
            "All Premium features",
            "Unlimited training sessions",
            "Priority booking",
          ],
        },
      ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "height" || name === "weight") {
      const height =
        name === "height" ? parseFloat(value) : parseFloat(formData.height);
      const weight =
        name === "weight" ? parseFloat(value) : parseFloat(formData.weight);

      if (height && weight) {
        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        setFormData((prev) => ({
          ...prev,
          bmi: bmi,
        }));
      }
    }
  };

  const handleGoalToggle = (goal) => {
    setFormData((prev) => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.includes(goal)
        ? prev.fitnessGoals.filter((g) => g !== goal)
        : [...prev.fitnessGoals, goal],
    }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Invalid email format";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else if (step === 2) {
      if (!formData.height) newErrors.height = "Height is required";
      if (!formData.weight) newErrors.weight = "Weight is required";
      if (!formData.waist) newErrors.waist = "Waist measurement is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handlePaymentSuccess = (paymentDetails) => {
    // Handle successful registration
    console.log('Registration successful:', {
      ...formData,
      paymentDetails,
      gymId,
    });
    
    // You can add API call here to submit the registration
    // For now, redirect to success page or gym page
    navigate('/find-gym', { 
      state: { 
        message: 'Registration successful! Welcome to ' + (gym?.gymName || 'the gym') + '!' 
      } 
    });
  };

  const handleCancel = () => {
    navigate('/find-gym');
  };

  const selectedPlan = plans.find(
    (p) => p.name.toLowerCase() === formData.plan
  );

  // Show loading state while fetching gym data
  if (gymLoading) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-violet-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading gym information...</p>
        </div>
      </div>
    );
  }

  // Show error state if gym fetch failed
  if (gymError) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Gym</h2>
            <p className="text-red-300 mb-4">{gymError}</p>
            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <Link
                to="/find-gym"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Gyms
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mb-8">
        <Link
          to="/find-gym"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors group"
        >
          <FiArrowLeft className="w-15 h-16 mr-6 transform group-hover:-translate-x-1 transition-transform" />
          Back to previous
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Gym Information Header */}
        {gym && (
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 mb-8">
            <div className="flex items-center space-x-4">
              {gym.logo?.url && (
                <img
                  src={gym.logo.url}
                  alt={`${gym.gymName} Logo`}
                  className="h-16 w-16 object-contain rounded-lg"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">{gym.gymName}</h1>
                <p className="text-gray-400">{gym.address?.city}, {gym.address?.state}</p>
                <p className="text-sm text-gray-500 mt-1">Join this amazing gym and start your fitness journey!</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          {[
            { name: "Personal Info", step: 1 },
            { name: "Body Measurements", step: 2 },
            { name: "Membership & Goals", step: 3 },
            { name: "Payment", step: 4 },
          ].map((item, index) => (
            <div key={item.name} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step > item.step
                    ? "bg-green-500"
                    : step === item.step
                    ? "bg-violet-600"
                    : "bg-gray-700"
                } text-white font-medium transition-colors duration-300`}
              >
                {item.step}
              </div>
              <div
                className={`ml-2 ${
                  step > item.step
                    ? "text-green-500"
                    : step === item.step
                    ? "text-violet-400"
                    : "text-gray-500"
                } transition-colors duration-300`}
              >
                {item.name}
              </div>
              {index < 3 && (
                <div
                  className={`w-12 h-0.5 mx-2 ${
                    step > item.step ? "bg-green-500" : "bg-gray-700"
                  } transition-colors duration-300`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50 shadow-lg">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full p-3 bg-gray-800 text-white rounded-lg border ${
                      errors.firstName ? "border-red-500" : "border-gray-700"
                    } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full p-3 bg-gray-800 text-white rounded-lg border ${
                      errors.lastName ? "border-red-500" : "border-gray-700"
                    } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full p-3 bg-gray-800 text-white rounded-lg border ${
                      errors.gender ? "border-red-500" : "border-gray-700"
                    } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`w-full p-3 bg-gray-800 text-white rounded-lg border ${
                      errors.dateOfBirth ? "border-red-500" : "border-gray-700"
                    } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 bg-gray-800 text-white rounded-lg border ${
                      errors.email ? "border-red-500" : "border-gray-700"
                    } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-3 bg-gray-800 text-white rounded-lg border ${
                      errors.phone ? "border-red-500" : "border-gray-700"
                    } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-3 bg-gray-800 text-white rounded-lg border ${
                      errors.password ? "border-red-500" : "border-gray-700"
                    } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full p-3 bg-gray-800 text-white rounded-lg border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-700"
                    } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">
                Body Measurements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className={`w-full p-3 bg-gray-800 text-white rounded-lg border ${
                      errors.height ? "border-red-500" : "border-gray-700"
                    } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20`}
                  />
                  {errors.height && (
                    <p className="text-red-500 text-sm mt-1">{errors.height}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className={`w-full p-3 bg-gray-800 text-white rounded-lg border ${
                      errors.weight ? "border-red-500" : "border-gray-700"
                    } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20`}
                  />
                  {errors.weight && (
                    <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    BMI
                  </label>
                  <input
                    type="number"
                    name="bmi"
                    value={formData.bmi}
                    readOnly
                    className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Body Fat %
                  </label>
                  <input
                    type="number"
                    name="bodyFat"
                    value={formData.bodyFat}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Waist (cm)
                  </label>
                  <input
                    type="number"
                    name="waist"
                    value={formData.waist}
                    onChange={handleChange}
                    className={`w-full p-3 bg-gray-800 text-white rounded-lg border ${
                      errors.waist ? "border-red-500" : "border-gray-700"
                    } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20`}
                  />
                  {errors.waist && (
                    <p className="text-red-500 text-sm mt-1">{errors.waist}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Hips (cm)
                  </label>
                  <input
                    type="number"
                    name="hips"
                    value={formData.hips}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Biceps (cm)
                  </label>
                  <input
                    type="number"
                    name="biceps"
                    value={formData.biceps}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Thighs (cm)
                  </label>
                  <input
                    type="number"
                    name="thighs"
                    value={formData.thighs}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">
                Membership Plan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <label
                    key={plan.name}
                    className={`block p-6 rounded-lg border cursor-pointer transition-all ${
                      formData.plan === plan.name.toLowerCase()
                        ? "bg-violet-900/20 border-violet-500"
                        : "bg-gray-800 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={plan.name.toLowerCase()}
                      checked={formData.plan === plan.name.toLowerCase()}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div>
                      <div className="font-medium text-white">{plan.name}</div>
                      <div className="text-2xl font-bold text-white mt-2">
                        Rs. {plan.price}
                        <span className="text-sm font-normal text-gray-400">
                          {plan.period}
                        </span>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {plan.features.map((feature, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-400 flex items-center"
                          >
                            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </label>
                ))}
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Fitness Goals
                </h2>
                <div className="flex flex-wrap gap-3">
                  {fitnessGoals.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => handleGoalToggle(goal)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        formData.fitnessGoals.includes(goal)
                          ? "bg-violet-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <Elements stripe={stripePromise}>
              <PaymentForm
                onSuccess={handlePaymentSuccess}
                onCancel={handleCancel}
                selectedPlan={selectedPlan}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
