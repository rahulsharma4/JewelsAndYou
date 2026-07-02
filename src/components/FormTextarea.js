import React, { useState, useEffect } from 'react';
import { validateField } from '../utils/validation';

const FormTextarea = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  validation = [],
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  errorClassName = '',
  showError = true,
  ...props
}) => {
  const [errors, setErrors] = useState([]);
  const [touched, setTouched] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Validate field when value changes
  useEffect(() => {
    if (validation.length > 0 && (touched || value)) {
      setIsValidating(true);
      const { isValid, errors: fieldErrors } = validateField(name, value, validation);
      setErrors(fieldErrors);
      setIsValidating(false);
    }
  }, [value, validation, name, touched]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange?.(e);
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleBlur = (e) => {
    setTouched(true);
    onBlur?.(e);
  };

  const handleFocus = () => {
    setTouched(true);
  };

  const hasError = errors.length > 0 && touched;
  const textareaId = `textarea-${name}`;

  const baseTextareaClasses = `
    w-full rounded border px-3 py-2 transition-colors resize-vertical
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}
    ${hasError 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : 'border-brand-off/30 focus:border-brand-gold focus:ring-brand-gold'
    }
    focus:outline-none focus:ring-2
    ${className}
  `.trim();

  const errorClasses = `
    text-red-500 text-sm mt-1
    ${errorClassName}
  `.trim();

  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={textareaId}
          className={`block font-semibold ${required ? 'after:content-["*"] after:text-red-500 after:ml-1' : ''}`}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <textarea
          id={textareaId}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          required={required}
          rows={rows}
          className={baseTextareaClasses}
          {...props}
        />
        
        {isValidating && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-gold border-t-transparent"></div>
          </div>
        )}
      </div>

      {showError && hasError && (
        <div className={errorClasses}>
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormTextarea;

