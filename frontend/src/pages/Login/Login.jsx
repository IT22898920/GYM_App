import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FiArrowLeft,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiActivity,
} from "react-icons/fi";

function Login() {
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
  const from = location.state?.from?.pathname || "/";

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
        await login(formData);
        // AuthContext will handle redirection based on user role
      } catch (err) {
        setErrors({ submit: err.message || 'Login failed. Please try again.' });
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
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 to-indigo-900/30"></div>
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
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 group transition-colors"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center transform hover:rotate-12 transition-all duration-300 hover:scale-110 hover:shadow-lg relative group">
              <FiActivity className="h-8 w-8 text-white transform group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-white rounded-2xl mix-blend-overlay opacity-10"></div>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative overflow-hidden border border-gray-700">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 animate-pulse-slow"></div>

            {/* Content */}
            <div className="relative">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-400 mb-8">
                Sign in to continue your fitness journey
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="group">
                  <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                    Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-3.5 text-gray-500 transition-colors group-focus-within:text-violet-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                      placeholder="john.doe@example.com"
                    />
                    {errors.email && (
                      <p className="absolute -bottom-6 left-0 text-red-500 text-sm mt-1 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Field */}
                <div className="group">
                  <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-3.5 text-gray-500 transition-colors group-focus-within:text-violet-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-12 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                    {errors.password && (
                      <p className="absolute -bottom-6 left-0 text-red-500 text-sm mt-1 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 border ${
                          rememberMe
                            ? "bg-violet-500 border-violet-500"
                            : "border-gray-600"
                        } rounded transition-colors group-hover:border-violet-500`}
                      ></div>
                      {rememberMe && (
                        <FiCheck className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                      )}
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-violet-400 hover:text-violet-300 transition-colors relative group"
                  >
                    Forgot password?
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-400 group-hover:w-full transition-all duration-300"></span>
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
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 relative group overflow-hidden mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
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
                      "Sign In"
                    )}
                  </span>
                </button>

                {/* Sign Up Link */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800/80 text-gray-400">
                      Or
                    </span>
                  </div>
                </div>

                <p className="text-center text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-violet-400 hover:text-violet-300 transition-colors relative group font-medium"
                  >
                    Sign up
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
