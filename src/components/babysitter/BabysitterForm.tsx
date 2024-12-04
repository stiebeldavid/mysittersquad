import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { Babysitter } from "@/types/babysitter";
import { useState, useEffect } from "react";
import { formatPhoneWithCountryCode, validatePhoneNumber } from "@/utils/phoneNumber";
import { useToast } from "@/components/ui/use-toast";

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
    
    // Only set mobile in formData if it's not empty
    if (mobile) {
      formData.set("mobile", mobile);
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
          Fill in the babysitter's information below. Either mobile number or email is required.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName">First Name</label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={currentBabysitter?.firstName}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName">Last Name</label>
            <Input
              id="lastName"
              name="lastName"
              defaultValue={currentBabysitter?.lastName}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="mobile">Mobile Number</label>
            <PhoneNumberInput
              id="mobile"
              name="mobile"
              value={mobile}
              onChange={(value) => setMobile(value || "")}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={currentBabysitter?.email}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="age">Age</label>
            <Input
              id="age"
              name="age"
              type="number"
              defaultValue={currentBabysitter?.age}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="grade">Grade/Year</label>
            <Input
              id="grade"
              name="grade"
              defaultValue={currentBabysitter?.grade}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="rate">Rate ($/hr)</label>
          <Input
            id="rate"
            name="rate"
            type="number"
            step="0.01"
            defaultValue={currentBabysitter?.rate}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="specialties">Specialties</label>
          <Input
            id="specialties"
            name="specialties"
            defaultValue={currentBabysitter?.specialties}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="notes">Notes</label>
          <Input
            id="notes"
            name="notes"
            defaultValue={currentBabysitter?.notes}
          />
        </div>
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