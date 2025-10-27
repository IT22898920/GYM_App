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
      console.log('🔑 Token found for API call:', token.substring(0, 20) + '...');
    } else {
      console.log('❌ No token found in localStorage');
    }
    
    return headers;
  }

  // Generic HTTP methods
  async get(url, config = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
      ...config
    });
    
    return this.handleResponse(response);
  }

  async post(url, data = null, config = {}) {
    const isFormData = data instanceof FormData;
    
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'POST',
      headers: this.getHeaders(isFormData),
      credentials: 'include',
      body: data ? (isFormData ? data : JSON.stringify(data)) : null,
      ...config
    });
    
    return this.handleResponse(response);
  }

  async put(url, data = null, config = {}) {
    const isFormData = data instanceof FormData;
    
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'PUT',
      headers: this.getHeaders(isFormData),
      credentials: 'include',
      body: data ? (isFormData ? data : JSON.stringify(data)) : null,
      ...config
    });
    
    return this.handleResponse(response);
  }

  async delete(url, config = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
      ...config
    });
    
    return this.handleResponse(response);
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

  async updateGymInstructor(gymId, instructorId, instructorData) {
    const response = await fetch(`${this.baseURL}/gyms/${gymId}/instructors/${instructorId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(instructorData)
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

  async getAllGyms(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/gyms?${queryParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async getFreelanceInstructors(gymId = null) {
    let url = `${this.baseURL}/instructors/freelance`;
    if (gymId) {
      url += `?gymId=${gymId}`;
    }
    
    const response = await fetch(url, {
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

  // Create member-instructor chat collaboration
  async createMemberInstructorChat(instructorId) {
    const response = await fetch(`${this.baseURL}/collaborations/member-instructor`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ instructorId })
    });
    
    return this.handleResponse(response);
  }

  // Member endpoints
  async searchExistingUsers(searchTerm, searchType) {
    const params = new URLSearchParams({
      searchTerm,
      searchType
    });

    const response = await fetch(`${this.baseURL}/members/search-users?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async addExistingUserAsMember(memberData) {
    const response = await fetch(`${this.baseURL}/members/add-existing`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(memberData)
    });
    
    return this.handleResponse(response);
  }

  // Notification endpoints
  async getNotifications(page = 1, limit = 20, unreadOnly = false) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      unreadOnly: unreadOnly.toString()
    });

    const response = await fetch(`${this.baseURL}/notifications?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async getUnreadNotificationCount() {
    const response = await fetch(`${this.baseURL}/notifications/unread-count`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async markNotificationAsRead(notificationId) {
    const response = await fetch(`${this.baseURL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async markAllNotificationsAsRead() {
    const response = await fetch(`${this.baseURL}/notifications/mark-all-read`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async deleteNotification(notificationId) {
    const response = await fetch(`${this.baseURL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async deleteAllReadNotifications() {
    const response = await fetch(`${this.baseURL}/notifications/clear/read`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async sendSystemAnnouncement(title, message, recipients = null, priority = 'medium') {
    const response = await fetch(`${this.baseURL}/notifications/system-announcement`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ title, message, recipients, priority })
    });
    
    return this.handleResponse(response);
  }

  // Gym Request endpoints (instructor to gym)
  async sendGymRequest(gymId, message) {
    const response = await fetch(`${this.baseURL}/gym-requests/send`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ gymId, message })
    });
    
    return this.handleResponse(response);
  }

  async getInstructorGymRequests(status = null) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    
    const response = await fetch(`${this.baseURL}/gym-requests/my-requests?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async getGymRequests(status = null, gymId = null) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (gymId) params.append('gymId', gymId);
    
    const response = await fetch(`${this.baseURL}/gym-requests?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async approveGymRequest(requestId, responseMessage = '') {
    const response = await fetch(`${this.baseURL}/gym-requests/approve/${requestId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ responseMessage })
    });
    
    return this.handleResponse(response);
  }

  async rejectGymRequest(requestId, responseMessage = '') {
    const response = await fetch(`${this.baseURL}/gym-requests/reject/${requestId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ responseMessage })
    });
    
    return this.handleResponse(response);
  }

  async cancelGymRequest(requestId) {
    const response = await fetch(`${this.baseURL}/gym-requests/cancel/${requestId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  // Chat endpoints
  async getUserChats() {
    const response = await fetch(`${this.baseURL}/chats`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async getOrCreateChat(collaborationId) {
    const response = await fetch(`${this.baseURL}/chats/collaboration/${collaborationId}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async sendChatMessage(chatId, content) {
    const response = await fetch(`${this.baseURL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ content })
    });
    
    return this.handleResponse(response);
  }

  async markChatAsRead(chatId) {
    const response = await fetch(`${this.baseURL}/chats/${chatId}/read`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async getChatUnreadCount() {
    const response = await fetch(`${this.baseURL}/chats/unread-count`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  // Call endpoints
  async initiateCall(chatId, callType) {
    const response = await fetch(`${this.baseURL}/calls/initiate`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ chatId, callType })
    });
    
    return this.handleResponse(response);
  }

  async acceptCall(callId) {
    const response = await fetch(`${this.baseURL}/calls/${callId}/accept`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async rejectCall(callId) {
    const response = await fetch(`${this.baseURL}/calls/${callId}/reject`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async endCall(callId) {
    const response = await fetch(`${this.baseURL}/calls/${callId}/end`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async getCallHistory(page = 1, limit = 20) {
    const response = await fetch(`${this.baseURL}/calls/history?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  // Member Management endpoints
  async assignInstructorToMember(memberId, instructorId) {
    const response = await fetch(`${this.baseURL}/members/${memberId}/assign-instructor`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ instructorId })
    });
    
    return this.handleResponse(response);
  }

  async searchExistingUsers(search, type = 'email') {
    const response = await fetch(`${this.baseURL}/members/search-users?search=${encodeURIComponent(search)}&type=${type}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async addExistingUserAsMember(memberData) {
    const response = await fetch(`${this.baseURL}/members/add-existing`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(memberData)
    });
    
    return this.handleResponse(response);
  }

  // Customer Profile endpoints
  async getMyProfile() {
    const response = await fetch(`${this.baseURL}/members/my-profile`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async getMyWorkoutPlans() {
    const response = await fetch(`${this.baseURL}/members/my-workout-plans`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async updateWorkoutStatus(workoutPlanId, dayIndex, exerciseIndex, workoutStatus) {
    const response = await fetch(`${this.baseURL}/members/update-workout-status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        workoutPlanId,
        dayIndex,
        exerciseIndex,
        workoutStatus
      })
    });
    
    return this.handleResponse(response);
  }

  async addMemberNote(workoutPlanId, dayIndex, exerciseIndex, note) {
    const response = await fetch(`${this.baseURL}/members/add-member-note`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        workoutPlanId,
        dayIndex,
        exerciseIndex,
        note
      })
    });
    
    return this.handleResponse(response);
  }

  async deleteMemberNote(workoutPlanId, dayIndex, exerciseIndex, noteIndex) {
    const response = await fetch(`${this.baseURL}/members/delete-member-note`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        workoutPlanId,
        dayIndex,
        exerciseIndex,
        noteIndex
      })
    });
    
    return this.handleResponse(response);
  }

  async getInstructorWorkoutPlans() {
    const response = await fetch(`${this.baseURL}/instructors/workout-plans`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  // Class management methods
  async createClass(classData) {
    const response = await fetch(`${this.baseURL}/classes`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(classData),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async getInstructorClasses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString 
      ? `${this.baseURL}/classes?${queryString}`
      : `${this.baseURL}/classes`;
      
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async getClassById(classId) {
    const response = await fetch(`${this.baseURL}/classes/${classId}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async updateClass(classId, classData) {
    const response = await fetch(`${this.baseURL}/classes/${classId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(classData),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async deleteClass(classId) {
    const response = await fetch(`${this.baseURL}/classes/${classId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async addMemberToClass(classId, memberId) {
    const response = await fetch(`${this.baseURL}/classes/${classId}/members`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ memberId }),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async removeMemberFromClass(classId, memberId) {
    const response = await fetch(`${this.baseURL}/classes/${classId}/members/${memberId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async getClassEligibleMembers() {
    const response = await fetch(`${this.baseURL}/classes/eligible-members`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  // Get instructor's assigned members (for GymStudents page)
  async getInstructorAssignedMembers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString 
      ? `${this.baseURL}/instructors/assigned-members?${queryString}`
      : `${this.baseURL}/instructors/assigned-members`;
      
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }
}

// Create and export a single instance
const api = new ApiService();
export default api;