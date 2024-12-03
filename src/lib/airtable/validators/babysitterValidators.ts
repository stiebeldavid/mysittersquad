import { formatPhoneWithCountryCode } from "@/utils/phoneNumber";

export const validateBabysitterInput = (
  firstName: string,
  mobile: string | undefined,
  email: string | undefined,
  parentOwnerMobile: string
) => {
  if (!firstName) {
    throw new Error("First name is required");
  }

  if (!parentOwnerMobile && parentOwnerMobile !== "dummy") {
    throw new Error("Parent mobile number is required");
  }

  // Allow either mobile or email to be empty, but not both
  if (!mobile && !email) {
    throw new Error("Either mobile number or email is required");
  }

  // Only format mobile if it's provided and not empty
  const formattedParentMobile = parentOwnerMobile !== "dummy" 
    ? formatPhoneWithCountryCode(parentOwnerMobile)
    : "";
    
  const formattedMobile = mobile ? formatPhoneWithCountryCode(mobile) : "";

  return {
    formattedParentMobile,
    formattedMobile,
  };
};