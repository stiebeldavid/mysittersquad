import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressInputProps {
  address: string;
  onAddressChange: (address: string) => void;
}

export const AddressInput = ({ address, onAddressChange }: AddressInputProps) => {
  // In a real app, this would be fetched from the user's profile
  const homeAddress = "123 Main St, Anytown, CA 12345";

  return (
    <div className="space-y-2">
      <Label htmlFor="address">Address</Label>
      <Input
        id="address"
        value={address}
        onChange={(e) => onAddressChange(e.target.value)}
        placeholder="Enter address"
        defaultValue={homeAddress}
      />
    </div>
  );
};