import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSave,
  FiArrowLeft,
  FiMapPin,
  FiPhone,
  FiMail,
  FiGlobe,
  FiClock,
  FiDollarSign,
  FiPlus,
  FiX,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";
import axios from "axios";

function EditGymDetails() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [gymId, setGymId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    gymName: "",
    description: "",
    contactInfo: {
      phone: "",
      email: "",
      website: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Sri Lanka",
    },
    facilities: [],
    equipment: [],
    services: [],
    operatingHours: {
      monday: { open: "", close: "", closed: false },
      tuesday: { open: "", close: "", closed: false },
      wednesday: { open: "", close: "", closed: false },
      thursday: { open: "", close: "", closed: false },
      friday: { open: "", close: "", closed: false },
      saturday: { open: "", close: "", closed: false },
      sunday: { open: "", close: "", closed: false },
    },
    pricing: {
      membershipPlans: [],
    },
    amenities: [],
    specialPrograms: [],
    capacity: "",
    establishedYear: "",
    certifications: [],
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
    },
    tags: [],
  });

  // Temporary input states for adding items
  const [newFacility, setNewFacility] = useState("");
  const [newService, setNewService] = useState("");
  const [newAmenity, setNewAmenity] = useState("");
  const [newProgram, setNewProgram] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newCertification, setNewCertification] = useState("");

  // Predefined options from RegisterGym page
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

  const serviceOptions = [
    "Personal Training",
    "Group Classes",
    "Nutrition Counseling",
    "Fitness Assessment",
    "Workout Plans",
    "Equipment Training",
    "Rehabilitation Services",
    "Massage Therapy",
    "Locker Rental",
    "Towel Service",
    "Guest Passes",
    "Corporate Memberships",
  ];

  const amenityOptions = [
    "Free WiFi",
    "Changing Rooms",
    "Showers",
    "Lockers",
    "Parking",
    "Air Conditioning",
    "Music System",
    "Water Fountains",
    "Vending Machines",
    "Pro Shop",
    "Juice Bar",
    "Childcare",
    "24/7 Access",
    "Security System",
  ];

  const programOptions = [
    "Weight Loss Program",
    "Muscle Building Program", 
    "Senior Fitness",
    "Kids Programs",
    "Rehabilitation",
    "Sports Training",
    "Yoga Classes",
    "Pilates Classes",
    "HIIT Training",
    "CrossFit",
    "Martial Arts",
    "Dance Classes",
  ];

  // Load existing gym data
  useEffect(() => {
    loadGymData();
  }, []);

  const loadGymData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/gyms/owner/gyms`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success && response.data.data.length > 0) {
        const gym = response.data.data[0]; // Assuming gym owner has one gym
        setGymId(gym._id); // Save the gym ID for updates
        setFormData({
          gymName: gym.gymName || "",
          description: gym.description || "",
          contactInfo: {
            phone: gym.contactInfo?.phone || "",
            email: gym.contactInfo?.email || "",
            website: gym.contactInfo?.website || "",
          },
          address: {
            street: gym.address?.street || "",
            city: gym.address?.city || "",
            state: gym.address?.state || "",
            zipCode: gym.address?.zipCode || "",
            country: gym.address?.country || "Sri Lanka",
          },
          facilities: gym.facilities || [],
          equipment: gym.equipment || [],
          services: gym.services || [],
          operatingHours: gym.operatingHours || {
            monday: { open: "", close: "", closed: false },
            tuesday: { open: "", close: "", closed: false },
            wednesday: { open: "", close: "", closed: false },
            thursday: { open: "", close: "", closed: false },
            friday: { open: "", close: "", closed: false },
            saturday: { open: "", close: "", closed: false },
            sunday: { open: "", close: "", closed: false },
          },
          pricing: {
            membershipPlans: gym.pricing?.membershipPlans || [],
          },
          amenities: gym.amenities || [],
          specialPrograms: gym.specialPrograms || [],
          capacity: gym.capacity || "",
          establishedYear: gym.establishedYear || "",
          certifications: gym.certifications || [],
          socialMedia: {
            facebook: gym.socialMedia?.facebook || "",
            instagram: gym.socialMedia?.instagram || "",
            twitter: gym.socialMedia?.twitter || "",
            youtube: gym.socialMedia?.youtube || "",
          },
          tags: gym.tags || [],
        });
      }
    } catch (error) {
      console.error("Error loading gym data:", error);
      setError("Failed to load gym data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value,
        },
      },
    }));
  };

  // Quick fill presets for operating hours
  const applyHoursPreset = (preset) => {
    let newHours = {};
    
    switch (preset) {
      case 'standard':
        // Monday-Friday: 6:00 AM - 10:00 PM, Saturday: 7:00 AM - 8:00 PM, Sunday: 8:00 AM - 6:00 PM
        newHours = {
          monday: { open: "06:00", close: "22:00", closed: false },
          tuesday: { open: "06:00", close: "22:00", closed: false },
          wednesday: { open: "06:00", close: "22:00", closed: false },
          thursday: { open: "06:00", close: "22:00", closed: false },
          friday: { open: "06:00", close: "22:00", closed: false },
          saturday: { open: "07:00", close: "20:00", closed: false },
          sunday: { open: "08:00", close: "18:00", closed: false },
        };
        break;
      case '24hours':
        // 24/7 operation
        newHours = {
          monday: { open: "00:00", close: "23:59", closed: false },
          tuesday: { open: "00:00", close: "23:59", closed: false },
          wednesday: { open: "00:00", close: "23:59", closed: false },
          thursday: { open: "00:00", close: "23:59", closed: false },
          friday: { open: "00:00", close: "23:59", closed: false },
          saturday: { open: "00:00", close: "23:59", closed: false },
          sunday: { open: "00:00", close: "23:59", closed: false },
        };
        break;
      case 'weekdays':
        // Monday-Friday only: 6:00 AM - 9:00 PM
        newHours = {
          monday: { open: "06:00", close: "21:00", closed: false },
          tuesday: { open: "06:00", close: "21:00", closed: false },
          wednesday: { open: "06:00", close: "21:00", closed: false },
          thursday: { open: "06:00", close: "21:00", closed: false },
          friday: { open: "06:00", close: "21:00", closed: false },
          saturday: { open: "", close: "", closed: true },
          sunday: { open: "", close: "", closed: true },
        };
        break;
      case 'morning':
        // Early morning gym: 5:00 AM - 12:00 PM every day
        newHours = {
          monday: { open: "05:00", close: "12:00", closed: false },
          tuesday: { open: "05:00", close: "12:00", closed: false },
          wednesday: { open: "05:00", close: "12:00", closed: false },
          thursday: { open: "05:00", close: "12:00", closed: false },
          friday: { open: "05:00", close: "12:00", closed: false },
          saturday: { open: "06:00", close: "12:00", closed: false },
          sunday: { open: "07:00", close: "12:00", closed: false },
        };
        break;
      default:
        return;
    }
    
    setFormData((prev) => ({
      ...prev,
      operatingHours: newHours,
    }));
  };

  // Copy hours from one day to multiple days
  const copyHoursToDay = (fromDay, toDays) => {
    const sourceHours = formData.operatingHours[fromDay];
    
    setFormData((prev) => {
      const newOperatingHours = { ...prev.operatingHours };
      toDays.forEach(day => {
        newOperatingHours[day] = { ...sourceHours };
      });
      return {
        ...prev,
        operatingHours: newOperatingHours,
      };
    });
  };

  const addItem = (listName, item, setItem) => {
    if (item.trim()) {
      setFormData((prev) => ({
        ...prev,
        [listName]: [...prev[listName], item.trim()],
      }));
      setItem("");
    }
  };

  const addItemFromDropdown = (listName, item) => {
    if (item && !formData[listName].includes(item)) {
      setFormData((prev) => ({
        ...prev,
        [listName]: [...prev[listName], item],
      }));
    }
  };

  const removeItem = (listName, index) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index),
    }));
  };

  const getFieldError = (fieldName) => {
    return validationErrors[fieldName];
  };

  const getInputClassName = (fieldName, baseClassName) => {
    const hasError = validationErrors[fieldName];
    return `${baseClassName} ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700/50 focus:border-violet-500 focus:ring-violet-500/20'}`;
  };

  const handleSave = async () => {
    if (!gymId) {
      setError("Gym ID not found. Please try refreshing the page.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setValidationErrors({});

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/gyms/${gymId}`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/gym-owner");
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving gym details:", error);
      
      // Handle validation errors
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const errors = {};
        error.response.data.errors.forEach(err => {
          errors[err.field] = err.message;
        });
        setValidationErrors(errors);
        setError("Please fix the validation errors below and try again.");
      } else {
        setError(
          error.response?.data?.message || "Failed to save gym details. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/gym-owner")}
            className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Edit Gym Details
            </h1>
            <p className="text-gray-400 mt-1">Update your gym information</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
        >
          <FiSave className="h-5 w-5 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4 text-green-300">
          Gym details updated successfully! Redirecting to dashboard...
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Gym Name
              </label>
              <input
                type="text"
                name="gymName"
                value={formData.gymName}
                onChange={handleInputChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="Enter gym name"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="Describe your gym..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  placeholder="Maximum members"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Established Year
                </label>
                <input
                  type="number"
                  name="establishedYear"
                  value={formData.establishedYear}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  placeholder="e.g., 2020"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <FiPhone className="inline w-4 h-4 mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                name="contactInfo.phone"
                value={formData.contactInfo.phone}
                onChange={handleInputChange}
                className={getInputClassName("contactInfo.phone", "w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border focus:ring-2 focus:outline-none")}
                placeholder="+94 XX XXX XXXX"
              />
              {getFieldError("contactInfo.phone") && (
                <p className="mt-1 text-sm text-red-400">
                  {getFieldError("contactInfo.phone")}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <FiMail className="inline w-4 h-4 mr-1" />
                Email Address
              </label>
              <input
                type="email"
                name="contactInfo.email"
                value={formData.contactInfo.email}
                onChange={handleInputChange}
                className={getInputClassName("contactInfo.email", "w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border focus:ring-2 focus:outline-none")}
                placeholder="gym@example.com"
              />
              {getFieldError("contactInfo.email") && (
                <p className="mt-1 text-sm text-red-400">
                  {getFieldError("contactInfo.email")}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <FiGlobe className="inline w-4 h-4 mr-1" />
                Website
              </label>
              <input
                type="url"
                name="contactInfo.website"
                value={formData.contactInfo.website}
                onChange={handleInputChange}
                className={getInputClassName("contactInfo.website", "w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border focus:ring-2 focus:outline-none")}
                placeholder="https://yourwebsite.com"
              />
              {getFieldError("contactInfo.website") && (
                <p className="mt-1 text-sm text-red-400">
                  {getFieldError("contactInfo.website")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6">
            <FiMapPin className="inline w-5 h-5 mr-2" />
            Address
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Street Address
              </label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  placeholder="State/Province"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  placeholder="ZIP Code"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6">Facilities</h2>
          
          <div className="space-y-4">
            {/* Quick selection from predefined options */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Select from common facilities
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addItemFromDropdown("facilities", e.target.value);
                    e.target.value = ""; // Reset dropdown
                  }
                }}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              >
                <option value="">Choose a facility...</option>
                {facilityOptions
                  .filter(option => !formData.facilities.includes(option))
                  .map((facility) => (
                    <option key={facility} value={facility}>
                      {facility}
                    </option>
                  ))}
              </select>
            </div>

            {/* Custom facility input */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Or add custom facility
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  className="flex-1 bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  placeholder="Add a custom facility..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addItem("facilities", newFacility, setNewFacility);
                    }
                  }}
                />
                <button
                  onClick={() => addItem("facilities", newFacility, setNewFacility)}
                  className="px-4 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  <FiPlus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Selected facilities */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Selected facilities
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                  >
                    {facility}
                    <button
                      onClick={() => removeItem("facilities", index)}
                      className="ml-2 hover:text-blue-100"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {formData.facilities.length === 0 && (
                  <p className="text-gray-500 text-sm">No facilities added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 lg:mb-0">
            <FiClock className="inline w-5 h-5 mr-2" />
            Operating Hours
          </h2>
          
          {/* Quick Fill Presets */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyHoursPreset('standard')}
                className="px-3 py-1 bg-violet-600/20 text-violet-300 rounded-md hover:bg-violet-600/30 transition-colors text-sm"
                title="Mon-Fri: 6AM-10PM, Sat: 7AM-8PM, Sun: 8AM-6PM"
              >
                Standard Hours
              </button>
              <button
                type="button"
                onClick={() => applyHoursPreset('24hours')}
                className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-md hover:bg-blue-600/30 transition-colors text-sm"
                title="Open 24 hours, 7 days a week"
              >
                24/7
              </button>
              <button
                type="button"
                onClick={() => applyHoursPreset('weekdays')}
                className="px-3 py-1 bg-green-600/20 text-green-300 rounded-md hover:bg-green-600/30 transition-colors text-sm"
                title="Monday-Friday: 6AM-9PM, Weekends closed"
              >
                Weekdays Only
              </button>
              <button
                type="button"
                onClick={() => applyHoursPreset('morning')}
                className="px-3 py-1 bg-amber-600/20 text-amber-300 rounded-md hover:bg-amber-600/30 transition-colors text-sm"
                title="Early morning gym: 5AM-12PM daily"
              >
                Morning Gym
              </button>
            </div>
            <p className="text-gray-400 text-xs">Click a preset to quickly fill all days, or use "Copy to..." on individual days</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(formData.operatingHours).map(([day, hours]) => (
            <div key={day} className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-white font-medium capitalize">{day}</label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hours.closed}
                    onChange={(e) =>
                      handleOperatingHoursChange(day, "closed", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <span className="text-gray-300 text-sm">Closed</span>
                </label>
              </div>
              
              {!hours.closed && (
                <div className="space-y-2">
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) =>
                      handleOperatingHoursChange(day, "open", e.target.value)
                    }
                    className="w-full bg-gray-900/50 text-white rounded px-3 py-2 border border-gray-700/50 focus:border-violet-500 focus:outline-none text-sm"
                    placeholder="Opening time"
                  />
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) =>
                      handleOperatingHoursChange(day, "close", e.target.value)
                    }
                    className="w-full bg-gray-900/50 text-white rounded px-3 py-2 border border-gray-700/50 focus:border-violet-500 focus:outline-none text-sm"
                    placeholder="Closing time"
                  />
                  
                  {/* Copy to other days dropdown */}
                  <div className="mt-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          const targetDays = e.target.value.split(',');
                          copyHoursToDay(day, targetDays);
                          e.target.value = ''; // Reset dropdown
                        }
                      }}
                      className="w-full bg-gray-900/50 text-white rounded px-2 py-1 border border-gray-700/50 focus:border-violet-500 focus:outline-none text-xs"
                    >
                      <option value="">Copy to...</option>
                      <option value="monday,tuesday,wednesday,thursday,friday">All Weekdays</option>
                      <option value="saturday,sunday">Weekend</option>
                      <option value="monday,tuesday,wednesday,thursday,friday,saturday,sunday">All Days</option>
                      {Object.keys(formData.operatingHours)
                        .filter(d => d !== day)
                        .map(d => (
                          <option key={d} value={d} className="capitalize">
                            {d}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Services */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6">Services</h2>
          
          <div className="space-y-4">
            {/* Quick selection from predefined options */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Select from common services
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addItemFromDropdown("services", e.target.value);
                    e.target.value = ""; // Reset dropdown
                  }
                }}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              >
                <option value="">Choose a service...</option>
                {serviceOptions
                  .filter(option => !formData.services.includes(option))
                  .map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
              </select>
            </div>

            {/* Custom service input */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Or add custom service
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="flex-1 bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  placeholder="Add a custom service..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addItem("services", newService, setNewService);
                    }
                  }}
                />
                <button
                  onClick={() => addItem("services", newService, setNewService)}
                  className="px-4 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  <FiPlus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Selected services */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Selected services
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.services.map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm"
                  >
                    {service}
                    <button
                      onClick={() => removeItem("services", index)}
                      className="ml-2 hover:text-green-100"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {formData.services.length === 0 && (
                  <p className="text-gray-500 text-sm">No services added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6">Amenities</h2>
          
          <div className="space-y-4">
            {/* Quick selection from predefined options */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Select from common amenities
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addItemFromDropdown("amenities", e.target.value);
                    e.target.value = ""; // Reset dropdown
                  }
                }}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              >
                <option value="">Choose an amenity...</option>
                {amenityOptions
                  .filter(option => !formData.amenities.includes(option))
                  .map((amenity) => (
                    <option key={amenity} value={amenity}>
                      {amenity}
                    </option>
                  ))}
              </select>
            </div>

            {/* Custom amenity input */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Or add custom amenity
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  className="flex-1 bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  placeholder="Add a custom amenity..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addItem("amenities", newAmenity, setNewAmenity);
                    }
                  }}
                />
                <button
                  onClick={() => addItem("amenities", newAmenity, setNewAmenity)}
                  className="px-4 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  <FiPlus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Selected amenities */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Selected amenities
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                  >
                    {amenity}
                    <button
                      onClick={() => removeItem("amenities", index)}
                      className="ml-2 hover:text-purple-100"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {formData.amenities.length === 0 && (
                  <p className="text-gray-500 text-sm">No amenities added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Special Programs */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6">Special Programs</h2>
          
          <div className="space-y-4">
            {/* Quick selection from predefined options */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Select from common programs
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addItemFromDropdown("specialPrograms", e.target.value);
                    e.target.value = ""; // Reset dropdown
                  }
                }}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              >
                <option value="">Choose a program...</option>
                {programOptions
                  .filter(option => !formData.specialPrograms.includes(option))
                  .map((program) => (
                    <option key={program} value={program}>
                      {program}
                    </option>
                  ))}
              </select>
            </div>

            {/* Custom program input */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Or add custom program
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newProgram}
                  onChange={(e) => setNewProgram(e.target.value)}
                  className="flex-1 bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  placeholder="Add a custom program..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addItem("specialPrograms", newProgram, setNewProgram);
                    }
                  }}
                />
                <button
                  onClick={() => addItem("specialPrograms", newProgram, setNewProgram)}
                  className="px-4 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  <FiPlus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Selected programs */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Selected programs
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.specialPrograms.map((program, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm"
                  >
                    {program}
                    <button
                      onClick={() => removeItem("specialPrograms", index)}
                      className="ml-2 hover:text-amber-100"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {formData.specialPrograms.length === 0 && (
                  <p className="text-gray-500 text-sm">No special programs added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-semibold text-white mb-6">Social Media</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Facebook
            </label>
            <input
              type="url"
              name="socialMedia.facebook"
              value={formData.socialMedia.facebook}
              onChange={handleInputChange}
              className={getInputClassName("socialMedia.facebook", "w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border focus:ring-2 focus:outline-none")}
              placeholder="https://facebook.com/yourpage"
            />
            {getFieldError("socialMedia.facebook") && (
              <p className="mt-1 text-sm text-red-400">
                {getFieldError("socialMedia.facebook")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Instagram
            </label>
            <input
              type="url"
              name="socialMedia.instagram"
              value={formData.socialMedia.instagram}
              onChange={handleInputChange}
              className={getInputClassName("socialMedia.instagram", "w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border focus:ring-2 focus:outline-none")}
              placeholder="https://instagram.com/yourpage"
            />
            {getFieldError("socialMedia.instagram") && (
              <p className="mt-1 text-sm text-red-400">
                {getFieldError("socialMedia.instagram")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Twitter
            </label>
            <input
              type="url"
              name="socialMedia.twitter"
              value={formData.socialMedia.twitter}
              onChange={handleInputChange}
              className={getInputClassName("socialMedia.twitter", "w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border focus:ring-2 focus:outline-none")}
              placeholder="https://twitter.com/yourpage"
            />
            {getFieldError("socialMedia.twitter") && (
              <p className="mt-1 text-sm text-red-400">
                {getFieldError("socialMedia.twitter")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              YouTube
            </label>
            <input
              type="url"
              name="socialMedia.youtube"
              value={formData.socialMedia.youtube}
              onChange={handleInputChange}
              className={getInputClassName("socialMedia.youtube", "w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border focus:ring-2 focus:outline-none")}
              placeholder="https://youtube.com/yourchannel"
            />
            {getFieldError("socialMedia.youtube") && (
              <p className="mt-1 text-sm text-red-400">
                {getFieldError("socialMedia.youtube")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-8 py-4 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 font-medium"
        >
          <FiSave className="h-5 w-5 mr-2" />
          {saving ? "Saving Changes..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}

export default EditGymDetails;