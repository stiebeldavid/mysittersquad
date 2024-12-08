import Airtable from 'airtable';

if (!import.meta.env.VITE_AIRTABLE_API_KEY) {
  console.error('Airtable API key is missing. Please check your environment variables.');
}

if (!import.meta.env.VITE_AIRTABLE_BASE_ID) {
  console.error('Airtable Base ID is missing. Please check your environment variables.');
}

export const base = new Airtable({ 
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY
}).base(import.meta.env.VITE_AIRTABLE_BASE_ID);