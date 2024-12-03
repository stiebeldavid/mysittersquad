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

  if (!parentOwnerMobile) {
    throw new Error("Parent mobile number is required");
  }

  if (!mobile && !email) {
    throw new Error("Either mobile number or email is required");
  }

  // Only validate mobile if it's provided
  const formattedParentMobile = formatPhoneWithCountryCode(parentOwnerMobile);
  const formattedMobile = mobile ? formatPhoneWithCountryCode(mobile) : "";

  return {
    formattedParentMobile,
    formattedMobile,
  };
};