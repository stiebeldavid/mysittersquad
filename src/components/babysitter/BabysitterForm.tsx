import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { Babysitter } from "@/types/babysitter";
import { useState, useEffect } from "react";
import { formatPhoneWithCountryCode } from "@/utils/phoneNumber";
import { useToast } from "@/components/ui/use-toast";

interface BabysitterFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  currentBabysitter: Babysitter | null;
}

export const BabysitterForm = ({ onSubmit, currentBabysitter }: BabysitterFormProps) => {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState(currentBabysitter?.email || "");
  const { toast } = useToast();

  useEffect(() => {
    if (currentBabysitter?.mobile) {
      setMobile(formatPhoneWithCountryCode(currentBabysitter.mobile));
    } else {
      setMobile("");
    }
    setEmail(currentBabysitter?.email || "");
  }, [currentBabysitter]);

  const validateEmail = (email: string) => {
    return email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateMobile = (mobile: string) => {
    return mobile === "" || mobile.replace(/\D/g, '').length >= 10;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const emailValid = validateEmail(email);
    const mobileValid = validateMobile(mobile);

    // Check if at least one field is filled and valid
    if ((!email && !mobile) || (!emailValid && !mobileValid)) {
      toast({
        title: "Validation Error",
        description: "Please provide either a valid mobile number or email address",
        variant: "destructive",
      });
      return;
    }

    if (!emailValid) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!mobileValid) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid mobile number",
        variant: "destructive",
      });
      return;
    }

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    formData.set("mobile", mobile);
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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