import Airtable from 'airtable';

const base = new Airtable({ apiKey: 'patXl1omFaUIAE61b.65020a5523d7b3110d0914ffcc4c6e3ba32e58dd1b6e2a213fb5f639edb5b79a' }).base(
  'appbQPN6CeEmayzz1'
);

export const findUserByMobile = async (mobile: string) => {
  try {
    const records = await base('Users')
      .select({
        filterByFormula: `{Mobile}='${mobile}'`,
        maxRecords: 1,
      })
      .firstPage();
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