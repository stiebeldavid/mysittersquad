import { base } from './config';
import { formatPhoneWithCountryCode } from '@/utils/phoneNumber';

export const findUserByMobile = async (mobile: string) => {
  if (!mobile) {
    console.error('No mobile number provided to findUserByMobile');
    return null;
  }

  try {
    // Clean and format the mobile number consistently
    const formattedMobile = formatPhoneWithCountryCode(mobile);
    console.log('Searching for user with mobile:', formattedMobile); // Debug log
    
    const records = await base('Users')
      .select({
        filterByFormula: `{Mobile}='${formattedMobile}'`,
        maxRecords: 1,
      })
      .firstPage();
    
    if (records.length === 0) {
      console.warn(`No user found for mobile: ${formattedMobile}`);
      return null;
    }
    
    return records[0];
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

export const createUser = async (firstName: string, lastName: string, mobile: string) => {
  try {
    const formattedMobile = formatPhoneWithCountryCode(mobile);
    const records = await base('Users').create([
      {
        fields: {
          'First Name': firstName,
          'Last Name': lastName,
          Mobile: formattedMobile,
        },
      },
    ]);
    return records[0];
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

export const updateUserAddress = async (
  mobile: string,
  streetAddress: string,
  city: string,
  state: string,
  zipCode: string
) => {
  if (!mobile) {
    console.error('No mobile number provided to updateUserAddress');
    return null;
  }

  try {
    const formattedMobile = formatPhoneWithCountryCode(mobile);
    const records = await base('Users')
      .select({
        filterByFormula: `{Mobile}='${formattedMobile}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length > 0) {
      const record = await base('Users').update(records[0].id, {
        'Street Address': streetAddress,
        'City': city,
        'State': state,
        'Zip Code': zipCode,
      });
      return record;
    }
    return null;
  } catch (error) {
    console.error('Error updating user address:', error);
    throw error;
  }
};