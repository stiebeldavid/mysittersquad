import Airtable from 'airtable';

export const base = new Airtable({ apiKey: process.env.AIRTABLE_SECRET_KEY }).base(process.env.AIRTABLE_BASE_ID);

