import Airtable from 'npm:airtable';
import { BABYSITTERS_TABLE, BASE_ID } from './config.ts';

// Configure Airtable
const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
if (!AIRTABLE_API_KEY) {
  throw new Error('AIRTABLE_API_KEY is required');
}

// Log Airtable configuration (without exposing the full API key)
console.log('Airtable Configuration:', {
  apiKeyPresent: !!AIRTABLE_API_KEY,
  apiKeyLength: AIRTABLE_API_KEY.length,
  baseId: BASE_ID,
  tableId: BABYSITTERS_TABLE
});

Airtable.configure({
  apiKey: AIRTABLE_API_KEY,
});

export const base = Airtable.base(BASE_ID);

export const fetchBabysittersFromAirtable = async (normalizedMobile: string) => {
  try {
    const records = await base(BABYSITTERS_TABLE)
      .select({
        filterByFormula: `AND({Parent Owner Mobile}='${normalizedMobile}', NOT({Deleted}))`,
      })
      .all();

    console.log(`Found ${records.length} active babysitters`);

    return records.map(record => ({
      id: record.id,
      firstName: record.get('First Name'),
      lastName: record.get('Last Name'),
      mobile: record.get('Mobile'),
      email: record.get('Email'),
      age: record.get('Age'),
      grade: record.get('Grade'),
      rate: record.get('Hourly rate (USD)'),
      specialties: record.get('Specialties'),
      notes: record.get('Notes'),
      babysitterId: record.id, // This is the Airtable Record ID
    }));
  } catch (error) {
    console.error('Airtable error:', {
      error,
      config: {
        baseId: BASE_ID,
        tableId: BABYSITTERS_TABLE,
        apiKeyPresent: !!AIRTABLE_API_KEY,
        apiKeyLength: AIRTABLE_API_KEY.length
      }
    });
    throw error;
  }
};

export const createBabysitterInAirtable = async (data: any) => {
  const records = await base(BABYSITTERS_TABLE).create([
    {
      fields: {
        'First Name': data.firstName,
        'Last Name': data.lastName,
        'Mobile': data.mobile,
        'Parent Owner Mobile': data.parentMobile,
        'Age': data.age,
        'Grade': data.grade,
        'Hourly rate (USD)': data.rate,
        'Specialties': data.specialties,
        'Notes': data.notes,
        'Email': data.email,
      },
    },
  ]);
  return records[0];
};

export const updateBabysitterInAirtable = async (id: string, data: any) => {
  const records = await base(BABYSITTERS_TABLE).update([
    {
      id,
      fields: {
        'First Name': data.firstName,
        'Last Name': data.lastName,
        'Mobile': data.mobile,
        'Age': data.age,
        'Grade': data.grade,
        'Hourly rate (USD)': data.rate,
        'Specialties': data.specialties,
        'Notes': data.notes,
        'Email': data.email,
      },
    },
  ]);
  return records[0];
};

export const deleteBabysitterFromAirtable = async (id: string) => {
  const records = await base(BABYSITTERS_TABLE).destroy([id]);
  return records[0];
};