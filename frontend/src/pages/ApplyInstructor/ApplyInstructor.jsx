import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiCalendar, 
  FiMapPin, 
  FiClock,
  FiUpload,
  FiCheck,
  FiActivity,
  FiAward,
  FiDollarSign,
  FiUsers
} from 'react-icons/fi';

function ApplyInstructor() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    availability: [],
    preferredLocation: '',
    isFreelance: false,
    motivation: '',
    resume: null,
    certifications: [],
    profilePicture: null,
    terms: false
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const specializations = [
    'Strength Training',
    'Yoga',
    'Cardio',
    'HIIT',
    'Pilates',
    'CrossFit',
    'Dance Fitness',
    'Martial Arts'
  ];

  const availabilityOptions = [
    { value: 'weekday-morning', label: 'Weekday Mornings' },
    { value: 'weekday-afternoon', label: 'Weekday Afternoons' },
    { value: 'weekday-evening', label: 'Weekday Evenings' },
    { value: 'weekend-morning', label: 'Weekend Mornings' },
    { value: 'weekend-afternoon', label: 'Weekend Afternoons' }
  ];

  const locations = [
    'Downtown Center',
    'Uptown Studio',
    'West Side Gym',
    'East End Fitness',
    'South Park Location'
  ];

  const benefits = [
    {
      icon: FiDollarSign,
      title: "Competitive Pay",
      description: "Earn top industry rates with performance bonuses"
    },
    {
      icon: FiUsers,
      title: "Growing Community",
      description: "Work with dedicated members and fellow trainers"
    },
    {
      icon: FiAward,
      title: "Professional Growth",
      description: "Access to continuous education and certifications"
    },
    {
      icon: FiClock,
      title: "Flexible Hours",
      description: "Create your own schedule that works for you"
    }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      if (name === 'profilePicture' && files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
        setFormData(prev => ({ ...prev, [name]: files[0] }));
      } else if (name === 'certifications') {
        setFormData(prev => ({ ...prev, [name]: [...prev.certifications, ...files] }));
      } else {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
      }
    } else if (type === 'checkbox') {
      if (name === 'availability') {
        const newAvailability = checked
          ? [...formData.availability, value]
          : formData.availability.filter(item => item !== value);
        setFormData(prev => ({ ...prev, availability: newAvailability }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
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
    
    if (!formData.specialization) newErrors.specialization = 'Please select a specialization';
    if (!formData.experience) newErrors.experience = 'Years of experience is required';
    if (formData.availability.length === 0) newErrors.availability = 'Please select at least one availability';
    if (!formData.preferredLocation) newErrors.preferredLocation = 'Please select a preferred location';
    if (!formData.motivation.trim()) newErrors.motivation = 'Please tell us why you want to join';
    if (!formData.resume) newErrors.resume = 'Please upload your resume';
    if (!formData.profilePicture) newErrors.profilePicture = 'Please upload a profile picture';
    if (!formData.terms) newErrors.terms = 'Please accept the terms and conditions';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitting(false);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialization: '',
        experience: '',
        availability: [],
        preferredLocation: '',
        isFreelance: false,
        motivation: '',
        resume: null,
        certifications: [],
        profilePicture: null,
        terms: false
      });
      setPreviewImage(null);
      console.log('Form submitted:', formData);
    } else {
      setErrors(newErrors);
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

      <div className={`container mx-auto px-4 relative transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 group transition-colors"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20">
            <FiActivity className="w-10 h-10 text-violet-400" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Join Our Team of Expert Trainers
          </h1>
          <p className="text-xl text-gray-400">
            Share your passion for fitness and help others achieve their goals. 
            Join FitConnect as an instructor and be part of our growing community.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl hover:bg-gray-800/70 transition-all duration-500 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="h-14 w-14 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="h-7 w-7 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Application Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative overflow-hidden border border-gray-700/50">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 animate-pulse-slow"></div>
            
            <div className="relative">
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Application Form
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
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
                          className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                          placeholder="John"
                        />
                        {errors.firstName && (
                          <p className="absolute -bottom-6 left-0 text-red-400 text-sm mt-1 flex items-center">
                            <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Last Name */}
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
                          className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <p className="absolute -bottom-6 left-0 text-red-400 text-sm mt-1 flex items-center">
                            <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
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
                          className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="absolute -bottom-6 left-0 text-red-400 text-sm mt-1 flex items-center">
                            <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="group">
                      <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                        Phone
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-4 top-3.5 text-gray-500 transition-colors group-focus-within:text-violet-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                          placeholder="+1 (555) 000-0000"
                        />
                        {errors.phone && (
                          <p className="absolute -bottom-6 left-0 text-red-400 text-sm mt-1 flex items-center">
                            <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Profile Picture */}
                  <div className="group">
                    <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                      Profile Picture
                    </label>
                    <div className="flex items-center space-x-6">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-900/50 border-2 border-gray-700/50">
                        {previewImage ? (
                          <img 
                            src={previewImage} 
                            alt="Profile preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <FiUser className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="flex items-center justify-center px-6 py-3 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-violet-500 transition-colors">
                          <input
                            type="file"
                            name="profilePicture"
                            onChange={handleChange}
                            accept="image/*"
                            className="hidden"
                          />
                          <FiUpload className="w-5 h-5 text-gray-500 mr-2" />
                          <span className="text-gray-400">Upload photo</span>
                        </label>
                        <p className="text-gray-500 text-sm mt-2">JPG, PNG or GIF (max. 2MB)</p>
                        {errors.profilePicture && (
                          <p className="text-red-400 text-sm mt-1 flex items-center">
                            <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                            {errors.profilePicture}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Professional Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Specialization */}
                    <div className="group">
                      <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                        Specialization
                      </label>
                      <div className="relative">
                        <FiActivity className="absolute left-4 top-3.5 text-gray-500 transition-colors group-focus-within:text-violet-400" />
                        <select
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300 appearance-none"
                        >
                          <option value="">Select specialization</option>
                          {specializations.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                          ))}
                        </select>
                        {errors.specialization && (
                          <p className="absolute -bottom-6 left-0 text-red-400 text-sm mt-1 flex items-center">
                            <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                            {errors.specialization}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Years of Experience */}
                    <div className="group">
                      <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                        Years of Experience
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-4 top-3.5 text-gray-500 transition-colors group-focus-within:text-violet-400" />
                        <input
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          min="0"
                          max="50"
                          className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                          placeholder="Years of experience"
                        />
                        {errors.experience && (
                          <p className="absolute -bottom-6 left-0 text-red-400 text-sm mt-1 flex items-center">
                            <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                            {errors.experience}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="group">
                    <label className="block text-gray-300 mb-4 transition-colors group-focus-within:text-violet-400">
                      Availability
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availabilityOptions.map(option => (
                        <label
                          key={option.value}
                          className="flex items-center space-x-3 p-4 rounded-lg bg-gray-900/50 border border-gray-700/50 cursor-pointer hover:bg-gray-800/50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            name="availability"
                            value={option.value}
                            checked={formData.availability.includes(option.value)}
                            onChange={handleChange}
                            className="hidden"
                          />
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            formData.availability.includes(option.value)
                              ? 'bg-violet-500 border-violet-500'
                              : 'border-gray-600'
                          }`}>
                            {formData.availability.includes(option.value) && (
                              <FiCheck className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-gray-300">{option.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.availability && (
                      <p className="text-red-400 text-sm mt-2 flex items-center">
                        <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                        {errors.availability}
                      </p>
                    )}
                  </div>

                  {/* Preferred Location */}
                  <div className="group">
                    <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                      Preferred Location
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-4 top-3.5 text-gray-500 transition-colors group-focus-within:text-violet-400" />
                      <select
                        name="preferredLocation"
                        value={formData.preferredLocation}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300 appearance-none"
                      >
                        <option value="">Select location</option>
                        {locations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                      {errors.preferredLocation && (
                        <p className="absolute -bottom-6 left-0 text-red-400 text-sm mt-1 flex items-center">
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                          {errors.preferredLocation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Freelance Option */}
                  <div className="group">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="isFreelance"
                          checked={formData.isFreelance}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          formData.isFreelance
                            ? 'bg-violet-500 border-violet-500'
                            : 'border-gray-600'
                        }`}>
                          {formData.isFreelance && (
                            <FiCheck className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                      <span className="text-gray-300">I want to work as a freelance instructor</span>
                    </label>
                  </div>

                  {/* Resume Upload */}
                  <div className="group">
                    <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                      Resume
                    </label>
                    <div className="relative">
                      <label className="flex items-center justify-center px-6 py-4 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-violet-500 transition-colors">
                        <input
                          type="file"
                          name="resume"
                          onChange={handleChange}
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                        />
                        <FiUpload className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="text-gray-400">
                          {formData.resume ? formData.resume.name : 'Upload resume (PDF, DOC, DOCX)'}
                        </span>
                      </label>
                      {errors.resume && (
                        <p className="absolute -bottom-6 left-0 text-red-400 text-sm mt-1 flex items-center">
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                          {errors.resume}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Certifications Upload */}
                  <div className="group">
                    <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                      Certifications (Optional)
                    </label>
                    <div className="relative">
                      <label className="flex items-center justify-center px-6 py-4 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-violet-500 transition-colors">
                        <input
                          type="file"
                          name="certifications"
                          onChange={handleChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                          multiple
                          className="hidden"
                        />
                        <FiUpload className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="text-gray-400">
                          Upload certifications (PDF, JPG, PNG)
                        </span>
                      </label>
                      {formData.certifications.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {Array.from(formData.certifications).map((file, index) => (
                            <div key={index} className="flex items-center text-gray-400">
                              <FiCheck className="w-4 h-4 text-green-400 mr-2" />
                              {file.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Motivation */}
                  <div className="group">
                    <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                      Why do you want to join our team?
                    </label>
                    <div className="relative">
                      <textarea
                        name="motivation"
                        value={formData.motivation}
                        onChange={handleChange}
                        rows="4"
                        className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300"
                        placeholder="Tell us about your passion for fitness and why you'd be a great addition to our team..."
                      ></textarea>
                      {errors.motivation && (
                        <p className="absolute - bottom-6 left-0 text-red-400 text-sm mt-1 flex items-center">
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                          {errors.motivation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms and Privacy */}
                <div className="group">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="terms"
                        checked={formData.terms}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        formData.terms
                          ? 'bg-violet-500 border-violet-500'
                          : 'border-gray-600'
                      }`}>
                        {formData.terms && (
                          <FiCheck className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-gray-300">
                      I agree to the{' '}
                      <Link to="/terms" className="text-violet-400 hover:text-violet-300 transition-colors">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-violet-400 hover:text-violet-300 transition-colors">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                      {errors.terms}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 relative group overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative z-10 inline-flex items-center justify-center">
                    {isSubmitting ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'Submit Application'
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyInstructor;