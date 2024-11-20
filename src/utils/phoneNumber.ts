export const formatPhoneWithCountryCode = (phone: string): string => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it's empty, return empty string
  if (!cleaned) return '';
  
  // If it already has country code (11 digits starting with 1), format it
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return '+' + cleaned;
  }
  
  // If it's a 10 digit US number, add +1
  if (cleaned.length === 10) {
    return '+1' + cleaned;
  }
  
  // If it's less than 10 digits, it's incomplete
  if (cleaned.length < 10) {
    return phone;
  }
  
  // Return formatted number
  return '+1' + cleaned.slice(-10);
};