import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSave,
  FiPhone,
  FiMail,
  FiGlobe,
  FiMapPin,
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiCheck,
  FiClock,
} from "react-icons/fi";
import axios from "axios";

function ContactInfo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [gymId, setGymId] = useState(null);
  const [gymData, setGymData] = useState(null);

  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
    website: "",
    whatsapp: "",
    emergencyContact: "",
  });

  const [socialMedia, setSocialMedia] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
  });

  const [operatingHours, setOperatingHours] = useState({
    monday: { open: "", close: "", closed: false },
    tuesday: { open: "", close: "", closed: false },
    wednesday: { open: "", close: "", closed: false },
    thursday: { open: "", close: "", closed: false },
    friday: { open: "", close: "", closed: false },
    saturday: { open: "", close: "", closed: false },
    sunday: { open: "", close: "", closed: false },
  });

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
        const gym = response.data.data[0];
        setGymId(gym._id);
        setGymData(gym);
        
        // Set contact info
        if (gym.contactInfo) {
          setContactInfo({
            phone: gym.contactInfo.phone || "",
            email: gym.contactInfo.email || "",
            website: gym.contactInfo.website || "",
            whatsapp: gym.contactInfo.whatsapp || "",
            emergencyContact: gym.contactInfo.emergencyContact || "",
          });
        }
        
        // Set social media
        if (gym.socialMedia) {
          setSocialMedia({
            facebook: gym.socialMedia.facebook || "",
            instagram: gym.socialMedia.instagram || "",
            twitter: gym.socialMedia.twitter || "",
            linkedin: gym.socialMedia.linkedin || "",
            youtube: gym.socialMedia.youtube || "",
            tiktok: gym.socialMedia.tiktok || "",
          });
        }
        
        // Set operating hours
        if (gym.operatingHours) {
          setOperatingHours({
            monday: gym.operatingHours.monday || { open: "", close: "", closed: false },
            tuesday: gym.operatingHours.tuesday || { open: "", close: "", closed: false },
            wednesday: gym.operatingHours.wednesday || { open: "", close: "", closed: false },
            thursday: gym.operatingHours.thursday || { open: "", close: "", closed: false },
            friday: gym.operatingHours.friday || { open: "", close: "", closed: false },
            saturday: gym.operatingHours.saturday || { open: "", close: "", closed: false },
            sunday: gym.operatingHours.sunday || { open: "", close: "", closed: false },
          });
        }
      }
    } catch (error) {
      console.error("Error loading gym data:", error);
      setError("Failed to load gym data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setSocialMedia(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const toggleDayClosed = (day) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        closed: !prev[day].closed,
        open: !prev[day].closed ? "" : prev[day].open,
        close: !prev[day].closed ? "" : prev[day].close,
      }
    }));
  };

  const handleSave = async () => {
    if (!gymId) {
      setError("Gym ID not found. Please try refreshing the page.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updateData = {
        contactInfo,
        socialMedia,
        operatingHours,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/gyms/${gymId}`,
        updateData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating contact info:", error);
      setError(
        error.response?.data?.message || "Failed to update contact information. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const dayNames = {
    monday: "Monday",
    tuesday: "Tuesday", 
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
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
              Contact Information
            </h1>
            <p className="text-gray-400 mt-1">Manage your gym's contact details and operating hours</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave className="h-5 w-5 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4 text-green-300">
          Contact information updated successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <FiPhone className="h-5 w-5 mr-2" />
            Contact Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <FiPhone className="h-4 w-4 inline mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={contactInfo.phone}
                onChange={handleContactInfoChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="+94 XX XXX XXXX"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <FiMail className="h-4 w-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={contactInfo.email}
                onChange={handleContactInfoChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="contact@yourgym.com"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <FiGlobe className="h-4 w-4 inline mr-1" />
                Website
              </label>
              <input
                type="url"
                name="website"
                value={contactInfo.website}
                onChange={handleContactInfoChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="https://www.yourgym.com"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                WhatsApp Number
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={contactInfo.whatsapp}
                onChange={handleContactInfoChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="+94 XX XXX XXXX"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Emergency Contact
              </label>
              <input
                type="tel"
                name="emergencyContact"
                value={contactInfo.emergencyContact}
                onChange={handleContactInfoChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="+94 XX XXX XXXX"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <FiInstagram className="h-5 w-5 mr-2" />
            Social Media Links
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <FiFacebook className="h-4 w-4 inline mr-1" />
                Facebook
              </label>
              <input
                type="url"
                name="facebook"
                value={socialMedia.facebook}
                onChange={handleSocialMediaChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="https://facebook.com/yourgym"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <FiInstagram className="h-4 w-4 inline mr-1" />
                Instagram
              </label>
              <input
                type="url"
                name="instagram"
                value={socialMedia.instagram}
                onChange={handleSocialMediaChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="https://instagram.com/yourgym"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <FiTwitter className="h-4 w-4 inline mr-1" />
                Twitter
              </label>
              <input
                type="url"
                name="twitter"
                value={socialMedia.twitter}
                onChange={handleSocialMediaChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="https://twitter.com/yourgym"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <FiLinkedin className="h-4 w-4 inline mr-1" />
                LinkedIn
              </label>
              <input
                type="url"
                name="linkedin"
                value={socialMedia.linkedin}
                onChange={handleSocialMediaChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="https://linkedin.com/company/yourgym"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                YouTube
              </label>
              <input
                type="url"
                name="youtube"
                value={socialMedia.youtube}
                onChange={handleSocialMediaChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="https://youtube.com/yourgym"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                TikTok
              </label>
              <input
                type="url"
                name="tiktok"
                value={socialMedia.tiktok}
                onChange={handleSocialMediaChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="https://tiktok.com/@yourgym"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <FiClock className="h-5 w-5 mr-2" />
          Operating Hours
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(operatingHours).map(([day, hours]) => (
            <div key={day} className="bg-gray-900/30 rounded-lg p-4 border border-gray-700/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white capitalize">{dayNames[day]}</h3>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hours.closed}
                    onChange={() => toggleDayClosed(day)}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    hours.closed ? 'bg-red-600' : 'bg-green-600'
                  }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      hours.closed ? 'translate-x-1' : 'translate-x-6'
                    }`} />
                  </div>
                  <span className="ml-2 text-sm text-gray-400">
                    {hours.closed ? 'Closed' : 'Open'}
                  </span>
                </label>
              </div>

              {!hours.closed && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Open Time</label>
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                      className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-600 focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Close Time</label>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                      className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-600 focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;