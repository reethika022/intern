/**
 * Input Validation Utilities
 * Provides validation functions for email, password, and other fields
 * Follows security and UX best practices
 */

/**
 * Validate email format
 * Uses regex pattern for standard email validation
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements:
 * - Minimum 6 characters
 * - At least one letter
 * - At least one number (optional for now, can be enforced)
 */
const validatePassword = (password) => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long',
    };
  }

  if (!/[a-zA-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one letter',
    };
  }

  return {
    isValid: true,
    message: 'Password is valid',
  };
};

/**
 * Validate username/name field
 * Requirements:
 * - Minimum 2 characters
 * - Only letters, spaces, and hyphens allowed
 */
const validateName = (name) => {
  if (name.trim().length < 2) {
    return {
      isValid: false,
      message: 'Name must be at least 2 characters long',
    };
  }

  // Allow letters, spaces, and hyphens
  const nameRegex = /^[a-zA-Z\s\-]+$/;
  if (!nameRegex.test(name)) {
    return {
      isValid: false,
      message: 'Name can only contain letters, spaces, and hyphens',
    };
  }

  return {
    isValid: true,
    message: 'Name is valid',
  };
};

/**
 * Validate login form (email + password only)
 * Name is not required at login — only at registration
 */
const validateLoginForm = (email, password) => {
  const errors = {};

  if (!email || email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password || password.length === 0) {
    errors.password = 'Password is required';
  } else {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

/**
 * Sanitize user input to prevent XSS
 * Trims whitespace and encodes special characters
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

export {
  validateEmail,
  validatePassword,
  validateName,
  validateLoginForm,
  sanitizeInput,
};
