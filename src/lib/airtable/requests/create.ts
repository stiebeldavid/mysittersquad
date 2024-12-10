import { base } from '../config';
import { formatPhoneWithCountryCode } from '@/utils/phoneNumber';
import { formatTimeRange } from '@/utils/timeFormatting';

export const createRequest = async (
  date: Date,
  startTime: string,
  endTime: string,
  babysitterId: string,
  parentRequestorMobile: string,
  requestGroupId: string,
  notes?: string
) => {
  if (!parentRequestorMobile) {
    console.error('No parent mobile number provided to createRequest');
    throw new Error('Parent mobile number is required');
  }

  try {
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTimeRange = formatTimeRange(startTime, endTime);
    const formattedParentMobile = formatPhoneWithCountryCode(parentRequestorMobile);
    
    const records = await base('Requests').create([
      {
        fields: {
          'Request Date': formattedDate,
          'Time Range': formattedTimeRange,
          'Babysitter': [babysitterId],
          'Parent Requestor Mobile': formattedParentMobile,
          'Status': 'Pending',
          'Request Group ID': requestGroupId,
          'Additional Notes': notes || '',
        },
      },
    ]);
    return records[0];
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};