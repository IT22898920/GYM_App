import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiSave,
  FiSearch,
  FiNavigation,
  FiCheck,
  FiX,
} from "react-icons/fi";
import axios from "axios";
import MapComponent from "../../components/MapComponent";

function UpdateLocation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [gymId, setGymId] = useState(null);
  const [gymData, setGymData] = useState(null);

  // Location states
  const [currentLocation, setCurrentLocation] = useState({ lat: 37.7749, lng: -122.4194 });
  const [newLocation, setNewLocation] = useState(null);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Sri Lanka",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);

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
        
        // Set current location
        if (gym.location && gym.location.coordinates) {
          const [lng, lat] = gym.location.coordinates;
          setCurrentLocation({ lat, lng });
        }
        
        // Set address
        if (gym.address) {
          setAddress({
            street: gym.address.street || "",
            city: gym.address.city || "",
            state: gym.address.state || "",
            zipCode: gym.address.zipCode || "",
            country: gym.address.country || "Sri Lanka",
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

  const handleLocationChange = (newLocation) => {
    setNewLocation(newLocation);
    setError(null);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getCurrentLocation = () => {
    setGettingCurrentLocation(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setGettingCurrentLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };
        setNewLocation(location);
        setGettingCurrentLocation(false);
      },
      (error) => {
        console.error("Error getting current location:", error);
        setError("Unable to get your current location. Please try again or set location manually.");
        setGettingCurrentLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search query.");
      return;
    }

    try {
      // This is a simple geocoding implementation
      // In a real app, you'd use Google Geocoding API or similar
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const location = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon)
        };
        setNewLocation(location);
        setError(null);
      } else {
        setError("Location not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      setError("Failed to search location. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!gymId) {
      setError("Gym ID not found. Please try refreshing the page.");
      return;
    }

    const locationToSave = newLocation || currentLocation;
    
    if (!locationToSave) {
      setError("Please select a location on the map.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updateData = {
        location: {
          type: "Point",
          coordinates: [locationToSave.lng, locationToSave.lat]
        },
        address: address
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
        setCurrentLocation(locationToSave);
        setNewLocation(null);
        
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating location:", error);
      setError(
        error.response?.data?.message || "Failed to update location. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const resetLocation = () => {
    setNewLocation(null);
    setError(null);
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
              Update Location
            </h1>
            <p className="text-gray-400 mt-1">Update your gym's address and map location</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || (!newLocation && !address.street)}
          className="flex items-center px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave className="h-5 w-5 mr-2" />
          {saving ? "Saving..." : "Save Location"}
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4 text-green-300">
          Location updated successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Address Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Address Section */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <FiMapPin className="h-5 w-5 mr-2" />
              Address Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
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
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="State/Province"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleAddressChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="ZIP"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={address.country}
                    onChange={handleAddressChange}
                    className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location Tools */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-6">Location Tools</h2>

            <div className="space-y-4">
              {/* Current Location */}
              <button
                onClick={getCurrentLocation}
                disabled={gettingCurrentLocation}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors disabled:opacity-50"
              >
                <FiNavigation className="h-5 w-5 mr-2" />
                {gettingCurrentLocation ? "Getting Location..." : "Use Current Location"}
              </button>

              {/* Search Location */}
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    placeholder="Search for location..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        searchLocation();
                      }
                    }}
                  />
                  <button
                    onClick={searchLocation}
                    className="px-4 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    <FiSearch className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Reset */}
              {newLocation && (
                <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-500/50 rounded-lg">
                  <div className="flex items-center">
                    <FiCheck className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-green-300 text-sm">New location selected</span>
                  </div>
                  <button
                    onClick={resetLocation}
                    className="p-1 text-green-400 hover:text-green-300 transition-colors"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-6">Map Location</h2>
            
            <div className="aspect-video bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
              <MapComponent
                location={newLocation || currentLocation}
                onLocationChange={handleLocationChange}
                height="100%"
              />
            </div>
            
            <div className="mt-4 text-sm text-gray-400">
              <p>Click on the map to set your gym's exact location</p>
              {newLocation && (
                <p className="text-green-400 mt-1">
                  New coordinates: {newLocation.lat.toFixed(6)}, {newLocation.lng.toFixed(6)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateLocation;