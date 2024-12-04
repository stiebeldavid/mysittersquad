import { base } from './config';
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

export const fetchRequests = async (parentRequestorMobile: string) => {
  if (!parentRequestorMobile) {
    console.error('No parent mobile number provided to fetchRequests');
    return [];
  }

  try {
    const formattedParentMobile = formatPhoneWithCountryCode(parentRequestorMobile);
    const filterFormula = `{Parent Requestor Mobile}='${formattedParentMobile}'`;
    
    const records = await base('Requests')
      .select({
        filterByFormula: filterFormula,
        sort: [{ field: 'Created Time', direction: 'desc' }],
      })
      .all();

    return records.map((record) => {
      const firstName = record.get('First Name (from Babysitter)') as string || '';
      const lastName = record.get('Last Name (from Babysitter)') as string || '';
      const babysitterName = firstName && lastName 
        ? `${firstName} ${lastName}`
        : firstName || 'Unknown Babysitter';

      return {
        id: record.id,
        date: record.get('Request Date') as string,
        timeRange: record.get('Time Range') as string,
        babysitterId: Array.isArray(record.get('Babysitter')) 
          ? (record.get('Babysitter') as string[])[0] 
          : '',
        babysitterName,
        status: record.get('Status') as string || 'Pending',
        createdAt: record.get('Created Time') as string || new Date().toISOString(),
        babysitterDeleted: record.get('Deleted (from Babysitter)') as boolean || false,
        notes: record.get('Additional Notes') as string || '',
      };
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw error;
  }
};

export const fetchRequestByVerificationId = async (verificationId: string) => {
  try {
    const requestRecords = await base('Requests')
      .select({
        filterByFormula: `{Verification_ID}='${verificationId}'`,
        maxRecords: 1,
      })
      .firstPage();
    
    if (requestRecords.length === 0) {
      console.log('No matching request found for verification ID:', verificationId);
      return null;
    }
    
    const record = requestRecords[0];
    const parentMobile = record.get('Parent Requestor Mobile') as string;
    const parent = await findParentByMobile(parentMobile);
    
    return {
      id: record.id,
      date: record.get('Request Date') as string,
      timeRange: record.get('Time Range') as string,
      notes: record.get('Additional Notes') as string,
      babysitterFirstName: record.get('First Name (from Babysitter)') as string,
      parent: parent,
      verificationId: verificationId,
    };
  } catch (error) {
    console.error('Error fetching request by verification ID:', error);
    return null;
  }
};

const findParentByMobile = async (mobile: string) => {
  try {
    const records = await base('Users')
      .select({
        filterByFormula: `{Mobile}='${mobile}'`,
        maxRecords: 1,
      })
      .firstPage();
    
    if (records.length === 0) {
      return null;
    }
    
    return {
      firstName: records[0].get('First Name') as string,
      lastName: records[0].get('Last Name') as string,
    };
  } catch (error) {
    console.error('Error finding parent:', error);
    return null;
  }
};

export const updateBabysitterResponse = async (
  verificationId: string,
  update: {
    status: string;
    response: string;
  }
) => {
  try {
    // First, find the record by Verification_ID
    const records = await base('Requests')
      .select({
        filterByFormula: `{Verification_ID}='${verificationId}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) {
      throw new Error('Request not found');
    }

    // Update the record using its ID
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