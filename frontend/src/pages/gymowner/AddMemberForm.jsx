import { useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FiCreditCard, FiDollarSign } from "react-icons/fi";

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

const membershipPlans = [
  {
    name: "Basic",
    price: 29.99,
    features: [
      "Access to gym equipment",
      "Locker room access",
      "Basic fitness assessment",
    ],
  },
  {
    name: "Premium",
    price: 49.99,
    features: [
      "All Basic features",
      "2 Personal training sessions",
      "Nutrition consultation",
    ],
  },
  {
    name: "Elite",
    price: 99.99,
    features: [
      "All Premium features",
      "Unlimited training sessions",
      "Priority booking",
    ],
  },
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Payment Method</h3>
          <span className="text-2xl font-bold text-white">
            ${selectedPlan.price}
          </span>
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
          className={`flex-1 p-3 bg-violet-600 text-white rounded-lg font-medium transition
            ${
              processing
                ? "opacity-75 cursor-not-allowed"
                : "hover:bg-violet-700"
            }`}
        >
          {processing ? "Processing..." : "Complete Registration"}
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

export default function AddMemberForm({ onSuccess, onCancel }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    height: "",
    weight: "",
    waist: "",
    bmi: "",
    bodyFat: "",
    hips: "",
    biceps: "",
    thighs: "",
    fitnessGoals: [],
    membershipPlan: membershipPlans[0].name,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Calculate BMI when height or weight changes
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
      if (!formData.email) newErrors.email = "Email is required";
      if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Invalid email format";
      if (!formData.phoneNumber)
        newErrors.phoneNumber = "Phone number is required";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
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
    onSuccess({
      ...formData,
      paymentDetails,
    });
  };

  const selectedPlan = membershipPlans.find(
    (plan) => plan.name === formData.membershipPlan
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[
          "Personal Info",
          "Body Measurements",
          "Membership & Goals",
          "Payment",
        ].map((stepName, index) => (
          <div key={stepName} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step > index + 1
                  ? "bg-green-500"
                  : step === index + 1
                  ? "bg-violet-500"
                  : "bg-gray-700"
              } text-white font-medium`}
            >
              {index + 1}
            </div>
            <div
              className={`ml-2 ${
                step > index + 1
                  ? "text-green-500"
                  : step === index + 1
                  ? "text-violet-500"
                  : "text-gray-500"
              }`}
            >
              {stepName}
            </div>
            {index < 3 && (
              <div
                className={`w-12 h-0.5 mx-2 ${
                  step > index + 1 ? "bg-green-500" : "bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-700 text-white rounded-lg border ${
                    errors.firstName ? "border-red-500" : "border-gray-600"
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
                  className={`w-full p-3 bg-gray-700 text-white rounded-lg border ${
                    errors.lastName ? "border-red-500" : "border-gray-600"
                  } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
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
                  className={`w-full p-3 bg-gray-700 text-white rounded-lg border ${
                    errors.gender ? "border-red-500" : "border-gray-600"
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
                  className={`w-full p-3 bg-gray-700 text-white rounded-lg border ${
                    errors.dateOfBirth ? "border-red-500" : "border-gray-600"
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
                  className={`w-full p-3 bg-gray-700 text-white rounded-lg border ${
                    errors.email ? "border-red-500" : "border-gray-600"
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
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-700 text-white rounded-lg border ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-600"
                  } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20`}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber}
                  </p>
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
                  className={`w-full p-3 bg-gray-700 text-white rounded-lg border ${
                    errors.password ? "border-red-500" : "border-gray-600"
                  } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
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
                  className={`w-full p-3 bg-gray-700 text-white rounded-lg border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-600"
                  } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
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

      {/* Step 2: Body Measurements */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Body Measurements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-700 text-white rounded-lg border ${
                    errors.height ? "border-red-500" : "border-gray-600"
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
                  className={`w-full p-3 bg-gray-700 text-white rounded-lg border ${
                    errors.weight ? "border-red-500" : "border-gray-600"
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
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
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
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
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
                  className={`w-full p-3 bg-gray-700 text-white rounded-lg border ${
                    errors.waist ? "border-red-500" : "border-gray-600"
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
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
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
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
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
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
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

      {/* Step 3: Membership & Goals */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                Membership Plan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {membershipPlans.map((plan) => (
                  <label
                    key={plan.name}
                    className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                      formData.membershipPlan === plan.name
                        ? "bg-violet-500/20 border-violet-500"
                        : "bg-gray-700 border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="membershipPlan"
                      value={plan.name}
                      checked={formData.membershipPlan === plan.name}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div>
                      <div className="font-medium text-white">{plan.name}</div>
                      <div className="text-2xl font-bold text-white mt-2">
                        ${plan.price}
                        <span className="text-sm font-normal text-gray-400">
                          /month
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
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                Fitness Goals
              </h3>
              <div className="flex flex-wrap gap-3">
                {fitnessGoals.map((goal) => (
                  <label
                    key={goal}
                    className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
                      formData.fitnessGoals.includes(goal)
                        ? "bg-violet-500 text-white"
                        : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.fitnessGoals.includes(goal)}
                      onChange={() => handleGoalToggle(goal)}
                      className="hidden"
                    />
                    {goal}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
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

      {/* Step 4: Payment */}
      {step === 4 && (
        <Elements stripe={stripePromise}>
          <PaymentForm
            onSuccess={handlePaymentSuccess}
            onCancel={() => handleBack()}
            selectedPlan={selectedPlan}
          />
        </Elements>
      )}
    </div>
  );
}
