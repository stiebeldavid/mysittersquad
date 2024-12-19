import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Babysitter } from "@/types/babysitter";
import { useState, useEffect } from "react";
import { formatPhoneWithCountryCode } from "@/utils/phoneNumber";
import { ContactInfoFields } from "./form/ContactInfoFields";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { validateBabysitterForm } from "@/utils/babysitter/validation";
import { prepareBabysitterFormData } from "@/utils/babysitter/formSubmission";

interface BabysitterFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  currentBabysitter?: Babysitter | null;
}

export const BabysitterForm = ({ onSubmit, currentBabysitter }: BabysitterFormProps) => {
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    if (currentBabysitter?.mobile) {
      const formattedMobile = formatPhoneWithCountryCode(currentBabysitter.mobile);
      if (formattedMobile) {
        setMobile(formattedMobile);
      }
    }
  }, [currentBabysitter]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    
    const preparedFormData = prepareBabysitterFormData(formData, mobile);
    
    if (!validateBabysitterForm(preparedFormData)) {
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