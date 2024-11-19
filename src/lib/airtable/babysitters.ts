import { base } from './config';
import { Babysitter } from '@/types/babysitter';
import { formatPhoneWithCountryCode } from '@/utils/phoneNumber';

export const createBabysitter = async (
  firstName: string,
  lastName: string | undefined,
  mobile: string,
  parentOwnerMobile: string
) => {
  if (!parentOwnerMobile) {
    console.error('No parent mobile number provided to createBabysitter');
    throw new Error('Parent mobile number is required');
  }

  try {
    const formattedMobile = formatPhoneWithCountryCode(mobile);
    const formattedParentMobile = formatPhoneWithCountryCode(parentOwnerMobile);

    const records = await base('Babysitters').create([
      {
        fields: {
          'First Name': firstName,
          'Last Name': lastName || '',
          'Mobile': formattedMobile,
          'Parent Owner Mobile': formattedParentMobile,
          'Deleted': false,
        },
      },
    ]);
    return records[0];
  } catch (error) {
    console.error('Error creating babysitter:', error);
    throw error;
  }
};

export const deleteBabysitter = async (id: string) => {
  try {
    const record = await base('Babysitters').update(id, {
      'Deleted': true
    });
    return record;
  } catch (error) {
    console.error('Error deleting babysitter:', error);
    throw error;
  }
};

export const fetchBabysitters = async (parentOwnerMobile: string): Promise<Babysitter[]> => {
  console.log('Fetching babysitters for parent mobile:', parentOwnerMobile);
  
  if (!parentOwnerMobile) {
    console.error('No parent mobile number provided to fetchBabysitters');
    return [];
  }

  try {
    const formattedParentMobile = formatPhoneWithCountryCode(parentOwnerMobile);
    const filterFormula = `AND({Parent Owner Mobile}='${formattedParentMobile}', {Deleted}!=1)`;
    console.log('Using filter formula:', filterFormula);
    
    const records = await base('Babysitters')
      .select({
        filterByFormula: filterFormula,
      })
      .all();

    console.log('Found babysitters records:', records.length);
    console.log('Raw records:', records.map(record => record.fields));

    return records.map((record) => ({
      id: record.id,
      firstName: record.get('First Name') as string,
      lastName: record.get('Last Name') as string,
      mobile: record.get('Mobile') as string,
      home: '',
      age: undefined,
      rate: undefined,
      specialties: '',
      notes: '',
    }));
  } catch (error) {
    console.error('Error fetching babysitters:', error);
    throw error;
  }
};