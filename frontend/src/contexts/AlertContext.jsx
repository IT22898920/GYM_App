import React, { createContext, useContext, useState } from 'react';
import Alert from '../components/Alert';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, type = 'info', options = {}) => {
    const id = Date.now() + Math.random();
    const alert = {
      id,
      message,
      type,
      isVisible: true,
      ...options
    };

    setAlerts(prev => [...prev, alert]);

    // Auto remove after duration
    const duration = options.duration || 4000;
    if (options.autoClose !== false) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }

    return id;
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  // Convenience methods
  const showSuccess = (message, options = {}) => {
    return showAlert(message, 'success', options);
  };

  const showError = (message, options = {}) => {
    return showAlert(message, 'error', options);
  };

  const showWarning = (message, options = {}) => {
    return showAlert(message, 'warning', options);
  };

  const showInfo = (message, options = {}) => {
    return showAlert(message, 'info', options);
  };

  const value = {
    alerts,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeAlert,
    clearAllAlerts
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      
      {/* Render alerts */}
      {alerts.map((alert, index) => (
        <Alert
          key={alert.id}
          type={alert.type}
          message={alert.message}
          isVisible={alert.isVisible}
          onClose={() => removeAlert(alert.id)}
          position={alert.position || 'top-right'}
          autoClose={alert.autoClose}
          duration={alert.duration}
        />
      ))}
    </AlertContext.Provider>
  );
};