import { base } from '../config';

export const updateBabysitterResponse = async (
  requestId: string,
  update: {
    status: string;
  }
) => {
  try {
    console.log('Updating request:', requestId, 'with:', update);
    const url = `https://api.airtable.com/v0/appbQPN6CeEmayzz1/tblz6LOxHesVWmmYI/${requestId}`;
    const record = await base('Requests').update(requestId, {
      'Status': update.status,
    });
    console.log('Update successful:', record);
    return record;
  } catch (error) {
    console.error('Error updating babysitter response:', error);
    throw error;
  }
};