import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { useState } from "react";
import { updateUserAddress } from "@/lib/airtable";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";

interface FamilyAddressProps {
  address: string;
  onAddressChange: (address: string) => void;
}

export const FamilyAddress = ({ address, onAddressChange }: FamilyAddressProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("California");
  const [zipCode, setZipCode] = useState("");
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);

  const handleSave = async () => {
    try {
      if (!user?.mobile) {
        throw new Error("User mobile not found");
      }

      await updateUserAddress(user.mobile, streetAddress, city, state, zipCode);
      
      const fullAddress = `${streetAddress}, ${city}, ${state} ${zipCode}`;
      onAddressChange(fullAddress);
      setIsEditing(false);
      
      toast({
        title: "Address Updated",
        description: "Your home address has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update address. Please try again.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Home Address</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input
                id="streetAddress"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="Enter street address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Enter state"
                readOnly
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter zip code"
              />
            </div>
            
            <Button onClick={handleSave}>Save Address</Button>
          </div>
        ) : (
          <p className="text-sm">{address}</p>
        )}
      </CardContent>
    </Card>
  );
};