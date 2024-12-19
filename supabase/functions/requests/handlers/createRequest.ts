import { base, REQUESTS_TABLE } from '../config.ts';
import { formatTimeRange } from '../timeUtils.ts';

export const createRequest = async (data: any) => {
  console.log('Creating new request:', data);

  const formattedTimeRange = data.startTime && data.endTime 
    ? formatTimeRange(data.startTime, data.endTime)
    : data.timeRange;

  const records = await base(REQUESTS_TABLE).create([
    {
      fields: {
        'Request Date': data.requestDate,
        'Time Range': formattedTimeRange,
        'Babysitter': [data.babysitterId],
        'Parent Requestor Mobile': data.parentMobile,
        'Request Group ID': data.requestGroupId,
        'Status': 'Pending',
        'Additional Notes': data.notes || '',
      },
    },
  ]);

  console.log('Created request:', records[0]);
  return records[0];
};