import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
} from "react-icons/fi";
import { useAlert } from "../../contexts/AlertContext";
import api from "../../utils/api";

function AddReceptionist() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please provide a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "Please provide a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert("Please fix the errors in the form", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: "receptionist",
      };

      const response = await api.register(userData);

      if (response.success) {
        showAlert("Receptionist added successfully!", "success");
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
        // Navigate back to receptionists list after a short delay
        setTimeout(() => {
          navigate("/admin/users/receptionists");
        }, 1500);
      } else {
        showAlert(response.message || "Failed to add receptionist", "error");
      }
    } catch (error) {
      console.error("Error adding receptionist:", error);
      showAlert(
        error.message || "An error occurred while adding the receptionist",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/users/receptionists")}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
          title="Back to Receptionists"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Add Receptionist
          </h1>
          <p className="text-gray-400 mt-1">
            Create a new receptionist account
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                First Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={`w-full bg-gray-900/50 text-white rounded-lg pl-10 pr-4 py-3 border ${
                    errors.firstName
                      ? "border-red-500"
                      : "border-gray-700 focus:border-violet-500"
                  } focus:ring-2 focus:ring-violet-500/20 focus:outline-none`}
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Last Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={`w-full bg-gray-900/50 text-white rounded-lg pl-10 pr-4 py-3 border ${
                    errors.lastName
                      ? "border-red-500"
                      : "border-gray-700 focus:border-violet-500"
                  } focus:ring-2 focus:ring-violet-500/20 focus:outline-none`}
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3.5 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className={`w-full bg-gray-900/50 text-white rounded-lg pl-10 pr-4 py-3 border ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-700 focus:border-violet-500"
                } focus:ring-2 focus:ring-violet-500/20 focus:outline-none`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-3.5 text-gray-500" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={`w-full bg-gray-900/50 text-white rounded-lg pl-10 pr-4 py-3 border ${
                  errors.phone
                    ? "border-red-500"
                    : "border-gray-700 focus:border-violet-500"
                } focus:ring-2 focus:ring-violet-500/20 focus:outline-none`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
            )}
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`w-full bg-gray-900/50 text-white rounded-lg pl-10 pr-10 py-3 border ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-700 focus:border-violet-500"
                  } focus:ring-2 focus:ring-violet-500/20 focus:outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters with at least one number
              </p>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className={`w-full bg-gray-900/50 text-white rounded-lg pl-10 pr-10 py-3 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-700 focus:border-violet-500"
                  } focus:ring-2 focus:ring-violet-500/20 focus:outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-700/50">
            <button
              type="button"
              onClick={() => navigate("/admin/users/receptionists")}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
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
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <FiCheck className="w-5 h-5" />
                  <span>Add Receptionist</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddReceptionist;


