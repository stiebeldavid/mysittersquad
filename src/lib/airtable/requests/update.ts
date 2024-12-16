import { supabase } from "@/integrations/supabase/client";

export const updateBabysitterResponse = async (
  requestId: string,
  update: {
    status: string;
    response: string;
  }
) => {
  try {
    const { data, error } = await supabase.functions.invoke('requests', {
      body: {
        action: 'updateResponse',
        data: {
          requestId,
          status: update.status,
          response: update.response,
        }
      }
    });

    if (error) throw error;
    return data.record;
  } catch (error) {
    console.error('Error updating babysitter response:', error);
    throw error;
  }
};