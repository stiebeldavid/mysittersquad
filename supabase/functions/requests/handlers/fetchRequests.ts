import { base, REQUESTS_TABLE } from '../config.ts';
import { corsHeaders } from '../corsHeaders.ts';

export const fetchRequests = async (parentMobile: string) => {
  console.log('Fetching requests for parent mobile:', parentMobile);
  
  const records = await base(REQUESTS_TABLE)
    .select({
      filterByFormula: `{Parent Requestor Mobile}='${parentMobile}'`,
      sort: [{ field: 'Created At', direction: 'desc' }]
    })
    .all();

  console.log(`Found ${records.length} requests`);

  return records.map(record => ({
    id: record.id,
    requestDate: record.get('Request Date'),
    timeRange: record.get('Time Range'),
    babysitterId: record.get('Babysitter'),
    babysitterFirstName: record.get('First Name (from Babysitter)'),
    babysitterLastName: record.get('Last Name (from Babysitter)'),
    status: record.get('Status'),
    createdAt: record.get('Created At'),
    babysitterDeleted: record.get('Babysitter Deleted'),
    additionalNotes: record.get('Additional Notes'),
    requestGroupId: record.get('Request Group ID'),
  }));
};