import { base } from '../config';

export const updateBabysitterResponse = async (
  requestId: string,
  update: {
    status: string;
  }
) => {
  try {
    console.log('Updating request:', requestId, 'with:', update);
    await base('Requests').update(requestId, {
      Status: update.status,
    });
    return true;
  } catch (error) {
    console.error('Error updating babysitter response:', error);
    throw error;
  }
};