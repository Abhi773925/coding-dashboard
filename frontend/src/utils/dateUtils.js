/**
 * Utility functions for safe date handling
 */

/**
 * Safely converts a date to ISO string, returning null if invalid
 * @param {Date|string|number} dateInput - The date to convert
 * @returns {string|null} - ISO string or null if invalid
 */
export const safeToISOString = (dateInput) => {
  try {
    if (!dateInput) return null;
    
    const date = new Date(dateInput);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date provided to safeToISOString:', dateInput);
      return null;
    }
    
    return date.toISOString();
  } catch (error) {
    console.error('Error converting date to ISO string:', error, dateInput);
    return null;
  }
};

/**
 * Safely gets date string in YYYY-MM-DD format
 * @param {Date|string|number} dateInput - The date to convert
 * @returns {string|null} - Date string or null if invalid
 */
export const safeDateString = (dateInput) => {
  const isoString = safeToISOString(dateInput);
  return isoString ? isoString.split('T')[0] : null;
};

/**
 * Validates if a date is valid
 * @param {Date|string|number} dateInput - The date to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidDate = (dateInput) => {
  try {
    if (!dateInput) return false;
    const date = new Date(dateInput);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};

/**
 * Safely parses a date, returning null if invalid
 * @param {Date|string|number} dateInput - The date to parse
 * @returns {Date|null} - Parsed date or null if invalid
 */
export const safeParseDate = (dateInput) => {
  try {
    if (!dateInput) return null;
    
    const date = new Date(dateInput);
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date provided to safeParseDate:', dateInput);
      return null;
    }
    
    return date;
  } catch (error) {
    console.error('Error parsing date:', error, dateInput);
    return null;
  }
};

/**
 * Safely gets year from date
 * @param {Date|string|number} dateInput - The date to get year from
 * @returns {number|null} - Year or null if invalid
 */
export const safeGetYear = (dateInput) => {
  const date = safeParseDate(dateInput);
  return date ? date.getFullYear() : null;
};

/**
 * Creates a safe date from timestamp (handles both seconds and milliseconds)
 * @param {number} timestamp - Unix timestamp
 * @returns {Date|null} - Parsed date or null if invalid
 */
export const safeFromTimestamp = (timestamp) => {
  try {
    if (typeof timestamp !== 'number' || isNaN(timestamp)) {
      console.warn('Invalid timestamp provided:', timestamp);
      return null;
    }
    
    // Handle both seconds and milliseconds timestamps
    const ts = timestamp > 1e10 ? timestamp : timestamp * 1000;
    const date = new Date(ts);
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid timestamp results in invalid date:', timestamp);
      return null;
    }
    
    return date;
  } catch (error) {
    console.error('Error creating date from timestamp:', error, timestamp);
    return null;
  }
};

/**
 * Safely formats a date for display
 * @param {Date|string|number} dateInput - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string or 'Invalid Date'
 */
export const safeFormatDate = (dateInput, options = {}) => {
  const date = safeParseDate(dateInput);
  if (!date) return 'Invalid Date';
  
  try {
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error, dateInput);
    return 'Invalid Date';
  }
};
