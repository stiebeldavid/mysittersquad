import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PhoneNumberInput } from "@/components/ui/phone-input";

interface VerificationFormProps {
  onVerify: (mobile: string) => void;
  isVerifying: boolean;
}

export const VerificationForm = ({ onVerify, isVerifying }: VerificationFormProps) => {
  const [mobile, setMobile] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(mobile);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Your Mobile Number</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <PhoneNumberInput
              id="mobile"
              value={mobile}
              onChange={(value) => setMobile(value || "")}
              placeholder="Enter your mobile number"
            />
          </div>
          <Button type="submit" disabled={isVerifying}>
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};