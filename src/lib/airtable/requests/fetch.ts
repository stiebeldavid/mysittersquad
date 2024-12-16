import { supabase } from "@/integrations/supabase/client";
import type { Request, RequestDetails } from './types';

export const fetchRequests = async (parentRequestorMobile: string): Promise<Request[]> => {
  if (!parentRequestorMobile) {
    console.error('No parent mobile number provided to fetchRequests');
    return [];
  }

  try {
    const { data, error } = await supabase.functions.invoke('requests', {
      body: {
        action: 'fetch',
        data: { parentMobile: parentRequestorMobile }
      }
    });

    if (error) throw error;
    return data.requests;
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw error;
  }
};

export const fetchRequestByVerificationId = async (verificationId: string): Promise<RequestDetails | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('requests', {
      body: {
        action: 'fetchByVerificationId',
        data: { verificationId }
      }
    });

    if (error) throw error;
    return data.record;
  } catch (error) {
    console.error('Error fetching request by verification ID:', error);
    return null;
  }
};