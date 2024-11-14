import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { useState } from "react";

interface FamilyAddressProps {
  address: string;
  onAddressChange: (address: string) => void;
}

export const FamilyAddress = ({ address, onAddressChange }: FamilyAddressProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempAddress, setTempAddress] = useState(address);

  const handleSave = () => {
    onAddressChange(tempAddress);
    setIsEditing(false);
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
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
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