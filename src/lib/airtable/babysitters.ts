import { base } from './config';
import { Babysitter } from '@/types/babysitter';
import { formatPhoneWithCountryCode } from '@/utils/phoneNumber';

export const createBabysitter = async (
  firstName: string,
  lastName: string | undefined,
  mobile: string,
  parentOwnerMobile: string,
  age?: string,
  grade?: string,
  rate?: string,
  specialties?: string,
  notes?: string,
  email?: string
) => {
  if (!parentOwnerMobile) {
    console.error('No parent mobile number provided to createBabysitter');
    throw new Error('Parent mobile number is required');
  }

  try {
    console.log('Creating babysitter with mobile:', mobile);
    const formattedMobile = mobile ? formatPhoneWithCountryCode(mobile) : '';
    console.log('Formatted mobile for create:', formattedMobile);
    
    const formattedParentMobile = formatPhoneWithCountryCode(parentOwnerMobile);
    console.log('Formatted parent mobile:', formattedParentMobile);

    const records = await base('Babysitters').create([
      {
        fields: {
          'First Name': firstName,
          'Last Name': lastName || '',
          'Mobile': formattedMobile,
          'Parent Owner Mobile': formattedParentMobile,
          'Age': age || '',
          'Grade': grade || '',
          'Hourly rate (USD)': rate || '',
          'Specialties': specialties || '',
          'Notes': notes || '',
          'Email': email || '',
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

export const updateBabysitter = async (
  id: string,
  firstName: string,
  lastName: string | undefined,
  mobile: string,
  age?: string,
  grade?: string,
  rate?: string,
  specialties?: string,
  notes?: string,
  email?: string
) => {
  try {
    console.log('Updating babysitter with mobile:', mobile);
    const formattedMobile = mobile ? formatPhoneWithCountryCode(mobile) : '';
    console.log('Formatted mobile for update:', formattedMobile);

    const record = await base('Babysitters').update(id, {
      'First Name': firstName,
      'Last Name': lastName || '',
      'Mobile': formattedMobile,
      'Age': age || '',
      'Grade': grade || '',
      'Hourly rate (USD)': rate || '',
      'Specialties': specialties || '',
      'Notes': notes || '',
      'Email': email || '',
    });
    return record;
  } catch (error) {
    console.error('Error updating babysitter:', error);
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
      age: record.get('Age') as string,
      grade: record.get('Grade') as string,
      rate: record.get('Hourly rate (USD)') as string,
      specialties: record.get('Specialties') as string,
      notes: record.get('Notes') as string,
      email: record.get('Email') as string,
    }));
  } catch (error) {
    console.error('Error fetching babysitters:', error);
    throw error;
  }
};