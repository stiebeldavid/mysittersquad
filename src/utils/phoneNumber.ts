export const formatPhoneWithCountryCode = (phone?: string): string => {
  console.log('formatPhoneWithCountryCode input:', phone);
  
  // If no phone number provided or just country code, return empty string
  if (!phone || phone === '+1') {
    console.log('Phone is empty or just country code, returning empty string');
    return '';
  }
  
  // Sanitize input: remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  console.log('Cleaned phone number:', cleaned);
  
  // If empty after cleaning, return empty string
  if (!cleaned) {
    console.log('Phone is empty after cleaning, returning empty string');
    return '';
  }
  
  // Validate length
  if (cleaned.length !== 10 && !(cleaned.length === 11 && cleaned.startsWith('1'))) {
    console.log('Invalid phone length:', cleaned.length);
    console.log('Phone number:', cleaned);
    throw new Error(`Invalid phone number format: length ${cleaned.length}`);
  }
  
  // If it already has country code (11 digits starting with 1), return as is
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    console.log('Phone already has country code, returning:', '+' + cleaned);
    return '+' + cleaned;
  }
  
  // If it's a 10 digit US number, add +1
  if (cleaned.length === 10) {
    console.log('Adding country code to phone:', '+1' + cleaned);
    return '+1' + cleaned;
  }
  
  console.log('Unexpected phone format:', phone);
  throw new Error('Invalid phone number format: unexpected format');
};

export const sanitizePhoneNumber = (phone?: string): string => {
  if (!phone) return '';
  // Remove any potentially harmful characters
  return phone.replace(/[^\d+\-\(\)\s]/g, '');
};

export const validatePhoneNumber = (phone?: string): boolean => {
  console.log('validatePhoneNumber input:', phone);
  
  // Empty phone number is valid (since it's optional)
  if (!phone || phone === '+1') {
    console.log('Phone is empty or just country code, considering valid');
    return true;
  }
  
  const cleaned = phone.replace(/\D/g, '');
  console.log('Cleaned phone for validation:', cleaned);
  
  const isValid = (cleaned.length === 10) || (cleaned.length === 11 && cleaned.startsWith('1'));
  console.log('Phone validation result:', isValid);
  return isValid;
};