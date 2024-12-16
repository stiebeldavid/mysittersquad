import { supabase } from "@/integrations/supabase/client";

export const findUserByMobile = async (mobile: string) => {
  if (!mobile) {
    console.error('No mobile number provided to findUserByMobile');
    return null;
  }

  try {
    const { data, error } = await supabase.functions.invoke('users', {
      body: { action: 'findByMobile', mobile }
    });

    if (error) throw error;
    return data.record;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

export const createUser = async (firstName: string, lastName: string, mobile: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('users', {
      body: { 
        action: 'create', 
        mobile,
        data: { firstName, lastName }
      }
    });

    if (error) throw error;
    return data.record;
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
    const { data, error } = await supabase.functions.invoke('users', {
      body: { 
        action: 'updateAddress', 
        mobile,
        data: { streetAddress, city, state, zipCode }
      }
    });

    if (error) throw error;
    return data.record;
  } catch (error) {
    console.error('Error updating user address:', error);
    throw error;
  }
};