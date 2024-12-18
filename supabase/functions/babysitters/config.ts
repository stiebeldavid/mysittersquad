export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const BABYSITTERS_TABLE = 'tblpKMKxnmPHj0pRs';
export const BASE_ID = 'appbQPN6CeEmayzz1';

// Helper function to normalize phone numbers
export const normalizePhoneNumber = (phone: string) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  // Ensure it starts with +
  return cleaned.startsWith('1') ? `+${cleaned}` : `+1${cleaned}`
};