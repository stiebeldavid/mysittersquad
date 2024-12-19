export const prepareBabysitterFormData = (formData: FormData, mobile: string): FormData => {
  if (mobile && mobile !== '+1') {
    // Clean the mobile number by removing all spaces and any other formatting
    const cleanedMobile = mobile.replace(/[\s\-\(\)]/g, '');
    formData.set("mobile", cleanedMobile);
  } else {
    // If mobile is empty or just '+1', set it as empty string
    formData.set("mobile", "");
  }
  
  return formData;
};