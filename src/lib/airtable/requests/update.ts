import { base } from '../config';

interface RequestFields {
  Status: string;
}

export const updateBabysitterResponse = async (
  requestId: string,
  update: {
    status: string;
  }
) => {
  try {
    console.log('Updating request:', requestId, 'with:', update);
    await base('tblz6LOxHesVWmmYI').update(requestId, {
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