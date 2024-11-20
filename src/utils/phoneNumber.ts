export const formatPhoneWithCountryCode = (phone: string): string => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it already has country code (11 digits starting with 1), return as is
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return '+' + cleaned;
  }
  
  // If it's a 10 digit US number, add +1
  if (cleaned.length === 10) {
    return '+1' + cleaned;
  }
  
  // Return original if we can't format it
  return phone;
};