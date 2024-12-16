import { supabase } from "@/integrations/supabase/client";

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
    const timeRange = `${startTime} - ${endTime}`;

    const { data, error } = await supabase.functions.invoke('requests', {
      body: {
        action: 'create',
        data: {
          date: formattedDate,
          timeRange,
          babysitterId,
          parentMobile: parentRequestorMobile,
          requestGroupId,
          notes,
        }
      }
    });

    if (error) throw error;
    return data.record;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};