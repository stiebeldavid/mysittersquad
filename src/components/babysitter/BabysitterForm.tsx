import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { Babysitter } from "@/types/babysitter";
import { useState } from "react";

interface BabysitterFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  currentBabysitter: Babysitter | null;
}

export const BabysitterForm = ({ onSubmit, currentBabysitter }: BabysitterFormProps) => {
  const [mobile, setMobile] = useState(currentBabysitter?.mobile || "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number</Label>
          <PhoneNumberInput
            id="mobile"
            name="mobile"
            value={mobile}
            onChange={(value) => setMobile(value || "")}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
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