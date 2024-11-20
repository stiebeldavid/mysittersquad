import { base } from './config';
import { formatPhoneWithCountryCode } from '@/utils/phoneNumber';
import { formatTimeRange } from '@/utils/timeFormatting';

export const createRequest = async (
  date: Date,
  startTime: string,
  endTime: string,
  babysitterId: string,
  parentRequestorMobile: string,
  requestGroupId: string
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
          'Status': 'Created',
          'Request Group ID': requestGroupId,
        },
      },
    ]);
    return records[0];
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

export const fetchRequests = async (parentRequestorMobile: string) => {
  console.log('Fetching requests for parent mobile:', parentRequestorMobile);
  
  if (!parentRequestorMobile) {
    console.error('No parent mobile number provided to fetchRequests');
    return [];
  }

  try {
    const formattedParentMobile = formatPhoneWithCountryCode(parentRequestorMobile);
    const filterFormula = `{Parent Requestor Mobile}='${formattedParentMobile}'`;
    console.log('Using filter formula:', filterFormula);
    
    const records = await base('Requests')
      .select({
        filterByFormula: filterFormula,
        sort: [{ field: 'Created Time', direction: 'desc' }],
      })
      .all();

    console.log('Found request records:', records.length);
    console.log('Raw records:', records.map(record => record.fields));

    return records.map((record) => ({
      id: record.id,
      date: record.get('Request Date') as string,
      timeRange: record.get('Time Range') as string,
      babysitterId: (record.get('Babysitter') as string[])[0],
      babysitterName: `${record.get('First Name (from Babysitter)') || ''} ${record.get('Last Name (from Babysitter)') || ''}`.trim(),
      status: record.get('Status') as string,
      createdAt: record.get('Created Time') as string,
      babysitterDeleted: record.get('Deleted (from Babysitter)') as boolean,
    }));
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw error;
  }
};