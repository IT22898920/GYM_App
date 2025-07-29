const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  // Helper method to handle responses
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  }

  // Helper method to get headers
  getHeaders(isFormData = false) {
    const headers = {};
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Get token from localStorage if exists
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Auth endpoints
  async register(userData) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(userData)
    });
    
    const data = await this.handleResponse(response);
    
    // Store token if provided
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userRole', data.user.role); // For easy access
    }
    
    return data;
  }

  async login(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(credentials)
    });
    
    const data = await this.handleResponse(response);
    
    // Store token and user data
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userRole', data.user.role); // For easy access
    }
    
    return data;
  }

  async logout() {
    try {
      const response = await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include'
      });
      
      await this.handleResponse(response);
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    }
  }

  async getMe() {
    const response = await fetch(`${this.baseURL}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async refreshToken() {
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    const data = await this.handleResponse(response);
    
    // Update token if provided
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  }

  // Role-specific login methods
  async adminLogin(credentials) {
    return this.login({ ...credentials, role: 'admin' });
  }

  async gymOwnerLogin(credentials) {
    return this.login({ ...credentials, role: 'gymOwner' });
  }

  async instructorLogin(credentials) {
    return this.login({ ...credentials, role: 'instructor' });
  }

  async customerLogin(credentials) {
    return this.login({ ...credentials, role: 'customer' });
  }

  // Instructor application endpoints
  async submitInstructorApplication(formData) {
    const response = await fetch(`${this.baseURL}/instructors/apply`, {
      method: 'POST',
      headers: this.getHeaders(true), // true for FormData
      credentials: 'include',
      body: formData
    });
    
    return this.handleResponse(response);
  }

  async getMyInstructorApplications() {
    const response = await fetch(`${this.baseURL}/instructors/my-applications`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async getInstructorApplicationById(id) {
    const response = await fetch(`${this.baseURL}/instructors/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  // Admin only instructor application endpoints
  async getAllInstructorApplications(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/instructors?${queryParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async approveInstructorApplication(id, adminNotes = '') {
    const response = await fetch(`${this.baseURL}/instructors/${id}/approve`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ adminNotes })
    });
    
    return this.handleResponse(response);
  }

  async rejectInstructorApplication(id, adminNotes = '') {
    const response = await fetch(`${this.baseURL}/instructors/${id}/reject`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ adminNotes })
    });
    
    return this.handleResponse(response);
  }

  async getInstructorApplicationStats() {
    const response = await fetch(`${this.baseURL}/instructors/admin/stats`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  // Verified Instructors endpoints
  async getVerifiedInstructors(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/instructors/admin/verified?${queryParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async getInstructorDetailsById(id) {
    const response = await fetch(`${this.baseURL}/instructors/admin/instructor/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async toggleInstructorStatus(id, isActive) {
    const response = await fetch(`${this.baseURL}/instructors/admin/instructor/${id}/toggle-status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ isActive })
    });
    
    return this.handleResponse(response);
  }

  // Gym Instructor Management endpoints
  async getGymInstructors(gymId) {
    const response = await fetch(`${this.baseURL}/gyms/${gymId}/instructors`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async searchAvailableInstructors(gymId, params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/gyms/${gymId}/instructors/search?${queryParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async addInstructorToGym(gymId, instructorData) {
    const response = await fetch(`${this.baseURL}/gyms/${gymId}/instructors`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(instructorData)
    });
    
    return this.handleResponse(response);
  }

  async removeInstructorFromGym(gymId, instructorId) {
    const response = await fetch(`${this.baseURL}/gyms/${gymId}/instructors/${instructorId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async getGymsByOwner() {
    const response = await fetch(`${this.baseURL}/gyms/owner/gyms`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async getFreelanceInstructors() {
    const response = await fetch(`${this.baseURL}/instructors/freelance`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async registerGymInstructor(instructorData) {
    // Check if instructorData is FormData (for file uploads)
    const isFormData = instructorData instanceof FormData;
    
    const response = await fetch(`${this.baseURL}/gyms/register-instructor`, {
      method: 'POST',
      headers: this.getHeaders(isFormData),
      credentials: 'include',
      body: isFormData ? instructorData : JSON.stringify(instructorData)
    });
    
    return this.handleResponse(response);
  }

  // Collaboration Request endpoints
  async sendCollaborationRequest(instructorId, message, gymId) {
    const response = await fetch(`${this.baseURL}/collaborations/send`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ instructorId, message, gymId })
    });
    
    return this.handleResponse(response);
  }

  async getGymOwnerCollaborationRequests(status = null, gymId = null) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (gymId) params.append('gymId', gymId);
    
    const response = await fetch(`${this.baseURL}/collaborations/gym-owner?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async getInstructorCollaborationRequests(status = null) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    
    const response = await fetch(`${this.baseURL}/collaborations/instructor?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async respondToCollaborationRequest(requestId, action, responseMessage = '') {
    const response = await fetch(`${this.baseURL}/collaborations/${requestId}/respond`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ action, responseMessage })
    });
    
    return this.handleResponse(response);
  }

  async cancelCollaborationRequest(requestId) {
    const response = await fetch(`${this.baseURL}/collaborations/${requestId}/cancel`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }
}

// Create and export a single instance
const api = new ApiService();
export default api;