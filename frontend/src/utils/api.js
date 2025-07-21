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
}

// Create and export a single instance
const api = new ApiService();
export default api;