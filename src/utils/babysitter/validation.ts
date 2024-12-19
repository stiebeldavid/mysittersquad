import { toast } from "@/components/ui/use-toast";
import { validatePhoneNumber } from "@/utils/phoneNumber";

export const validateBabysitterForm = (formData: FormData): boolean => {
  // Required fields validation
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const mobile = formData.get("mobile") as string;

  if (!firstName || !lastName) {
    toast({
      title: "Validation Error",
      description: "First Name and Last Name are required",
      variant: "destructive",
    });
    return false;
  }

  // Check if both mobile and email are empty
  if (!email && !mobile) {
    toast({
      title: "Validation Error",
      description: "Either Mobile Number or Email is required",
      variant: "destructive",
    });
    return false;
  }

  // Validate email format if provided
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    toast({
      title: "Validation Error",
      description: "Please enter a valid email address",
      variant: "destructive",
    });
    return false;
  }

  // Validate mobile format if provided
  if (mobile && !validatePhoneNumber(mobile)) {
    toast({
      title: "Validation Error",
      description: "Please enter a valid mobile number",
      variant: "destructive",
    });
    return false;
  }

  return true;
};