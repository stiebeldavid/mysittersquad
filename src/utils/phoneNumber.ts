export const formatPhoneWithCountryCode = (phone?: string): string => {
  // If no phone number provided, return empty string
  if (!phone) {
    return '';
  }
  
  // Sanitize input: remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If empty after cleaning, return empty string
  if (!cleaned) {
    return '';
  }
  
  // Validate length
  if (cleaned.length !== 10 && !(cleaned.length === 11 && cleaned.startsWith('1'))) {
    throw new Error('Invalid phone number format');
  }
  
  // If it already has country code (11 digits starting with 1), return as is
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return '+' + cleaned;
  }
  
  // If it's a 10 digit US number, add +1
  if (cleaned.length === 10) {
    return '+1' + cleaned;
  }
  
  throw new Error('Invalid phone number format');
};

export const sanitizePhoneNumber = (phone?: string): string => {
  if (!phone) return '';
  // Remove any potentially harmful characters
  return phone.replace(/[^\d+\-\(\)\s]/g, '');
};

export const validatePhoneNumber = (phone?: string): boolean => {
  if (!phone) return true; // Empty phone number is valid since it's optional
  const cleaned = phone.replace(/\D/g, '');
  return (cleaned.length === 10) || (cleaned.length === 11 && cleaned.startsWith('1'));
};