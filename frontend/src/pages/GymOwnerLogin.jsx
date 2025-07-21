import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiArrowLeft,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiActivity,
  FiHome,
  FiUsers,
  FiTrendingUp,
  FiMapPin
} from "react-icons/fi";

function GymOwnerLogin() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to intended page after login
  const from = location.state?.from?.pathname || "/gym-owner";

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // Add role specification for gym owner login
        await login({ ...formData, role: 'gymOwner' });
        // AuthContext will handle redirection to /gym-owner
      } catch (err) {
        setErrors({ submit: err.message || 'Login failed. Please check your credentials.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 to-teal-900/30"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/5 rounded-full animate-float"
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
        className={`flex-grow container mx-auto px-4 py-12 relative transition-all duration-1000 ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-all duration-300 mb-8 group"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </Link>

          {/* Login Card */}
          <div className="bg-gray-950/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl p-8 transform hover:scale-[1.02] transition-all duration-500">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:rotate-12 transition-all duration-500 hover:scale-110">
                <FiHome className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                Gym Owner Login
              </h1>
              <p className="text-gray-400">
                Manage your gym, track members, and grow your business
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                <FiUsers className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Member Management</p>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                <FiTrendingUp className="w-6 h-6 text-teal-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Business Analytics</p>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                <FiMapPin className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Location Management</p>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                <FiActivity className="w-6 h-6 text-teal-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Class Scheduling</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="group">
                <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-emerald-400">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-3.5 text-gray-500 transition-colors group-focus-within:text-emerald-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all duration-300"
                    placeholder="gym.owner@example.com"
                  />
                  {errors.email && (
                    <p className="absolute -bottom-6 left-0 text-red-500 text-sm mt-1 flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-emerald-400">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-3.5 text-gray-500 transition-colors group-focus-within:text-emerald-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-12 py-3 border border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                  {errors.password && (
                    <p className="absolute -bottom-6 left-0 text-red-500 text-sm mt-1 flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all duration-300 ${
                    rememberMe
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-gray-600 group-hover:border-emerald-500"
                  }`}>
                    {rememberMe && <FiCheck className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    Remember me
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm group relative"
                >
                  Forgot password?
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>

              {/* Error Display */}
              {(errors.submit || error) && (
                <div className="p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                    {errors.submit || error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 relative group overflow-hidden mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <span className="relative z-10 inline-flex items-center justify-center">
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    <>
                      Access Gym Dashboard
                      <FiArrowLeft className="ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              {/* Register Link */}
              <p className="text-center text-gray-400">
                Don't have a gym account?{' '}
                <Link
                  to="/register-gym"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                  Register Your Gym
                </Link>
              </p>

              {/* Alternative Login */}
              <div className="text-center pt-4 border-t border-gray-800">
                <p className="text-gray-500 text-sm mb-3">Other login options</p>
                <div className="flex justify-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    Customer Login
                  </Link>
                  <span className="text-gray-600">•</span>
                  <Link
                    to="/instructor-login"
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    Instructor Login
                  </Link>
                  <span className="text-gray-600">•</span>
                  <Link
                    to="/admin-login"
                    className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                  >
                    Admin Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GymOwnerLogin;