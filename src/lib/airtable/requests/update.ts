import { base } from '../config';

export const updateBabysitterResponse = async (
  verificationId: string,
  update: {
    status: string;
    response: string;
  }
) => {
  try {
    const records = await base('Requests')
      .select({
        filterByFormula: `{Verification_ID}='${verificationId}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) {
      throw new Error('Request not found');
    }

    const record = await base('Requests').update(records[0].id, {
      'Status': update.status,
      'Babysitter Response': update.response,
    });
    return record;
  } catch (error) {
    console.error('Error updating babysitter response:', error);
    throw error;
  }
};