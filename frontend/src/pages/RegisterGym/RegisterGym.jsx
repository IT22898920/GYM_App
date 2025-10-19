import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gymService, formatGymDataForAPI, validateGymData } from "../../services/gymService";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHome,
  FiCheck,
  FiPlus,
  FiTrash2,
  FiUpload,
  FiGlobe,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiImage,
  FiDollarSign,
  FiCreditCard, // Added for payment step
} from "react-icons/fi";
import MapComponent from "../../components/MapComponent"; // Assuming this exists

function RegisterGym() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gymName: "",
    gymType: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    website: "",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    facilities: [],
    classTypes: [],
    membershipPlans: [
      { name: "", duration: "1 month", price: "", description: "" },
      { name: "", duration: "1 month", price: "", description: "" },
      { name: "", duration: "1 month", price: "", description: "" },
    ],
    promotions: "",
    paymentMethods: [],
    paymentProcessor: "",
    logo: null,
    photos: [],
    location: { lat: 6.9271, lng: 79.8612 }, // Colombo, Sri Lanka coordinates
    termsAccepted: false,
    privacyAccepted: false,
    paymentMethod: "", // Added for registration fee payment method
    selectedWorkouts: [],
  });

  const [errors, setErrors] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [registeredGymId, setRegisteredGymId] = useState(null);
  const [previewImages, setPreviewImages] = useState({
    logo: null,
    photos: [],
  });
  // Workouts (GIFs) state
  const [workouts, setWorkouts] = useState([]);
  const [workoutsLoading, setWorkoutsLoading] = useState(false);
  const [workoutsError, setWorkoutsError] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const steps = [
    "Basic Info",
    "Facilities & Classes",
    "Membership & Pricing",
    "Media & Location",
    "Terms",
    "Payment", // Added payment step
  ];

  const facilityOptions = [
    "Weight Machines",
    "Cardio Equipment",
    "Swimming Pool",
    "Sauna",
    "Steam Room",
    "Yoga Studio",
    "CrossFit Area",
    "Group Exercise Room",
    "Personal Training Area",
    "Locker Rooms",
    "Showers",
    "Towel Service",
    "Parking",
    "Childcare",
  ];

  const classTypeOptions = [
    "Yoga",
    "Pilates",
    "HIIT",
    "Strength Training",
    "CrossFit",
    "Zumba",
    "Spinning",
    "Boxing",
    "Martial Arts",
    "Swimming",
    "Senior Fitness",
    "Kids Classes",
  ];

  const gymTypeOptions = [
    "Fitness Center",
    "Yoga Studio",
    "CrossFit Box",
    "Martial Arts Dojo",
    "Personal Training Studio",
    "Wellness Center",
    "Sports Complex",
  ];

  const paymentMethodOptions = [
    "Credit Cards",
    "Debit Cards",
    "Bank Transfer",
    "Cash",
    "Digital Wallets",
    "Automatic Payments",
  ];

  const paymentProcessorOptions = ["Stripe", "PayPal", "Square", "Other"];
  const planNameOptions = ["Basic", "Premium", "Elite"];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      if (name === "logo") {
        const file = files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImages((prev) => ({ ...prev, logo: reader.result }));
          };
          reader.readAsDataURL(file);
          setFormData((prev) => ({ ...prev, logo: file }));
        }
      } else if (name === "photos") {
        const newFiles = Array.from(files);
        const readers = newFiles.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        });

        Promise.all(readers).then((results) => {
          setPreviewImages((prev) => ({
            ...prev,
            photos: [...prev.photos, ...results],
          }));
        });

        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, ...newFiles],
        }));
      }
    } else if (type === "checkbox") {
      if (name === "facilities") {
        const updatedFacilities = checked
          ? [...formData.facilities, value]
          : formData.facilities.filter((f) => f !== value);
        setFormData((prev) => ({ ...prev, facilities: updatedFacilities }));
      } else if (name === "classTypes") {
        const updatedClasses = checked
          ? [...formData.classTypes, value]
          : formData.classTypes.filter((c) => c !== value);
        setFormData((prev) => ({ ...prev, classTypes: updatedClasses }));
      } else if (name === "paymentMethods") {
        const updatedMethods = checked
          ? [...formData.paymentMethods, value]
          : formData.paymentMethods.filter((m) => m !== value);
        setFormData((prev) => ({ ...prev, paymentMethods: updatedMethods }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      }
    } else if (name.startsWith("socialMedia.")) {
      const social = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [social]: value },
      }));
    } else if (name.startsWith("membershipPlan.")) {
      const [_, field, index] = name.split(".");
      const updatedPlans = [...formData.membershipPlans];
      updatedPlans[index] = { ...updatedPlans[index], [field]: value };
      setFormData((prev) => ({ ...prev, membershipPlans: updatedPlans }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const addMembershipPlan = () => {
    setFormData((prev) => ({
      ...prev,
      membershipPlans: [
        ...prev.membershipPlans,
        { name: "", duration: "1 month", price: "", description: "" },
      ],
    }));
  };

  const removeMembershipPlan = (index) => {
    setFormData((prev) => ({
      ...prev,
      membershipPlans: prev.membershipPlans.filter((_, i) => i !== index),
    }));
  };

  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
    setPreviewImages((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const toggleWorkoutSelection = (workoutId) => {
    setFormData((prev) => {
      const isSelected = prev.selectedWorkouts.includes(workoutId);
      return {
        ...prev,
        selectedWorkouts: isSelected
          ? prev.selectedWorkouts.filter((id) => id !== workoutId)
          : [...prev.selectedWorkouts, workoutId],
      };
    });
    if (errors.selectedWorkouts) {
      setErrors((prev) => ({ ...prev, selectedWorkouts: "" }));
    }
  };

  // Fetch workouts when user reaches step 2
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setWorkoutsLoading(true);
        setWorkoutsError("");
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiBase}/gifs`);
        const data = await res.json();
        if (data.success) {
          setWorkouts(data.data || []);
        } else {
          setWorkoutsError(data.message || 'Failed to load workouts');
        }
      } catch (err) {
        setWorkoutsError('Failed to load workouts');
      } finally {
        setWorkoutsLoading(false);
      }
    };

    if (currentStep === 2) {
      fetchWorkouts();
    }
  }, [currentStep]);

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1: // Basic Info
        if (!formData.gymName.trim()) newErrors.gymName = "Gym name is required";
        if (!formData.gymType) newErrors.gymType = "Gym type is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Email is invalid";
        }
        if (!formData.phone.trim()) {
          newErrors.phone = "Phone number is required";
        } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
          newErrors.phone = "Phone number is invalid";
        }
        break;

      case 2: // Facilities & Classes
        // Require at least one workout to be selected
        if (!formData.selectedWorkouts || formData.selectedWorkouts.length === 0)
          newErrors.selectedWorkouts = "Please select at least one workout";
        break;

      case 3: // Membership & Pricing
        if (formData.membershipPlans.length === 0) {
          newErrors.membershipPlans = "Please add at least one membership plan";
        } else {
          formData.membershipPlans.forEach((plan, index) => {
            if (!plan.name.trim())
              newErrors[`membershipPlan.name.${index}`] = "Plan name is required";
            if (!plan.price.trim())
              newErrors[`membershipPlan.price.${index}`] = "Price is required";
          });
        }
        break;

      case 4: // Media & Location
        // Made logo and photos optional for now
        break;

      case 5: // Terms
        if (!formData.termsAccepted)
          newErrors.termsAccepted = "Please accept the terms and conditions";
        if (!formData.privacyAccepted)
          newErrors.privacyAccepted = "Please accept the privacy policy";
        break;

      case 6: // Payment (Skip for now, just for demo)
        // Payment validation can be added later
        break;
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Validate form data
    const validation = validateGymData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Format data for API
      const apiData = formatGymDataForAPI(formData);
      
      // Register gym
      const response = await gymService.registerGym(apiData);
      
      console.log("Gym registered successfully:", response);
      
      // If we have a logo, upload it
      if (formData.logo && response.data._id) {
        try {
          const logoResponse = await gymService.uploadGymLogo(
            response.data._id,
            formData.logo
          );
          console.log("Logo uploaded:", logoResponse);
        } catch (logoError) {
          console.warn("Logo upload failed:", logoError);
          // Don't fail the whole process if logo upload fails
        }
      }

      // If we have images, upload them
      if (formData.photos && formData.photos.length > 0 && response.data._id) {
        try {
          const imageResponse = await gymService.uploadGymImages(
            response.data._id,
            formData.photos,
            [] // captions can be added later
          );
          console.log("Images uploaded:", imageResponse);
        } catch (imageError) {
          console.warn("Image upload failed:", imageError);
          // Don't fail the whole process if image upload fails
        }
      }

      setSubmitSuccess(true);
      setRegisteredGymId(response.data._id);
      
      // Show success message for a moment, then redirect based on user role
      setTimeout(() => {
        // Redirect to profile page for customers (they can't access gym-owner dashboard yet)
        const redirectPath = localStorage.getItem('userRole') === 'customer' ? '/profile' : '/gym-owner';
        navigate(redirectPath, { 
          state: { 
            message: "Gym registered successfully! Your application is being reviewed. You will be notified once approved." 
          } 
        });
      }, 3000);

    } catch (error) {
      console.error("Registration error:", error);
      setSubmitError(
        error.message || "Registration failed. Please try again."
      );
      
      // If there are field-specific errors, show them
      if (error.errors && Array.isArray(error.errors)) {
        const fieldErrors = {};
        error.errors.forEach(err => {
          if (err.field) {
            fieldErrors[err.field] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    // Validate current step before proceeding
    const stepErrors = validateCurrentStep();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    // Clear errors and proceed
    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleLocationChange = (newLocation) => {
    setFormData((prev) => ({ ...prev, location: newLocation }));
  };

  // Success screen
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-gray-900/50 to-emerald-900/20"></div>
        </div>
        <div className="max-w-md mx-auto text-center relative z-10">
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700/50">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Registration Successful!
            </h1>
            <p className="text-gray-300 mb-6">
              Your gym has been registered successfully. Our team will review your application and get back to you within 2-3 business days.
            </p>
            <div className="animate-spin w-6 h-6 border-2 border-gray-600 border-t-white rounded-full mx-auto"></div>
            <p className="text-gray-400 text-sm mt-2">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">
              Basic Information
            </h2>
            <div className="group">
              <label className="block text-gray-300 mb-2">Gym Type</label>
              <select
                name="gymType"
                value={formData.gymType}
                onChange={handleChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              >
                <option value="">Select gym type</option>
                {gymTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.gymType && (
                <p className="text-red-500 text-sm mt-1">{errors.gymType}</p>
              )}
            </div>
            <div className="group">
              <label className="block text-gray-300 mb-2">Gym Name</label>
              <div className="relative">
                <FiHome className="absolute left-4 top-3.5 text-gray-500" />
                <input
                  type="text"
                  name="gymName"
                  value={formData.gymName}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  placeholder="Enter gym name"
                />
                {errors.gymName && (
                  <p className="text-red-500 text-sm mt-1">{errors.gymName}</p>
                )}
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
                    placeholder="gym@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
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
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="group">
              <label className="block text-gray-300 mb-2">Address</label>
              <div className="relative">
                <FiMapPin className="absolute left-4 top-3.5 text-gray-500" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  placeholder="Street address"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group">
                <label className="block text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  placeholder="City"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              <div className="group">
                <label className="block text-gray-300 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  placeholder="State"
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>
              <div className="group">
                <label className="block text-gray-300 mb-2">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  placeholder="ZIP code"
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                )}
              </div>
            </div>
            <div className="space-y-6">
              <div className="group">
                <label className="block text-gray-300 mb-2">
                  Website (Optional)
                </label>
                <div className="relative">
                  <FiGlobe className="absolute left-4 top-3.5 text-gray-500" />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group">
                  <label className="block text-gray-300 mb-2">
                    Facebook (Optional)
                  </label>
                  <div className="relative">
                    <FiFacebook className="absolute left-4 top-3.5 text-gray-500" />
                    <input
                      type="url"
                      name="socialMedia.facebook"
                      value={formData.socialMedia.facebook}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                      placeholder="Facebook URL"
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-gray-300 mb-2">
                    Instagram (Optional)
                  </label>
                  <div className="relative">
                    <FiInstagram className="absolute left-4 top-3.5 text-gray-500" />
                    <input
                      type="url"
                      name="socialMedia.instagram"
                      value={formData.socialMedia.instagram}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                      placeholder="Instagram URL"
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-gray-300 mb-2">
                    Twitter (Optional)
                  </label>
                  <div className="relative">
                    <FiTwitter className="absolute left-4 top-3.5 text-gray-500" />
                    <input
                      type="url"
                      name="socialMedia.twitter"
                      value={formData.socialMedia.twitter}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                      placeholder="Twitter URL"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-white">
              Facilities & Classes
            </h2>
            {/* Available Facilities replaced by Admin Workouts */}
            <div className="space-y-4">
              <label className="block text-gray-300 mb-4">
                Available Workouts
              </label>

              {workoutsLoading ? (
                <div className="text-gray-400">Loading workouts...</div>
              ) : workoutsError ? (
                <div className="text-red-400">{workoutsError}</div>
              ) : workouts.length === 0 ? (
                <div className="text-gray-400">No workouts available</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {workouts.map((w) => (
                    <div
                      key={w._id}
                      className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-700 flex items-start justify-between gap-3"
                    >
                      <label className="flex items-start gap-3 cursor-pointer select-none flex-1">
                        <input
                          type="checkbox"
                          checked={formData.selectedWorkouts.includes(w._id)}
                          onChange={() => toggleWorkoutSelection(w._id)}
                          className="mt-1"
                        />
                        <span className="text-violet-300 font-medium">{w.name}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setSelectedWorkout(w)}
                        className="text-sm text-gray-300 hover:text-white underline"
                      >
                        Preview
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errors.selectedWorkouts && (
                <p className="text-red-500 text-sm">{errors.selectedWorkouts}</p>
              )}
            </div>

            {/* Available Classes */}
            {/* <div className="space-y-4">
              <label className="block text-gray-300 mb-4">
                Available Classes
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {classTypeOptions.map((classType) => (
                  <label
                    key={classType}
                    className="flex items-center space-x-3 p-4 rounded-lg bg-gray-900/50 border border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      name="classTypes"
                      value={classType}
                      checked={formData.classTypes.includes(classType)}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        formData.classTypes.includes(classType)
                          ? "bg-violet-500 border-violet-500"
                          : "border-gray-600"
                      }`}
                    >
                      {formData.classTypes.includes(classType) && (
                        <FiCheck className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-gray-300">{classType}</span>
                  </label>
                ))}
              </div>
              {errors.classTypes && (
                <p className="text-red-500 text-sm">{errors.classTypes}</p>
              )}
            </div> */}

            {/* Workout Preview Modal */}
            {selectedWorkout && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-3xl w-full overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                    <h3 className="text-white font-semibold">{selectedWorkout.name}</h3>
                    <button
                      type="button"
                      onClick={() => setSelectedWorkout(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="bg-black flex items-center justify-center">
                    <img
                      src={selectedWorkout.url}
                      alt={selectedWorkout.name}
                      className="max-h-[70vh] object-contain"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-white">
              Membership & Pricing
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-gray-300">Membership Plans</label>
                <button
                  type="button"
                  onClick={addMembershipPlan}
                  className="flex items-center space-x-2 px-4 py-2 bg-violet-600/20 text-violet-400 rounded-lg hover:bg-violet-600/30 transition-colors"
                >
                  <FiPlus className="w-5 h-5" />
                  <span>Add Plan</span>
                </button>
              </div>
              {formData.membershipPlans.map((plan, index) => (
                <div
                  key={index}
                  className="relative space-y-4 p-6 bg-gray-900/50 rounded-xl border border-gray-700/50"
                >
                  {formData.membershipPlans.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMembershipPlan(index)}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-gray-300 mb-2">
                        Plan Name
                      </label>
                      <select
                        name={`membershipPlan.name.${index}`}
                        value={plan.name}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                      >
                        <option value="">Select Plan</option>
                        {planNameOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors[`membershipPlan.name.${index}`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`membershipPlan.name.${index}`]}
                        </p>
                      )}
                    </div>
                    <div className="group">
                      <label className="block text-gray-300 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        name={`membershipPlan.duration.${index}`}
                        value={plan.duration}
                        readOnly
                        className="w-full bg-gray-700/50 text-gray-400 rounded-lg px-4 py-3 border border-gray-700 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-gray-300 mb-2">Price</label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-4 top-3.5 text-gray-500" />
                        <input
                          type="text"
                          name={`membershipPlan.price.${index}`}
                          value={plan.price}
                          onChange={handleChange}
                          className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                          placeholder="e.g., 49.99"
                        />
                        {errors[`membershipPlan.price.${index}`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`membershipPlan.price.${index}`]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        name={`membershipPlan.description.${index}`}
                        value={plan.description}
                        onChange={handleChange}
                        rows="2"
                        className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                        placeholder="Describe the benefits of this plan..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="group">
              <label className="block text-gray-300 mb-2">
                Current Promotions (Optional)
              </label>
              <textarea
                name="promotions"
                value={formData.promotions}
                onChange={handleChange}
                rows="3"
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="Describe any ongoing promotions or special offers..."
              ></textarea>
            </div>
            <div className="space-y-4">
              <label className="block text-gray-300 mb-4">
                Payment Methods Accepted
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentMethodOptions.map((method) => (
                  <label
                    key={method}
                    className="flex items-center space-x-3 p-4 rounded-lg bg-gray-900/50 border border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      name="paymentMethods"
                      value={method}
                      checked={formData.paymentMethods.includes(method)}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        formData.paymentMethods.includes(method)
                          ? "bg-violet-500 border-violet-500"
                          : "border-gray-600"
                      }`}
                    >
                      {formData.paymentMethods.includes(method) && (
                        <FiCheck className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-gray-300">{method}</span>
                  </label>
                ))}
              </div>
              {errors.paymentMethods && (
                <p className="text-red-500 text-sm">{errors.paymentMethods}</p>
              )}
            </div>
            <div className="group">
              <label className="block text-gray-300 mb-2">
                Payment Processor
              </label>
              <select
                name="paymentProcessor"
                value={formData.paymentProcessor}
                onChange={handleChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              >
                <option value="">Select payment processor</option>
                {paymentProcessorOptions.map((processor) => (
                  <option key={processor} value={processor}>
                    {processor}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-white">
              Media & Location
            </h2>
            <div className="group">
              <label className="block text-gray-300 mb-4">Gym Logo</label>
              <div className="flex items-center space-x-6">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-800 border-2 border-gray-700">
                  {previewImages.logo ? (
                    <img
                      src={previewImages.logo}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <FiImage className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="flex items-center justify-center px-6 py-3 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-violet-500 transition-colors">
                    <input
                      type="file"
                      name="logo"
                      onChange={handleChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <FiUpload className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-400">Upload logo</span>
                  </label>
                  <p className="text-gray-500 text-sm mt-2">
                    JPG, PNG or GIF (max. 2MB)
                  </p>
                  {errors.logo && (
                    <p className="text-red-500 text-sm mt-1">{errors.logo}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="group">
              <label className="block text-gray-300 mb-4">Gym Photos</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {previewImages.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden"
                  >
                    <img
                      src={photo}
                      alt={`Gym photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-600/80 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="aspect-video flex items-center justify-center border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-violet-500 transition-colors">
                  <input
                    type="file"
                    name="photos"
                    onChange={handleChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <div className="text-center">
                    <FiUpload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <span className="text-gray-400">Add photos</span>
                  </div>
                </label>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Upload photos of your gym's interior, equipment, and facilities
              </p>
              {errors.photos && (
                <p className="text-red-500 text-sm mt-1">{errors.photos}</p>
              )}
            </div>
            <div className="group">
              <label className="block text-gray-300 mb-4">
                Pin Location on Map
              </label>
              <div className="aspect-video bg-gray-900/50 rounded-lg border border-gray-700">
                <MapComponent
                  location={formData.location}
                  onLocationChange={handleLocationChange}
                />
              </div>
              {/* Debug info for Google Maps */}
              <div className="text-xs text-gray-500 mt-2">
                <div>Debug: location lat/lng → {String(formData.location?.lat)} , {String(formData.location?.lng)}</div>
                <div>Debug: maps loaded → {String(!!window.google && !!window.google.maps)}</div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-white">
              Terms & Conditions
            </h2>
            <div className="space-y-4">
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
                  </Link>
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="text-red-500 text-sm">{errors.termsAccepted}</p>
              )}
              <label className="flex items-center space-x-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="privacyAccepted"
                    checked={formData.privacyAccepted}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      formData.privacyAccepted
                        ? "bg-violet-500 border-violet-500"
                        : "border-gray-600"
                    }`}
                  >
                    {formData.privacyAccepted && (
                      <FiCheck className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <span className="text-gray-300">
                  I agree to the{" "}
                  <Link
                    to="/privacy"
                    className="text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.privacyAccepted && (
                <p className="text-red-500 text-sm">{errors.privacyAccepted}</p>
              )}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-white">Payment</h2>
            <div className="bg-gray-900/50 p-6 rounded-xl space-y-6">
              <div className="flex items-center space-x-4">
                <FiCreditCard className="text-violet-400 w-8 h-8" />
                <div>
                  <p className="text-gray-300 text-lg font-medium">
                    Registration Fee: $20
                  </p>
                  <p className="text-gray-500 text-sm">
                    One-time payment to list your gym
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300">Select Payment Method</p>
                <div className="flex space-x-6">
                  {["card", "manual", "bank"].map((method) => (
                    <label
                      key={method}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.paymentMethod === method
                            ? "border-violet-500"
                            : "border-gray-600"
                        }`}
                      >
                        {formData.paymentMethod === method && (
                          <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                        )}
                      </div>
                      <span className="text-gray-300 capitalize">{method}</span>
                    </label>
                  ))}
                </div>
                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
                )}
              </div>
              {formData.paymentMethod === "card" && (
                <div className="space-y-4">
                  <label className="block text-gray-300 mb-2">
                    Enter your payment details
                  </label>
                  <div className="relative">
                    <FiCreditCard className="absolute left-4 top-3.5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full bg-gray-800 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700"
                    />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Your payment is securely processed. We do not store your
                    card details.
                  </p>
                </div>
              )}
              {formData.paymentMethod === "manual" && (
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-300">
                    Please contact us at payments@gymplatform.com to arrange
                    manual payment.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Your registration will be pending until payment is
                    confirmed.
                  </p>
                </div>
              )}
              {formData.paymentMethod === "bank" && (
                <div className="p-4 bg-gray-800 rounded-lg space-y-2">
                  <p className="text-gray-300">
                    Please transfer $20 to the following account:
                  </p>
                  <p className="text-gray-400">Bank Name: Demo Bank</p>
                  <p className="text-gray-400">Account Number: 123456789</p>
                  <p className="text-gray-400">Routing Number: 987654321</p>
                  <p className="text-gray-400">Reference: Your Gym Name</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Your registration will be pending until payment is
                    confirmed.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-20 relative overflow-hidden">
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
        <Link
          to="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 group transition-colors"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Register Your Gym
          </h1>
          <p className="text-xl text-gray-400">
            Join our network of fitness facilities and reach more customers.
            Complete the form below to get started.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-700 -translate-y-1/2"></div>
            {steps.map((step, index) => (
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
            ))}
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative overflow-hidden border border-gray-700/50">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 animate-pulse-slow"></div>
            <div className="relative">
              {/* Error Message */}
              {submitError && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{submitError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {renderStepContent(currentStep)}
                <div className="flex justify-between pt-8">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  {currentStep < steps.length ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="ml-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 relative group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      <span className="relative z-10">Next</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="ml-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 relative group overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      <span className="relative z-10">
                        {isSubmitting ? (
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
                          "Register Gym"
                        )}
                      </span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterGym;