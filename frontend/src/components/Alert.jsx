import { useState, useEffect } from 'react';
import { FiX, FiCheck, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const Alert = ({ 
  type = 'info', 
  message, 
  isVisible = false, 
  onClose, 
  autoClose = true, 
  duration = 4000,
  position = 'top-right' 
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, autoClose, duration, onClose]);

  const getAlertStyles = () => {
    const baseStyles = "fixed z-50 p-4 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-500 transform max-w-md";
    
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };

    const typeStyles = {
      success: 'bg-green-900/90 border-green-500/50 text-green-100',
      error: 'bg-red-900/90 border-red-500/50 text-red-100',
      warning: 'bg-yellow-900/90 border-yellow-500/50 text-yellow-100',
      info: 'bg-blue-900/90 border-blue-500/50 text-blue-100'
    };

    const showHideStyles = show 
      ? 'opacity-100 translate-y-0 scale-100' 
      : 'opacity-0 translate-y-2 scale-95 pointer-events-none';

    return `${baseStyles} ${positions[position]} ${typeStyles[type]} ${showHideStyles}`;
  };

  const getIcon = () => {
    const iconStyles = "w-5 h-5 flex-shrink-0";
    
    switch (type) {
      case 'success':
        return <FiCheck className={`${iconStyles} text-green-400`} />;
      case 'error':
        return <FiAlertCircle className={`${iconStyles} text-red-400`} />;
      case 'warning':
        return <FiAlertTriangle className={`${iconStyles} text-yellow-400`} />;
      case 'info':
      default:
        return <FiInfo className={`${iconStyles} text-blue-400`} />;
    }
  };

  const getProgressBarColor = () => {
    switch (type) {
      case 'success': return 'bg-green-400';
      case 'error': return 'bg-red-400';
      case 'warning': return 'bg-yellow-400';
      case 'info': 
      default: return 'bg-blue-400';
    }
  };

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };

  if (!message) return null;

  return (
    <div className={getAlertStyles()}>
      {/* Progress bar */}
      {autoClose && show && (
        <div className="absolute bottom-0 left-0 h-1 bg-white/20 rounded-b-lg overflow-hidden">
          <div 
            className={`h-full ${getProgressBarColor()} animate-[shrink_${duration}ms_linear_forwards]`}
            style={{
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      )}

      <div className="flex items-start space-x-3">
        {getIcon()}
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed">
            {message}
          </p>
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
          aria-label="Close alert"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Alert;