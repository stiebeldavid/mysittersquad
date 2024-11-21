import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { formatPhoneWithCountryCode } from "@/utils/phoneNumber";

interface VerificationFormProps {
  onVerify: (mobile: string, email: string) => void;
  isVerifying: boolean;
}

export const VerificationForm = ({ onVerify, isVerifying }: VerificationFormProps) => {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedMobile = mobile ? formatPhoneWithCountryCode(mobile) : "";
    const formattedEmail = email ? email.toLowerCase() : "";
    onVerify(formattedMobile, formattedEmail);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Your Identity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <PhoneNumberInput
                id="mobile"
                value={mobile}
                onChange={(value) => setMobile(value || "")}
                placeholder="Enter your mobile number"
              />
            </div>
            <div className="flex items-center justify-center pt-6">
              <span className="text-sm text-muted-foreground">or</span>
            </div>
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
          </div>
          <Button type="submit" disabled={isVerifying || (!mobile && !email)}>
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};