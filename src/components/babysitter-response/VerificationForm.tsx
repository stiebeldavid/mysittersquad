import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { formatPhoneWithCountryCode } from "@/utils/phoneNumber";

interface VerificationFormProps {
  onVerify: (mobile: string, isEmail?: boolean) => void;
  isVerifying: boolean;
}

export const VerificationForm = ({ onVerify, isVerifying }: VerificationFormProps) => {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedMobile = formatPhoneWithCountryCode(mobile);
    onVerify(formattedMobile);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(email.toLowerCase(), true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Your Identity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form onSubmit={handleMobileSubmit} className="space-y-4">
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
              {isVerifying ? "Verifying..." : "Verify using Mobile Number"}
            </Button>
          </form>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <Button type="submit" disabled={isVerifying}>
              {isVerifying ? "Verifying..." : "Verify using Email"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};