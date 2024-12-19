import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Babysitter } from "@/types/babysitter";
import { useState, useEffect } from "react";
import { formatPhoneWithCountryCode, validatePhoneNumber } from "@/utils/phoneNumber";
import { useToast } from "@/components/ui/use-toast";
import { ContactInfoFields } from "./form/ContactInfoFields";
import { PersonalInfoFields } from "./form/PersonalInfoFields";

interface BabysitterFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  currentBabysitter?: Babysitter | null;
}

export const BabysitterForm = ({ onSubmit, currentBabysitter }: BabysitterFormProps) => {
  const [mobile, setMobile] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (currentBabysitter?.mobile) {
      const formattedMobile = formatPhoneWithCountryCode(currentBabysitter.mobile);
      if (formattedMobile) {
        setMobile(formattedMobile);
      }
    }
  }, [currentBabysitter]);

  const validateForm = (formData: FormData): boolean => {
    // Required fields validation
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const mobileNumber = mobile;

    if (!firstName || !lastName) {
      toast({
        title: "Validation Error",
        description: "First Name and Last Name are required",
        variant: "destructive",
      });
      return false;
    }

    // Check if both mobile and email are empty
    if (!email && !mobileNumber) {
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
    if (mobileNumber && !validatePhoneNumber(mobileNumber)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid mobile number",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    
    if (mobile) {
      // Clean the mobile number by removing all spaces and any other formatting
      const cleanedMobile = mobile.replace(/[\s\-\(\)]/g, '');
      formData.set("mobile", cleanedMobile);
    }

    if (!validateForm(formData)) {
      return;
    }

    onSubmit(e);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {currentBabysitter ? "Edit Babysitter" : "Add New Babysitter"}
        </DialogTitle>
        <DialogDescription>
          Note: No message will be sent to any babysitter you add. They are only notified if you send them a babysitting request.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ContactInfoFields
          currentBabysitter={currentBabysitter}
          mobile={mobile}
          onMobileChange={setMobile}
        />
        <PersonalInfoFields currentBabysitter={currentBabysitter} />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
          >
            {currentBabysitter ? "Update" : "Add"} Babysitter
          </button>
        </div>
      </form>
    </DialogContent>
  );
};