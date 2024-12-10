import { base } from '../config';

export const updateBabysitterResponse = async (
  requestId: string,
  update: {
    status: string;
    response: string;
  }
) => {
  try {
    const record = await base('Requests').update(requestId, {
      'Status': update.status,
      'Babysitter Response': update.response,
    });
    return record;
  } catch (error) {
    console.error('Error updating babysitter response:', error);
    throw error;
  }
};