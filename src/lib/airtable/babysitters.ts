import { supabase } from "@/integrations/supabase/client";
import { Babysitter } from '@/types/babysitter';

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
  if (!parentOwnerMobile) {
    console.error('No parent mobile number provided to createBabysitter');
    throw new Error('Parent mobile number is required');
  }

  try {
    const { data, error } = await supabase.functions.invoke('babysitters', {
      body: {
        action: 'create',
        data: {
          firstName,
          lastName,
          mobile,
          parentMobile: parentOwnerMobile,
          age,
          grade,
          rate,
          specialties,
          notes,
          email,
        }
      }
    });

    if (error) throw error;
    return data.record;
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
    const { data, error } = await supabase.functions.invoke('babysitters', {
      body: {
        action: 'update',
        data: {
          id,
          firstName,
          lastName,
          mobile,
          age,
          grade,
          rate,
          specialties,
          notes,
          email,
        }
      }
    });

    if (error) throw error;
    return data.record;
  } catch (error) {
    console.error('Error updating babysitter:', error);
    throw error;
  }
};

export const deleteBabysitter = async (id: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('babysitters', {
      body: {
        action: 'delete',
        data: { id }
      }
    });

    if (error) throw error;
    return data.record;
  } catch (error) {
    console.error('Error deleting babysitter:', error);
    throw error;
  }
};

export const fetchBabysitters = async (parentOwnerMobile: string): Promise<Babysitter[]> => {
  console.log('Fetching babysitters for parent mobile:', parentOwnerMobile);
  
  if (!parentOwnerMobile) {
    console.error('No parent mobile number provided to fetchBabysitters');
    return [];
  }

  try {
    const { data, error } = await supabase.functions.invoke('babysitters', {
      body: {
        action: 'fetch',
        data: { parentMobile: parentOwnerMobile }
      }
    });

    if (error) throw error;
    return data.babysitters;
  } catch (error) {
    console.error('Error fetching babysitters:', error);
    throw error;
  }
};