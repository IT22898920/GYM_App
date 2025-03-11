import { useState } from "react";
import {
  FiSearch,
  FiMapPin,
  FiStar,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiFilter,
  FiChevronDown,
  FiActivity,
  FiCheck,
  FiArrowLeft,
  FiArrowRight,
  FiHeart,
  FiCalendar,
  FiAward,
  FiPhone,
  FiMail,
  FiGlobe,
  FiInstagram,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import MapComponent from "../components/MapComponent";

// New GymDetails Component to handle the expanded section with image slider
function GymDetails({ gym }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to go to the next image
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gym.images.length);
  };

  // Function to go to the previous image
  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + gym.images.length) % gym.images.length
    );
  };

  return (
    <div className="border-t border-gray-700/50 p-6">
      {/* Existing Details: Description and Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            About {gym.name}
          </h4>
          <p className="text-gray-400 mb-6">{gym.description}</p>
          <div className="space-y-3">
            <div className="flex items-center text-gray-400">
              <FiPhone className="w-4 h-4 mr-3 text-violet-400" />
              <span>{gym.phone}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <FiMail className="w-4 h-4 mr-3 text-violet-400" />
              <span>{gym.email}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <FiGlobe className="w-4 h-4 mr-3 text-violet-400" />
              <a
                href={gym.website}
                className="hover:text-violet-400 transition-colors"
              >
                {gym.website.replace("https://", "")}
              </a>
            </div>
            {gym.social.instagram && (
              <div className="flex items-center text-gray-400">
                <FiInstagram className="w-4 h-4 mr-3 text-violet-400" />
                <a
                  href={`https://instagram.com/${gym.social.instagram}`}
                  className="hover:text-violet-400 transition-colors"
                >
                  @{gym.social.instagram}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Existing Details: Instructors */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            Featured Instructors
          </h4>
          <div className="space-y-4">
            {gym.instructors.map((instructor, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg"
              >
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-white font-medium">
                        {instructor.name}
                      </h5>
                      <p className="text-violet-400 text-sm">
                        {instructor.specialization}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-yellow-400">
                        <FiStar className="w-4 h-4 mr-1" />
                        <span className="text-white">{instructor.rating}</span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {instructor.reviews} reviews
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-sm">
                      <FiCalendar className="w-4 h-4 mr-1" />
                      {instructor.availability.join(", ")}
                    </div>
                    <span className="text-white font-medium">
                      ${instructor.price}/hr
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Existing Details: Classes */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-white mb-4">
          Featured Classes
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gym.classes.map((cls, index) => (
            <div key={index} className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h5 className="text-white font-medium">{cls.name}</h5>
                  <p className="text-gray-400 text-sm">{cls.instructor}</p>
                </div>
                <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm">
                  ${cls.price}
                </span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <FiClock className="w-4 h-4 mr-2" />
                {cls.time} • {cls.duration}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Image Slider */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-white mb-4">Gallery</h4>
        <div className="relative">
          <img
            src={gym.images[currentImageIndex]}
            alt={`Gym image ${currentImageIndex + 1}`}
            className="w-full h-64 object-cover rounded-lg"
          />
          {gym.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <FiArrowLeft />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <FiArrowRight />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FindGym() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    amenities: [],
    priceRange: "all",
    rating: "all",
    distance: "all",
    classTypes: [],
  });
  const [location, setLocation] = useState({
    lat: 37.7749,
    lng: -122.4194,
  });
  const [selectedGym, setSelectedGym] = useState(null);

  // Filter options (unchanged)
  const amenityOptions = [
    "Cardio Equipment",
    "Weight Training",
    "Personal Training",
    "Yoga Studio",
    "Pool",
    "Sauna",
    "CrossFit",
    "Group Classes",
    "Olympic Lifting",
    "Spa",
    "Pilates",
    "Basketball Court",
    "Locker Rooms",
    "Showers",
    "Towel Service",
    "Parking",
  ];

  const classTypeOptions = [
    "Yoga",
    "HIIT",
    "Strength Training",
    "CrossFit",
    "Pilates",
    "Spinning",
    "Zumba",
    "Boxing",
    "Martial Arts",
  ];

  const priceRangeOptions = [
    { value: "all", label: "All Prices" },
    { value: "$", label: "Budget ($)" },
    { value: "$$", label: "Standard ($$)" },
    { value: "$$$", label: "Premium ($$$)" },
  ];

  const ratingOptions = [
    { value: "all", label: "All Ratings" },
    { value: "4.5", label: "4.5+ Stars" },
    { value: "4.0", label: "4.0+ Stars" },
    { value: "3.5", label: "3.5+ Stars" },
  ];

  const distanceOptions = [
    { value: "all", label: "All Distances" },
    { value: "1", label: "Within 1 mile" },
    { value: "5", label: "Within 5 miles" },
    { value: "10", label: "Within 10 miles" },
  ];

  // Updated gym data with multiple images
  const gyms = [
    {
      id: 1,
      name: "FitZone Elite",
      description:
        "Premium fitness facility with state-of-the-art equipment and expert trainers.",
      images: [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80",
      ],
      rating: 4.8,
      reviews: 245,
      address: "123 Fitness Street, San Francisco, CA",
      distance: "0.5 miles",
      priceRange: "$$",
      amenities: [
        "Cardio Equipment",
        "Weight Training",
        "Personal Training",
        "Yoga Studio",
      ],
      hours: "5:00 AM - 11:00 PM",
      memberCount: "500+",
      phone: "(555) 123-4567",
      email: "info@fitzone.com",
      website: "https://fitzone.com",
      social: { instagram: "fitzone" },
      lat: 37.7849,
      lng: -122.4194,
      instructors: [
        {
          name: "Sarah Johnson",
          specialization: "Yoga",
          rating: 4.9,
          reviews: 125,
          image: "https://i.pravatar.cc/150?img=1",
          availability: ["Mon", "Wed", "Fri"],
          price: 75,
        },
        {
          name: "Mike Chen",
          specialization: "Strength Training",
          rating: 4.8,
          reviews: 98,
          image: "https://i.pravatar.cc/150?img=2",
          availability: ["Tue", "Thu", "Sat"],
          price: 85,
        },
      ],
      classes: [
        {
          name: "Morning Yoga Flow",
          instructor: "Sarah Johnson",
          time: "7:00 AM",
          duration: "60 min",
          price: 25,
        },
        {
          name: "HIIT Blast",
          instructor: "Mike Chen",
          time: "5:30 PM",
          duration: "45 min",
          price: 30,
        },
      ],
    },
    {
      id: 2,
      name: "PowerFlex Gym",
      description:
        "Specialized strength and conditioning facility focused on performance.",
      images: [
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80",
      ],
      rating: 4.6,
      reviews: 189,
      address: "456 Strength Ave, San Francisco, CA",
      distance: "1.2 miles",
      priceRange: "$$$",
      amenities: ["CrossFit", "Olympic Lifting", "Group Classes", "Spa"],
      hours: "6:00 AM - 10:00 PM",
      memberCount: "350+",
      phone: "(555) 234-5678",
      email: "info@powerflex.com",
      website: "https://powerflex.com",
      social: { instagram: "powerflex" },
      lat: 37.7649,
      lng: -122.4294,
      instructors: [
        {
          name: "Alex Thompson",
          specialization: "CrossFit",
          rating: 4.7,
          reviews: 87,
          image: "https://i.pravatar.cc/150?img=3",
          availability: ["Mon", "Wed", "Fri"],
          price: 90,
        },
      ],
      classes: [
        {
          name: "CrossFit WOD",
          instructor: "Alex Thompson",
          time: "6:00 AM",
          duration: "60 min",
          price: 35,
        },
      ],
    },
    {
      id: 3,
      name: "Wellness Hub",
      description:
        "Holistic wellness center combining fitness, relaxation, and mindfulness.",
      images: [
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80",
      ],
      rating: 4.9,
      reviews: 312,
      address: "789 Health Blvd, San Francisco, CA",
      distance: "0.8 miles",
      priceRange: "$$",
      amenities: ["Pool", "Sauna", "Yoga Studio", "Pilates"],
      hours: "5:30 AM - 10:30 PM",
      memberCount: "600+",
      phone: "(555) 345-6789",
      email: "info@wellnesshub.com",
      website: "https://wellnesshub.com",
      social: { instagram: "wellnesshub" },
      lat: 37.7949,
      lng: -122.4094,
      instructors: [
        {
          name: "Emma Rodriguez",
          specialization: "Pilates",
          rating: 5.0,
          reviews: 156,
          image: "https://i.pravatar.cc/150?img=4",
          availability: ["Tue", "Thu", "Sat"],
          price: 80,
        },
      ],
      classes: [
        {
          name: "Reformer Pilates",
          instructor: "Emma Rodriguez",
          time: "9:00 AM",
          duration: "50 min",
          price: 40,
        },
      ],
    },
  ];

  const handleFilterChange = (filterType, value) => {
    if (filterType === "amenities" || filterType === "classTypes") {
      setSelectedFilters((prev) => ({
        ...prev,
        [filterType]: prev[filterType].includes(value)
          ? prev[filterType].filter((item) => item !== value)
          : [...prev[filterType], value],
      }));
    } else {
      setSelectedFilters((prev) => ({
        ...prev,
        [filterType]: value,
      }));
    }
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const filteredGyms = gyms.filter((gym) => {
    const matchesSearch =
      gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriceRange =
      selectedFilters.priceRange === "all" ||
      gym.priceRange === selectedFilters.priceRange;
    const matchesRating =
      selectedFilters.rating === "all" ||
      gym.rating >= parseFloat(selectedFilters.rating);
    const matchesAmenities =
      selectedFilters.amenities.length === 0 ||
      selectedFilters.amenities.every((amenity) =>
        gym.amenities.includes(amenity)
      );

    return (
      matchesSearch && matchesPriceRange && matchesRating && matchesAmenities
    );
  });

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12 relative overflow-hidden">
      {/* Background Effects (unchanged) */}
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

      <div className="container mx-auto px-4 relative">
        {/* Back Button (unchanged) */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 group transition-colors"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header (unchanged) */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Find Your Perfect Gym
          </h1>
          <p className="text-xl text-gray-400">
            Discover top-rated gyms and fitness centers near you. Filter by
            amenities, read reviews, and find the perfect fit for your fitness
            journey.
          </p>
        </div>

        {/* Search Bar (unchanged) */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center gap-4 bg-gray-800/40 backdrop-blur-xl p-2 rounded-full border border-gray-700/50">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location or gym name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-white pl-12 pr-4 py-3 focus:outline-none"
              />
            </div>
            <button className="bg-violet-600 text-white px-6 py-3 rounded-full hover:bg-violet-700 transition-colors">
              Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filters (unchanged) */}
          <div className="space-y-6">
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FiFilter className="mr-2" /> Filters
              </h2>
              <div className="mb-6">
                <h3 className="text-gray-300 font-medium mb-3">Price Range</h3>
                <select
                  value={selectedFilters.priceRange}
                  onChange={(e) =>
                    handleFilterChange("priceRange", e.target.value)
                  }
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                >
                  {priceRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <h3 className="text-gray-300 font-medium mb-3">Rating</h3>
                <select
                  value={selectedFilters.rating}
                  onChange={(e) => handleFilterChange("rating", e.target.value)}
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                >
                  {ratingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <h3 className="text-gray-300 font-medium mb-3">Distance</h3>
                <select
                  value={selectedFilters.distance}
                  onChange={(e) =>
                    handleFilterChange("distance", e.target.value)
                  }
                  className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                >
                  {distanceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <h3 className="text-gray-300 font-medium mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {amenityOptions.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center space-x-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilters.amenities.includes(amenity)}
                        onChange={() =>
                          handleFilterChange("amenities", amenity)
                        }
                        className="hidden"
                      />
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selectedFilters.amenities.includes(amenity)
                            ? "bg-violet-500 border-violet-500"
                            : "border-gray-600"
                        }`}
                      >
                        {selectedFilters.amenities.includes(amenity) && (
                          <FiCheck className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-gray-400">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-gray-300 font-medium mb-3">Class Types</h3>
                <div className="grid grid-cols-2 gap-2">
                  {classTypeOptions.map((type) => (
                    <label
                      key={type}
                      className="flex items-center space-x-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilters.classTypes.includes(type)}
                        onChange={() => handleFilterChange("classTypes", type)}
                        className="hidden"
                      />
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selectedFilters.classTypes.includes(type)
                            ? "bg-violet-500 border-violet-500"
                            : "border-gray-600"
                        }`}
                      >
                        {selectedFilters.classTypes.includes(type) && (
                          <FiCheck className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-gray-400">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/50">
              <div className="h-[400px]">
                <MapComponent
                  location={location}
                  onLocationChange={handleLocationChange}
                />
              </div>
            </div>
          </div>

          {/* Gym Listings */}
          <div className="lg:col-span-2 space-y-6">
            {filteredGyms.map((gym) => (
              <div
                key={gym.id}
                className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Gym Image (updated to use first image from array) */}
                  <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
                    <img
                      src={gym.images[0]}
                      alt={gym.name}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Gym Details (unchanged) */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-2">
                          {gym.name}
                        </h3>
                        <div className="flex items-center text-gray-400 text-sm">
                          <FiMapPin className="w-4 h-4 mr-1" />
                          <span>{gym.address}</span>
                          <span className="mx-2">•</span>
                          <span>{gym.distance}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-yellow-400 mr-2">
                          <FiStar className="w-5 h-5 inline-block" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">
                            {gym.rating}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {gym.reviews} reviews
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-gray-400">
                        <FiClock className="w-4 h-4 mr-2 text-violet-400" />
                        <span className="text-sm">{gym.hours}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <FiUsers className="w-4 h-4 mr-2 text-violet-400" />
                        <span className="text-sm">
                          {gym.memberCount} members
                        </span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <FiDollarSign className="w-4 h-4 mr-2 text-violet-400" />
                        <span className="text-sm">{gym.priceRange}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <FiActivity className="w-4 h-4 mr-2 text-violet-400" />
                        <span className="text-sm">
                          {gym.amenities.length} amenities
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {gym.amenities.slice(0, 4).map((amenity, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                      {gym.amenities.length > 4 && (
                        <button className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors">
                          +{gym.amenities.length - 4} more
                        </button>
                      )}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <button
                        onClick={() =>
                          setSelectedGym(selectedGym === gym.id ? null : gym.id)
                        }
                        className="flex items-center px-4 py-2 bg-violet-600/20 text-violet-400 rounded-lg hover:bg-violet-600/30 transition-colors"
                      >
                        View Details
                        <FiChevronDown
                          className={`ml-2 transform transition-transform ${
                            selectedGym === gym.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <Link
                        to={`/register-gym/${gym.id}`}
                        className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                      >
                        Register Now
                        <FiArrowRight className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Render GymDetails component when expanded */}
                {selectedGym === gym.id && <GymDetails gym={gym} />}
              </div>
            ))}

            {/* No Results Message (unchanged) */}
            {filteredGyms.length === 0 && (
              <div className="text-center py-12 bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 mb-4">
                  <FiSearch className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Gyms Found
                </h3>
                <p className="text-gray-400">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindGym;