import { Input } from "@/components/ui/input";
import { PhoneNumberInput } from "@/components/ui/phone-input";

interface ContactInfoFieldsProps {
  currentBabysitter?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  mobile: string;
  onMobileChange: (value: string) => void;
}

export const ContactInfoFields = ({ currentBabysitter, mobile, onMobileChange }: ContactInfoFieldsProps) => {
  return (
    <>
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
            onChange={(value) => onMobileChange(value || "")}
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
    </>
  );
};