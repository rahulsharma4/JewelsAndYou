// Comprehensive error handling utilities for the frontend

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  API: 'API_ERROR'
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Error messages for different scenarios
export const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  OFFLINE_ERROR: 'You are currently offline. Please check your internet connection.',
  
  // Authentication errors
  INVALID_CREDENTIALS: 'Invalid email or password.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  ACCOUNT_SUSPENDED: 'Your account has been suspended. Please contact support.',
  
  // Validation errors
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  
  // Server errors
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  MAINTENANCE: 'The service is temporarily under maintenance. Please try again later.',
  RATE_LIMITED: 'Too many requests. Please wait a moment before trying again.',
  
  // API errors
  API_ERROR: 'Failed to process your request. Please try again.',
  INVALID_REQUEST: 'Invalid request. Please check your input.',
  RESOURCE_NOT_FOUND: 'The requested resource was not found.',
  
  // File upload errors
  FILE_TOO_LARGE: 'File size is too large. Please choose a smaller file.',
  INVALID_FILE_TYPE: 'Invalid file type. Please choose a valid image file.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  
  // Payment errors
  PAYMENT_FAILED: 'Payment processing failed. Please try again.',
  INVALID_CARD: 'Invalid card information. Please check your details.',
  INSUFFICIENT_FUNDS: 'Insufficient funds. Please use a different payment method.',
  
  // Cart errors
  CART_EMPTY: 'Your cart is empty. Add some items to continue.',
  OUT_OF_STOCK: 'This item is currently out of stock.',
  QUANTITY_EXCEEDED: 'Requested quantity exceeds available stock.',
  
  // Order errors
  ORDER_FAILED: 'Failed to create order. Please try again.',
  INVALID_ORDER: 'Invalid order. Please refresh and try again.',
  
  // Generic errors
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  LOADING_ERROR: 'Failed to load data. Please refresh the page.',
  SAVE_ERROR: 'Failed to save changes. Please try again.',
  DELETE_ERROR: 'Failed to delete item. Please try again.'
};

// Error handler class
export class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
  }

  // Create a standardized error object
  createError(type, message, details = {}, severity = ERROR_SEVERITY.MEDIUM) {
    const error = {
      id: Date.now() + Math.random(),
      type,
      message,
      details,
      severity,
      timestamp: new Date().toISOString(),
      stack: new Error().stack
    };

    this.logError(error);
    return error;
  }

  // Log error to console and internal log
  logError(error) {
    console.error('Error:', error);
    this.errorLog.push(error);
    
    // Keep only the last maxLogSize errors
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }
  }

  // Handle API errors
  handleApiError(error, context = '') {
    console.error(`API Error in ${context}:`, error);

    if (!error.response) {
      // Network error
      return this.createError(
        ERROR_TYPES.NETWORK,
        ERROR_MESSAGES.NETWORK_ERROR,
        { context, originalError: error.message },
        ERROR_SEVERITY.HIGH
      );
    }

    const { status, data } = error.response;
    let errorType = ERROR_TYPES.API;
    let message = ERROR_MESSAGES.API_ERROR;
    let severity = ERROR_SEVERITY.MEDIUM;

    switch (status) {
      case 400:
        errorType = ERROR_TYPES.VALIDATION;
        message = data.message || ERROR_MESSAGES.INVALID_REQUEST;
        severity = ERROR_SEVERITY.LOW;
        break;
      case 401:
        errorType = ERROR_TYPES.AUTHENTICATION;
        message = data.message || ERROR_MESSAGES.INVALID_CREDENTIALS;
        severity = ERROR_SEVERITY.MEDIUM;
        break;
      case 403:
        errorType = ERROR_TYPES.AUTHORIZATION;
        message = data.message || ERROR_MESSAGES.UNAUTHORIZED;
        severity = ERROR_SEVERITY.MEDIUM;
        break;
      case 404:
        errorType = ERROR_TYPES.NOT_FOUND;
        message = data.message || ERROR_MESSAGES.RESOURCE_NOT_FOUND;
        severity = ERROR_SEVERITY.LOW;
        break;
      case 429:
        errorType = ERROR_TYPES.API;
        message = ERROR_MESSAGES.RATE_LIMITED;
        severity = ERROR_SEVERITY.MEDIUM;
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        errorType = ERROR_TYPES.SERVER;
        message = ERROR_MESSAGES.SERVER_ERROR;
        severity = ERROR_SEVERITY.HIGH;
        break;
      default:
        message = data.message || ERROR_MESSAGES.UNKNOWN_ERROR;
    }

    return this.createError(
      errorType,
      message,
      { 
        context, 
        status, 
        originalError: data,
        url: error.config?.url 
      },
      severity
    );
  }

  // Handle validation errors
  handleValidationError(field, message, value) {
    return this.createError(
      ERROR_TYPES.VALIDATION,
      message,
      { field, value },
      ERROR_SEVERITY.LOW
    );
  }

  // Handle network errors
  handleNetworkError(error, context = '') {
    if (!navigator.onLine) {
      return this.createError(
        ERROR_TYPES.NETWORK,
        ERROR_MESSAGES.OFFLINE_ERROR,
        { context },
        ERROR_SEVERITY.HIGH
      );
    }

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return this.createError(
        ERROR_TYPES.TIMEOUT,
        ERROR_MESSAGES.TIMEOUT_ERROR,
        { context, originalError: error.message },
        ERROR_SEVERITY.MEDIUM
      );
    }

    return this.createError(
      ERROR_TYPES.NETWORK,
      ERROR_MESSAGES.NETWORK_ERROR,
      { context, originalError: error.message },
      ERROR_SEVERITY.HIGH
    );
  }

  // Handle file upload errors
  handleFileUploadError(error, file) {
    if (error.code === 'FILE_TOO_LARGE') {
      return this.createError(
        ERROR_TYPES.VALIDATION,
        ERROR_MESSAGES.FILE_TOO_LARGE,
        { fileName: file.name, fileSize: file.size },
        ERROR_SEVERITY.LOW
      );
    }

    if (error.code === 'INVALID_FILE_TYPE') {
      return this.createError(
        ERROR_TYPES.VALIDATION,
        ERROR_MESSAGES.INVALID_FILE_TYPE,
        { fileName: file.name, fileType: file.type },
        ERROR_SEVERITY.LOW
      );
    }

    return this.createError(
      ERROR_TYPES.API,
      ERROR_MESSAGES.UPLOAD_FAILED,
      { fileName: file.name, originalError: error.message },
      ERROR_SEVERITY.MEDIUM
    );
  }

  // Handle payment errors
  handlePaymentError(error, context = '') {
    let message = ERROR_MESSAGES.PAYMENT_FAILED;
    let severity = ERROR_SEVERITY.HIGH;

    if (error.type === 'card_error') {
      switch (error.code) {
        case 'card_declined':
          message = 'Your card was declined. Please try a different payment method.';
          break;
        case 'expired_card':
          message = 'Your card has expired. Please use a different payment method.';
          break;
        case 'incorrect_cvc':
          message = 'Your card\'s security code is incorrect. Please try again.';
          break;
        case 'insufficient_funds':
          message = ERROR_MESSAGES.INSUFFICIENT_FUNDS;
          break;
        default:
          message = ERROR_MESSAGES.INVALID_CARD;
      }
    }

    return this.createError(
      ERROR_TYPES.API,
      message,
      { context, originalError: error },
      severity
    );
  }

  // Get user-friendly error message
  getUserFriendlyMessage(error) {
    if (typeof error === 'string') {
      return error;
    }

    if (error.message) {
      return error.message;
    }

    if (error.type && ERROR_MESSAGES[error.type]) {
      return ERROR_MESSAGES[error.type];
    }

    return ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  // Check if error is critical
  isCriticalError(error) {
    return error.severity === ERROR_SEVERITY.CRITICAL || 
           error.severity === ERROR_SEVERITY.HIGH;
  }

  // Get error log
  getErrorLog() {
    return [...this.errorLog];
  }

  // Clear error log
  clearErrorLog() {
    this.errorLog = [];
  }

  // Get errors by type
  getErrorsByType(type) {
    return this.errorLog.filter(error => error.type === type);
  }

  // Get errors by severity
  getErrorsBySeverity(severity) {
    return this.errorLog.filter(error => error.severity === severity);
  }
}

// Create global error handler instance
export const errorHandler = new ErrorHandler();

// Error boundary component props
export const getErrorBoundaryProps = (error, errorInfo) => ({
  error,
  errorInfo,
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent,
  url: window.location.href
});

// Utility function to handle async operations with error handling
export const withErrorHandling = async (asyncFn, context = '', options = {}) => {
  try {
    return await asyncFn();
  } catch (error) {
    const handledError = errorHandler.handleApiError(error, context);
    
    if (options.throw) {
      throw handledError;
    }
    
    return { error: handledError, success: false };
  }
};

// Utility function to retry operations with exponential backoff
export const withRetry = async (asyncFn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await asyncFn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw errorHandler.handleApiError(error, `Retry attempt ${attempt}`);
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError;
};

// Utility function to check if error is retryable
export const isRetryableError = (error) => {
  if (!error.response) return true; // Network errors are retryable
  
  const status = error.response.status;
  return status >= 500 || status === 429; // Server errors and rate limits
};

// Utility function to format error for display
export const formatErrorForDisplay = (error) => {
  const message = errorHandler.getUserFriendlyMessage(error);
  const isCritical = errorHandler.isCriticalError(error);
  
  return {
    message,
    isCritical,
    type: error.type || ERROR_TYPES.UNKNOWN,
    severity: error.severity || ERROR_SEVERITY.MEDIUM,
    timestamp: error.timestamp || new Date().toISOString()
  };
};

export default errorHandler;

