import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { errorHandler, formatErrorForDisplay } from '../utils/errorHandler';

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Notification context
const NotificationContext = createContext();

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: NOTIFICATION_TYPES.INFO,
      title: '',
      message: '',
      duration: 5000,
      persistent: false,
      actions: [],
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration (unless persistent)
    if (!newNotification.persistent && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Show success notification
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      title: 'Success',
      message,
      ...options
    });
  }, [addNotification]);

  // Show error notification
  const showError = useCallback((error, options = {}) => {
    const formattedError = formatErrorForDisplay(error);
    
    return addNotification({
      type: NOTIFICATION_TYPES.ERROR,
      title: 'Error',
      message: formattedError.message,
      persistent: formattedError.isCritical,
      duration: formattedError.isCritical ? 0 : 8000,
      ...options
    });
  }, [addNotification]);

  // Show warning notification
  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      title: 'Warning',
      message,
      ...options
    });
  }, [addNotification]);

  // Show info notification
  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.INFO,
      title: 'Info',
      message,
      ...options
    });
  }, [addNotification]);

  // Handle API errors
  const handleApiError = useCallback((error, context = '') => {
    const handledError = errorHandler.handleApiError(error, context);
    showError(handledError);
    return handledError;
  }, [showError]);

  // Handle validation errors
  const handleValidationError = useCallback((field, message) => {
    const error = errorHandler.handleValidationError(field, message);
    showError(error);
    return error;
  }, [showError]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    handleApiError,
    handleValidationError
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Individual notification component
const Notification = ({ notification, onRemove }) => {
  const { id, type, title, message, persistent, actions } = notification;

  const getNotificationStyles = () => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-400',
          iconBg: 'bg-green-100'
        };
      case NOTIFICATION_TYPES.ERROR:
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-400',
          iconBg: 'bg-red-100'
        };
      case NOTIFICATION_TYPES.WARNING:
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-400',
          iconBg: 'bg-yellow-100'
        };
      case NOTIFICATION_TYPES.INFO:
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-400',
          iconBg: 'bg-blue-100'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case NOTIFICATION_TYPES.ERROR:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case NOTIFICATION_TYPES.WARNING:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.726-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case NOTIFICATION_TYPES.INFO:
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const styles = getNotificationStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`max-w-sm w-full ${styles.bg} ${styles.border} border rounded-lg shadow-lg pointer-events-auto`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${styles.iconBg} rounded-full p-1`}>
            <div className={styles.icon}>
              {getIcon()}
            </div>
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className={`text-sm font-medium ${styles.text}`}>
                {title}
              </p>
            )}
            <p className={`text-sm ${styles.text} ${title ? 'mt-1' : ''}`}>
              {message}
            </p>
            {actions && actions.length > 0 && (
              <div className="mt-2 flex space-x-2">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`text-sm font-medium ${styles.text} hover:underline`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onRemove(id)}
              className={`${styles.text} hover:opacity-75 focus:outline-none`}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Notification container component
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationProvider;
