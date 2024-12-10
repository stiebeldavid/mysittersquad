import { base } from '../config';

export const updateBabysitterResponse = async (
  requestId: string,
  update: {
    status: string;
    response: string;
  }
) => {
  try {
    console.log('Updating request:', requestId, 'with:', update);
    const record = await base('Requests').update(requestId, {
      'Status': update.status,
      'Babysitter Response': update.response,
    });
    console.log('Update successful:', record);
    return record;
  } catch (error) {
    console.error('Error updating babysitter response:', error);
    throw error;
  }
};