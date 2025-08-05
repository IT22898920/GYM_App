import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || 'An error occurred';
      return Promise.reject({
        message: errorMessage,
        status: error.response.status,
        errors: error.response.data?.errors || []
      });
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        message: 'Unable to connect to server. Please try again.',
        status: 0
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: 0
      });
    }
  }
);

// Gym registration service
export const gymService = {
  // Register a new gym
  registerGym: async (gymData) => {
    try {
      const response = await api.post('/gyms/register', gymData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Upload gym images
  uploadGymImages: async (gymId, imageFiles, captions = []) => {
    try {
      const formData = new FormData();
      
      // Add image files
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });
      
      // Add captions if provided
      captions.forEach((caption, index) => {
        formData.append('captions', caption);
      });

      const response = await api.post(`/gyms/${gymId}/upload-images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Upload gym logo
  uploadGymLogo: async (gymId, logoFile) => {
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);

      const response = await api.post(`/gyms/${gymId}/upload-logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get all gyms with filters
  getAllGyms: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          if (Array.isArray(filters[key])) {
            filters[key].forEach(value => queryParams.append(key, value));
          } else {
            queryParams.append(key, filters[key]);
          }
        }
      });

      const response = await api.get(`/gyms?${queryParams.toString()}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get gym by ID
  getGymById: async (gymId) => {
    try {
      const response = await api.get(`/gyms/${gymId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update gym
  updateGym: async (gymId, updateData) => {
    try {
      const response = await api.put(`/gyms/${gymId}`, updateData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete gym
  deleteGym: async (gymId) => {
    try {
      const response = await api.delete(`/gyms/${gymId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get gyms owned by current user
  getMyGyms: async () => {
    try {
      const response = await api.get('/gyms/owner/gyms');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get gym owner dashboard data
  getGymDashboard: async () => {
    try {
      const response = await api.get('/gyms/owner/dashboard');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Search nearby gyms
  searchNearbyGyms: async (latitude, longitude, radius = 10) => {
    try {
      const response = await api.get('/gyms/search/nearby', {
        params: { latitude, longitude, radius }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin functions
  admin: {
    // Get gym statistics
    getStats: async () => {
      try {
        const response = await api.get('/gyms/admin/stats');
        return response;
      } catch (error) {
        throw error;
      }
    },

    // Approve gym
    approveGym: async (gymId, adminNotes = '') => {
      try {
        const response = await api.put(`/gyms/${gymId}/approve`, { adminNotes });
        return response;
      } catch (error) {
        throw error;
      }
    },

    // Reject gym
    rejectGym: async (gymId, adminNotes) => {
      try {
        const response = await api.put(`/gyms/${gymId}/reject`, { adminNotes });
        return response;
      } catch (error) {
        throw error;
      }
    }
  }
};

// Helper function to map display duration to API duration
const mapDurationToAPI = (displayDuration) => {
  const mapping = {
    '1 day': 'daily',
    '1 week': 'weekly', 
    '1 month': 'monthly',
    '3 months': 'quarterly',
    '1 year': 'yearly',
    // Also handle if backend values are passed directly
    'daily': 'daily',
    'weekly': 'weekly',
    'monthly': 'monthly',
    'quarterly': 'quarterly',
    'yearly': 'yearly'
  };
  return mapping[displayDuration] || 'monthly'; // Default to monthly
};

// Helper function to format gym data for API
export const formatGymDataForAPI = (formData) => {
  // Ensure location exists and has valid coordinates
  if (!formData.location || !formData.location.lat || !formData.location.lng) {
    throw new Error('Location coordinates are required. Please set your gym location on the map.');
  }

  const lng = parseFloat(formData.location.lng);
  const lat = parseFloat(formData.location.lat);
  
  // Check if parsing resulted in valid numbers
  if (isNaN(lng) || isNaN(lat)) {
    throw new Error('Invalid location coordinates. Please set a valid location on the map.');
  }
  
  const coordinates = [lng, lat];
  console.log('DEBUG - Coordinates being sent:', coordinates);
  console.log('DEBUG - Coordinates types:', typeof coordinates[0], typeof coordinates[1]);
  console.log('DEBUG - Original location data:', formData.location);

  const apiData = {
    gymName: formData.gymName,
    description: formData.gymType || formData.description, // Using gymType as description if no description provided
    contactInfo: {
      email: formData.email,
      phone: formData.phone,
      website: formData.website && formData.website.trim() && isValidUrl(formData.website) ? formData.website : undefined
    },
    address: {
      street: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: 'Sri Lanka' // Default country
    },
    coordinates: coordinates, // [longitude, latitude]
    facilities: formData.facilities || [],
    services: formData.classTypes || [], // Using classTypes as services
    pricing: {
      membershipPlans: formData.membershipPlans?.map(plan => ({
        name: plan.name,
        duration: mapDurationToAPI(plan.duration),
        price: parseFloat(plan.price) || 0,
        benefits: plan.description ? [plan.description] : []
      })) || [],
      dropInFee: 0 // Default drop-in fee
    },
    amenities: formData.facilities || [], // Using facilities as amenities too
    capacity: 100, // Default capacity
    establishedYear: new Date().getFullYear(), // Current year as default
    socialMedia: {
      facebook: formData.socialMedia?.facebook && isValidUrl(formData.socialMedia.facebook) ? formData.socialMedia.facebook : undefined,
      instagram: formData.socialMedia?.instagram && isValidUrl(formData.socialMedia.instagram) ? formData.socialMedia.instagram : undefined,
      twitter: formData.socialMedia?.twitter && isValidUrl(formData.socialMedia.twitter) ? formData.socialMedia.twitter : undefined
    },
    tags: [formData.gymType] // Using gymType as tag
  };
  
  return apiData;
};

// Helper function to validate URL
const isValidUrl = (string) => {
  if (!string || !string.trim()) return false;
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Helper function to validate gym data before submission
export const validateGymData = (formData) => {
  const errors = {};

  // Required fields validation
  if (!formData.gymName?.trim()) {
    errors.gymName = 'Gym name is required';
  }

  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.phone?.trim()) {
    errors.phone = 'Phone number is required';
  }

  if (!formData.address?.trim()) {
    errors.address = 'Address is required';
  }

  if (!formData.city?.trim()) {
    errors.city = 'City is required';
  }

  if (!formData.state?.trim()) {
    errors.state = 'State is required';
  }

  if (!formData.zipCode?.trim()) {
    errors.zipCode = 'ZIP code is required';
  }

  if (!formData.facilities || formData.facilities.length === 0) {
    errors.facilities = 'Please select at least one facility';
  }

  if (!formData.classTypes || formData.classTypes.length === 0) {
    errors.classTypes = 'Please select at least one service type';
  }

  if (!formData.location || !formData.location.lat || !formData.location.lng) {
    errors.location = 'Please set your gym location on the map';
  }

  if (!formData.termsAccepted) {
    errors.termsAccepted = 'You must accept the terms and conditions';
  }

  if (!formData.privacyAccepted) {
    errors.privacyAccepted = 'You must accept the privacy policy';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default gymService;