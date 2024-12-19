import { base, REQUESTS_TABLE } from '../config.ts';

export const updateResponse = async (requestId: string, status: string, response: string) => {
  console.log('Updating request response:', { requestId, status, response });

  const records = await base(REQUESTS_TABLE).update([
    {
      id: requestId,
      fields: {
        'Status': status,
        'Babysitter Response': response,
      },
    },
  ]);

  console.log('Updated request:', records[0]);
  return records[0];
};