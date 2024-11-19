import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface AddressInputProps {
  address: string;
  onAddressChange: (address: string) => void;
}

export const AddressInput = ({ address, onAddressChange }: AddressInputProps) => {
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleAddressChange = () => {
    const fullAddress = `${streetAddress}, ${city}, ${state} ${zipCode}`;
    onAddressChange(fullAddress);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="streetAddress">Street Address</Label>
        <Input
          id="streetAddress"
          value={streetAddress}
          onChange={(e) => {
            setStreetAddress(e.target.value);
            handleAddressChange();
          }}
          placeholder="Enter street address"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            handleAddressChange();
          }}
          placeholder="Enter city"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            handleAddressChange();
          }}
          placeholder="Enter state"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="zipCode">Zip Code</Label>
        <Input
          id="zipCode"
          value={zipCode}
          onChange={(e) => {
            setZipCode(e.target.value);
            handleAddressChange();
          }}
          placeholder="Enter zip code"
        />
      </div>
    </div>
  );
};