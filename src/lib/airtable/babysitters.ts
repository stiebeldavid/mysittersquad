import { base } from './config';
import { Babysitter } from '@/types/babysitter';
import { validateBabysitterInput } from './validators/babysitterValidators';
import { mapBabysitterFields, mapToBabysitter } from './mappers/babysitterMappers';
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
  try {
    const { formattedParentMobile, formattedMobile } = validateBabysitterInput(
      firstName,
      mobile,
      email,
      parentOwnerMobile
    );

    const fields = mapBabysitterFields(
      firstName,
      lastName,
      formattedMobile,
      formattedParentMobile,
      age,
      grade,
      rate,
      specialties,
      notes,
      email
    );

    const records = await base('Babysitters').create([{ fields }]);
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
    const { formattedMobile } = validateBabysitterInput(
      firstName,
      mobile,
      email,
      "dummy" // Parent mobile not needed for update
    );

    const fields = mapBabysitterFields(
      firstName,
      lastName,
      formattedMobile,
      "", // Parent mobile not needed for update
      age,
      grade,
      rate,
      specialties,
      notes,
      email
    );

    delete fields['Parent Owner Mobile']; // Remove parent mobile from update
    delete fields['Deleted']; // Remove deleted flag from update

    const record = await base('Babysitters').update(id, fields);
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
  if (!parentOwnerMobile) {
    console.error('No parent mobile number provided to fetchBabysitters');
    return [];
  }

  try {
    const formattedParentMobile = formatPhoneWithCountryCode(parentOwnerMobile);
    const filterFormula = `AND({Parent Owner Mobile}='${formattedParentMobile}', {Deleted}!=1)`;
    
    const records = await base('Babysitters')
      .select({
        filterByFormula: filterFormula,
      })
      .all();

    return records.map(mapToBabysitter);
  } catch (error) {
    console.error('Error fetching babysitters:', error);
    throw error;
  }
};