import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAlert } from './AlertContext';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { showSuccess, showError } = useAlert();

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        // Optionally verify token with backend
        try {
          const response = await api.getMe();
          setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
        } catch (error) {
          // Token might be expired
          console.error('Token verification failed:', error);
          logout();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.register(userData);
      setUser(response.user);
      
      // Show success alert
      showSuccess(`Welcome ${response.user.firstName}! Your account has been created successfully.`);
      
      // Redirect based on role
      redirectBasedOnRole(response.user.role);
      
      return response;
    } catch (error) {
      setError(error.message);
      showError(error.message || 'Registration failed. Please try again.');
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await api.login(credentials);
      setUser(response.user);
      
      // Show success alert
      showSuccess(`Welcome back, ${response.user.firstName}!`);
      
      // Redirect based on role
      redirectBasedOnRole(response.user.role);
      
      return response;
    } catch (error) {
      setError(error.message);
      showError(error.message || 'Login failed. Please check your credentials.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      showSuccess('You have been logged out successfully.');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const redirectBasedOnRole = (role) => {
    switch (role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'gymOwner':
        navigate('/gym-owner');
        break;
      case 'instructor':
        navigate('/instructor');
        break;
      case 'customer':
        navigate('/profile');
        break;
      default:
        navigate('/');
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isGymOwner: user?.role === 'gymOwner',
    isInstructor: user?.role === 'instructor',
    isCustomer: user?.role === 'customer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};