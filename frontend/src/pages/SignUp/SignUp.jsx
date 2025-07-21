import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiArrowLeft, FiMail, FiLock, FiUser, FiCalendar, FiPhone, FiCheck } from 'react-icons/fi';

function SignUp() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    password: '',
    confirmPassword: '',
    role: 'customer', // Default role
  });

  const [errors, setErrors] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const { confirmPassword, dateOfBirth, gender, ...registrationData } = formData;
        await register(registrationData);
        // AuthContext will handle redirection based on user role
      } catch (err) {
        setErrors({ submit: err.message || 'Registration failed. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500'
  ];

  const strengthLabels = [
    'Weak',
    'Fair',
    'Good',
    'Strong'
  ];

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
                width: Math.random() * 300 + 50 + 'px',
                height: Math.random() * 300 + 50 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className={`flex-grow container mx-auto px-4 py-12 relative transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 group transition-colors"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Sign Up Form Card */}
          <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden border border-gray-700">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 animate-pulse-slow"></div>
            
            {/* Content */}
            <div className="relative">
              <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Create Your Account
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Join FitConnect and start your fitness journey today
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                      First Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-3.5 text-gray-500 transition-colors group-focus-within:text-violet-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="absolute -bottom-6 left-0 text-red-500 text-sm mt-1 flex items-center">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                      Last Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-3.5 text-gray-500 transition-colors group-focus-within:text-violet-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="absolute -bottom-6 left-0 text-red-500 text-sm mt-1 flex items-center">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gender Selection */}
                <div className="group">
                  <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                    Gender
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => handleChange({ target: { name: 'gender', value: 'male' } })}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border ${
                        formData.gender === 'male'
                          ? 'bg-violet-600 border-violet-500 text-white'
                          : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:bg-gray-800/50'
                      } transition-all duration-300`}
                    >
                      <FiUser className={`w-5 h-5 ${formData.gender === 'male' ? 'text-white' : 'text-gray-400'}`} />
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange({ target: { name: 'gender', value: 'female' } })}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border ${
                        formData.gender === 'female'
                          ? 'bg-violet-600 border-violet-500 text-white'
                          : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:bg-gray-800/50'
                      } transition-all duration-300`}
                    >
                      <FiUser className={`w-5 h-5 ${formData.gender === 'female' ? 'text-white' : 'text-gray-400'}`} />
                      Female
                    </button>
                  </div>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.gender}
                    </p>
                  )}
                </div>

                {/* Contact Information */}
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

                <div className="group">
                  <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-3.5 text-gray-500 transition-colors group-focus-within:text-violet-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && (
                      <p className="absolute -bottom-6 left-0 text-red-500 text-sm mt-1 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="group">
                  <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-4 top-3.5 text-gray-500 transition-colors group-focus-within:text-violet-400" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                    />
                    {errors.dateOfBirth && (
                      <p className="absolute -bottom-6 left-0 text-red-500 text-sm mt-1 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.dateOfBirth}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Fields */}
                <div className="group">
                  <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-3.5 text-gray-500 transition-colors group-focus-within:text-violet-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                      placeholder="••••••••"
                    />
                    {formData.password && (
                      <div className="absolute -bottom-6 left-0 right-0">
                        <div className="flex gap-1 mb-1">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i < passwordStrength ? strengthColors[i] : 'bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs ${
                          passwordStrength > 2 ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          Password Strength: {strengthLabels[passwordStrength]}
                        </p>
                      </div>
                    )}
                    {errors.password && (
                      <p className="absolute -bottom-6 left-0 text-red-500 text-sm mt-1 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                <div className="group">
                  <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-3.5 text-gray-500 transition-colors group-focus-within:text-violet-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                      placeholder="••••••••"
                    />
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <FiCheck className="absolute right-4 top-3.5 text-green-500" />
                    )}
                    {errors.confirmPassword && (
                      <p className="absolute -bottom-6 left-0 text-red-500 text-sm mt-1 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
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
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 relative group overflow-hidden mt-12 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative z-10 inline-flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <FiArrowLeft className="ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>

                {/* Login Link */}
                <p className="text-center text-gray-400">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-violet-400 hover:text-violet-300 transition-colors relative group"
                  >
                    Log in
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

export default SignUp;