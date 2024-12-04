import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { Babysitter } from "@/types/babysitter";
import { useState, useEffect } from "react";
import { formatPhoneWithCountryCode, validatePhoneNumber } from "@/utils/phoneNumber";
import { useToast } from "@/components/ui/use-toast";

interface BabysitterFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  currentBabysitter: Babysitter | null;
}

export const BabysitterForm = ({ onSubmit, currentBabysitter }: BabysitterFormProps) => {
  const [mobile, setMobile] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (currentBabysitter?.mobile) {
      setMobile(formatPhoneWithCountryCode(currentBabysitter.mobile));
    } else {
      setMobile("");
    }
  }, [currentBabysitter]);

  const validateForm = (formData: FormData): boolean => {
    const email = formData.get("email") as string;
    const mobileNumber = mobile;

    // Check if both are empty
    if (!email && !mobileNumber) {
      toast({
        title: "Validation Error",
        description: "Either Mobile Number or Email is required",
        variant: "destructive",
      });
      return false;
    }

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    // Validate mobile if provided
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
    formData.set("mobile", mobile);

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
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={currentBabysitter?.firstName}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
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
            <Label htmlFor="mobile">Mobile Number</Label>
            <PhoneNumberInput
              id="mobile"
              name="mobile"
              value={mobile}
              onChange={(value) => setMobile(value || "")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={currentBabysitter?.email}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="text"
              defaultValue={currentBabysitter?.age}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Input
              id="grade"
              name="grade"
              type="text"
              defaultValue={currentBabysitter?.grade}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate">Hourly rate (USD)</Label>
            <Input
              id="rate"
              name="rate"
              type="text"
              defaultValue={currentBabysitter?.rate}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialties">Specialties</Label>
          <Input
            id="specialties"
            name="specialties"
            defaultValue={currentBabysitter?.specialties}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            name="notes"
            defaultValue={currentBabysitter?.notes}
          />
        </div>
        <Button type="submit" className="w-full">
          {currentBabysitter ? "Update" : "Add"} Babysitter
        </Button>
      </form>
    </DialogContent>
  );
};