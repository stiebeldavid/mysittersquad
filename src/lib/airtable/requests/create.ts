import { supabase } from "@/integrations/supabase/client";
import { formatTimeRange } from "@/utils/timeFormatting";

export const createRequest = async (
  date: Date,
  startTime: string,
  endTime: string,
  babysitterId: string,
  parentRequestorMobile: string,
  requestGroupId: string,
  notes?: string
) => {
  if (!parentRequestorMobile) {
    console.error('No parent mobile number provided to createRequest');
    throw new Error('Parent mobile number is required');
  }

  try {
    const formattedDate = date.toISOString().split('T')[0];
    const timeRange = formatTimeRange(startTime, endTime);

    console.log('Invoking requests function with:', {
      date: formattedDate,
      timeRange,
      babysitterId,
      parentMobile: parentRequestorMobile,
      requestGroupId,
      notes,
    });

    const { data, error } = await supabase.functions.invoke('requests', {
      body: {
        action: 'create',
        data: {
          requestDate: formattedDate,
          timeRange,
          babysitterId,
          parentMobile: parentRequestorMobile,
          requestGroupId,
          notes,
        }
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }

    return data.record;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};