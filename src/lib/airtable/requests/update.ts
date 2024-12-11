import { base } from '../config';
import { AirtableFields } from './types';

export const updateBabysitterResponse = async (
  requestId: string,
  update: {
    status: string;
  }
) => {
  try {
    console.log('Updating request:', requestId, 'with:', update);
    await base('tblz6LOxHesVWmmYI').update<AirtableFields>(requestId, {
      fields: {
        Status: update.status,
      }
    });
    return true;
  } catch (error) {
    console.error('Error updating babysitter response:', error);
    throw error;
  }
};