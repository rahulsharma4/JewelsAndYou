// Comprehensive validation utilities for the frontend

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (supports various formats)
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

// Password strength validation
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

// Name validation (letters, spaces, hyphens, apostrophes)
const NAME_REGEX = /^[a-zA-Z\s\-']+$/;

// ZIP code validation (supports various formats)
const ZIP_REGEX = /^[0-9]{5}(-[0-9]{4})?$/;

// Price validation (positive numbers with up to 2 decimal places)
const PRICE_REGEX = /^\d+(\.\d{1,2})?$/;

// Validation error messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  password: 'Password must be at least 6 characters long',
  passwordStrong: 'Password must contain at least 8 characters with uppercase, lowercase, number, and special character',
  passwordMatch: 'Passwords do not match',
  name: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  zip: 'Please enter a valid ZIP code',
  price: 'Please enter a valid price',
  minLength: (min) => `Must be at least ${min} characters long`,
  maxLength: (max) => `Must be no more than ${max} characters long`,
  min: (min) => `Must be at least ${min}`,
  max: (max) => `Must be no more than ${max}`,
  positive: 'Must be a positive number',
  integer: 'Must be a whole number',
  url: 'Please enter a valid URL',
  image: 'Please select a valid image file',
  fileSize: (maxSize) => `File size must be less than ${maxSize}MB`,
  fileType: (types) => `File must be one of: ${types.join(', ')}`
};

// Validation functions
export const validators = {
  // Required field validation
  required: (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined && value !== '';
  },

  // Email validation
  email: (value) => {
    if (!value) return true; // Allow empty if not required
    return EMAIL_REGEX.test(value);
  },

  // Phone validation
  phone: (value) => {
    if (!value) return true; // Allow empty if not required
    return PHONE_REGEX.test(value.replace(/[\s\-\(\)]/g, ''));
  },

  // Password validation
  password: (value) => {
    if (!value) return true; // Allow empty if not required
    return value.length >= 6;
  },

  // Strong password validation
  passwordStrong: (value) => {
    if (!value) return true; // Allow empty if not required
    return value.length >= 8 && PASSWORD_REGEX.test(value);
  },

  // Password confirmation validation
  passwordMatch: (value, confirmValue) => {
    if (!value || !confirmValue) return true; // Allow empty if not required
    return value === confirmValue;
  },

  // Name validation
  name: (value) => {
    if (!value) return true; // Allow empty if not required
    return NAME_REGEX.test(value) && value.trim().length >= 2;
  },

  // ZIP code validation
  zip: (value) => {
    if (!value) return true; // Allow empty if not required
    return ZIP_REGEX.test(value);
  },

  // Price validation
  price: (value) => {
    if (!value) return true; // Allow empty if not required
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue >= 0 && PRICE_REGEX.test(value);
  },

  // Number validation
  number: (value) => {
    if (!value) return true; // Allow empty if not required
    return !isNaN(parseFloat(value));
  },

  // Integer validation
  integer: (value) => {
    if (!value) return true; // Allow empty if not required
    return Number.isInteger(parseFloat(value));
  },

  // Positive number validation
  positive: (value) => {
    if (!value) return true; // Allow empty if not required
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue > 0;
  },

  // Minimum length validation
  minLength: (min) => (value) => {
    if (!value) return true; // Allow empty if not required
    return value.length >= min;
  },

  // Maximum length validation
  maxLength: (max) => (value) => {
    if (!value) return true; // Allow empty if not required
    return value.length <= max;
  },

  // Minimum value validation
  min: (min) => (value) => {
    if (!value) return true; // Allow empty if not required
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue >= min;
  },

  // Maximum value validation
  max: (max) => (value) => {
    if (!value) return true; // Allow empty if not required
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue <= max;
  },

  // URL validation
  url: (value) => {
    if (!value) return true; // Allow empty if not required
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  // Image file validation
  image: (file) => {
    if (!file) return true; // Allow empty if not required
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    return validTypes.includes(file.type);
  },

  // File size validation
  fileSize: (maxSizeMB) => (file) => {
    if (!file) return true; // Allow empty if not required
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },

  // File type validation
  fileType: (allowedTypes) => (file) => {
    if (!file) return true; // Allow empty if not required
    return allowedTypes.includes(file.type);
  }
};

// Form validation class
export class FormValidator {
  constructor(rules = {}) {
    this.rules = rules;
    this.errors = {};
  }

  // Validate a single field
  validateField(fieldName, value, formData = {}) {
    const fieldRules = this.rules[fieldName] || [];
    const errors = [];

    for (const rule of fieldRules) {
      if (typeof rule === 'string') {
        // Simple rule like 'required', 'email'
        if (!validators[rule](value)) {
          errors.push(VALIDATION_MESSAGES[rule]);
        }
      } else if (typeof rule === 'function') {
        // Custom validation function
        const result = rule(value, formData);
        if (result !== true) {
          errors.push(result || 'Invalid value');
        }
      } else if (rule.validator) {
        // Rule object with validator and message
        if (!rule.validator(value, formData)) {
          errors.push(rule.message);
        }
      }
    }

    this.errors[fieldName] = errors;
    return errors.length === 0;
  }

  // Validate entire form
  validateForm(formData) {
    let isValid = true;
    this.errors = {};

    for (const fieldName in this.rules) {
      const fieldValid = this.validateField(fieldName, formData[fieldName], formData);
      if (!fieldValid) {
        isValid = false;
      }
    }

    return isValid;
  }

  // Get errors for a specific field
  getFieldErrors(fieldName) {
    return this.errors[fieldName] || [];
  }

  // Get all errors
  getAllErrors() {
    return this.errors;
  }

  // Check if form has errors
  hasErrors() {
    return Object.keys(this.errors).some(field => this.errors[field].length > 0);
  }

  // Clear errors for a field
  clearFieldErrors(fieldName) {
    delete this.errors[fieldName];
  }

  // Clear all errors
  clearAllErrors() {
    this.errors = {};
  }
}

// Predefined validation rules for common forms
export const validationRules = {
  // User registration form
  registration: {
    name: ['required', 'name', { validator: validators.minLength(2), message: 'Name must be at least 2 characters' }],
    email: ['required', 'email'],
    password: ['required', 'password'],
    confirmPassword: ['required', { validator: (value, formData) => validators.passwordMatch(value, formData.password), message: VALIDATION_MESSAGES.passwordMatch }]
  },

  // User login form
  login: {
    email: ['required', 'email'],
    password: ['required']
  },

  // Profile update form
  profile: {
    name: ['required', 'name', { validator: validators.minLength(2), message: 'Name must be at least 2 characters' }],
    email: ['required', 'email']
  },

  // Contact form
  contact: {
    name: ['required', 'name', { validator: validators.minLength(2), message: 'Name must be at least 2 characters' }],
    email: ['required', 'email'],
    phone: ['phone'],
    subject: ['required', { validator: validators.minLength(5), message: 'Subject must be at least 5 characters' }],
    message: ['required', { validator: validators.minLength(10), message: 'Message must be at least 10 characters' }]
  },

  // Checkout address form
  address: {
    name: ['required', 'name', { validator: validators.minLength(2), message: 'Name must be at least 2 characters' }],
    address: ['required', { validator: validators.minLength(10), message: 'Address must be at least 10 characters' }],
    city: ['required', 'name', { validator: validators.minLength(2), message: 'City must be at least 2 characters' }],
    country: ['required', 'name', { validator: validators.minLength(2), message: 'Country must be at least 2 characters' }],
    zip: ['required', 'zip']
  },

  // Product form (admin)
  product: {
    name: ['required', { validator: validators.minLength(3), message: 'Product name must be at least 3 characters' }],
    price: ['required', 'price', 'positive'],
    description: ['required', { validator: validators.minLength(10), message: 'Description must be at least 10 characters' }],
    category: ['required'],
    stock: ['required', 'integer', 'positive'],
    image: [{ validator: validators.image, message: VALIDATION_MESSAGES.image }]
  },

  // Password reset form
  passwordReset: {
    password: ['required', 'password'],
    confirmPassword: ['required', { validator: (value, formData) => validators.passwordMatch(value, formData.password), message: VALIDATION_MESSAGES.passwordMatch }]
  },

  // Forgot password form
  forgotPassword: {
    email: ['required', 'email']
  }
};

// Utility function to create a validator instance
export const createValidator = (rules) => new FormValidator(rules);

// Utility function to validate a single field
export const validateField = (fieldName, value, rules, formData = {}) => {
  const validator = new FormValidator({ [fieldName]: rules });
  validator.validateField(fieldName, value, formData);
  return {
    isValid: validator.getFieldErrors(fieldName).length === 0,
    errors: validator.getFieldErrors(fieldName)
  };
};

// Utility function to format validation errors for display
export const formatErrors = (errors) => {
  if (Array.isArray(errors)) {
    return errors.join(', ');
  }
  return errors;
};

// Utility function to check if a value is empty
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// Utility function to sanitize input
export const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/[<>]/g, '');
};

export default {
  validators,
  VALIDATION_MESSAGES,
  FormValidator,
  validationRules,
  createValidator,
  validateField,
  formatErrors,
  isEmpty,
  sanitizeInput
};

