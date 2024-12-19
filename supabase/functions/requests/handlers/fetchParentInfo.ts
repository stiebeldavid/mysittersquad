import { base, USERS_TABLE } from '../config.ts';

export const fetchParentInfo = async (parentMobile: string) => {
  console.log('Fetching parent info for mobile:', parentMobile);
  
  const records = await base(USERS_TABLE)
    .select({
      filterByFormula: `{Mobile}='${parentMobile}'`,
      maxRecords: 1
    })
    .all();

  if (records.length === 0) {
    console.log('No parent found with mobile:', parentMobile);
    return null;
  }

  const record = records[0];
  return {
    firstName: record.get('First Name'),
    lastName: record.get('Last Name')
  };
};