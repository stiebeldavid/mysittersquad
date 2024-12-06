import Airtable from 'airtable';

if (!import.meta.env.VITE_AIRTABLE_API_KEY) {
  throw new Error('Airtable API key is missing. Please set VITE_AIRTABLE_API_KEY in your .env file');
}

if (!import.meta.env.VITE_AIRTABLE_BASE_ID) {
  throw new Error('Airtable Base ID is missing. Please set VITE_AIRTABLE_BASE_ID in your .env file');
}

export const base = new Airtable({ 
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY
}).base(import.meta.env.VITE_AIRTABLE_BASE_ID);