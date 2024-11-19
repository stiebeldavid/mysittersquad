import { base } from './config';

export const findUserByMobile = async (mobile: string) => {
  if (!mobile) {
    console.error('No mobile number provided to findUserByMobile');
    return null;
  }

  try {
    const records = await base('Users')
      .select({
        filterByFormula: `{Mobile}='${mobile}'`,
        maxRecords: 1,
      })
      .firstPage();
    
    if (records.length === 0) {
      console.warn(`No user found for mobile: ${mobile}`);
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
    const records = await base('Users').create([
      {
        fields: {
          'First Name': firstName,
          'Last Name': lastName,
          Mobile: mobile,
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
    const records = await base('Users')
      .select({
        filterByFormula: `{Mobile}='${mobile}'`,
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