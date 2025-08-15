// src/components/common/Notification.jsx
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import PropTypes from 'prop-types';

const Notification = ({ 
  message, 
  type = 'success', 
  isVisible = false, 
  onClose, 
  duration = 4000,
  position = 'top-right'
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-green-500';
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed z-50 ${getPositionStyles()} max-w-sm w-full`}
        >
          <div className={`rounded-lg border p-4 shadow-lg ${getStyles()}`}>
            <div className="flex items-start">
              <div className={`flex-shrink-0 ${getIconColor()}`}>
                {getIcon()}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{message}</p>
              </div>
              {onClose && (
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={onClose}
                    className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      type === 'success' 
                        ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' 
                        : type === 'error'
                        ? 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                        : type === 'warning'
                        ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600'
                        : 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
                    }`}
                  >
                    <span className="sr-only">Dismiss</span>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  isVisible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
  position: PropTypes.oneOf([
    'top-left', 
    'top-center', 
    'top-right', 
    'bottom-left', 
    'bottom-center', 
    'bottom-right'
  ]),
};

export default Notification;
