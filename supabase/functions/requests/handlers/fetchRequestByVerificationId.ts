import { base, REQUESTS_TABLE } from '../config.ts';
import { fetchParentInfo } from './fetchParentInfo.ts';

export const fetchRequestByVerificationId = async (verificationId: string) => {
  console.log('Fetching request by verification ID:', verificationId);
  
  const records = await base(REQUESTS_TABLE)
    .select({
      filterByFormula: `{Verification_ID}='${verificationId}'`,
      maxRecords: 1
    })
    .all();

  if (records.length === 0) {
    console.log('No request found with verification ID:', verificationId);
    return null;
  }

  const record = records[0];
  const parentMobile = record.get('Parent Requestor Mobile');
  const parent = await fetchParentInfo(parentMobile);

  return {
    id: record.id,
    requestDate: record.get('Request Date'),
    timeRange: record.get('Time Range'),
    notes: record.get('Additional Notes'),
    date: record.get('Request Date'),
    babysitterFirstName: record.get('First Name (from Babysitter)'),
    parent,
    verificationId: record.get('Verification_ID'),
    recordId: record.id
  };
};