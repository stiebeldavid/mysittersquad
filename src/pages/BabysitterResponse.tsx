import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { formatPhoneWithCountryCode } from "@/utils/phoneNumber";
import { verifyBabysitterRequest, updateBabysitterResponse } from "@/lib/airtable";

const BabysitterResponse = () => {
  const { requestId } = useParams();
  const [mobile, setMobile] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [response, setResponse] = useState<"yes" | "no" | null>(null);
  const [comments, setComments] = useState("");

  const { data: request, isLoading } = useQuery({
    queryKey: ["request", requestId, mobile],
    queryFn: () => verifyBabysitterRequest(requestId || "", mobile),
    enabled: !!requestId && !!mobile,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: () => {
      if (!requestId || !response) return Promise.reject("Invalid data");
      return updateBabysitterResponse(requestId, {
        status: response === "yes" ? "Available" : "Declined",
        response: `${response === "yes" ? "Yes, I can babysit then" : "No, I am not available then"}${
          comments ? `. ${comments}` : ""
        }`,
      });
    },
    onSuccess: () => {
      toast.success("Response submitted successfully!");
    },
    onError: () => {
      toast.error("Failed to submit response. Please try again.");
    },
  });

  const handleVerify = async () => {
    if (!mobile) {
      toast.error("Please enter your mobile number");
      return;
    }
    
    try {
      const formattedMobile = formatPhoneWithCountryCode(mobile);
      setMobile(formattedMobile);
      setIsVerified(true);
    } catch (error) {
      toast.error("Invalid mobile number format");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!response) {
      toast.error("Please select a response");
      return;
    }
    mutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Verify Your Mobile Number</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <Button onClick={handleVerify}>Verify</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              Request not found or mobile number doesn't match our records.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Babysitting Request Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Date and Time</h3>
            <p>{format(parseISO(request.date), "EEEE, MMMM d, yyyy")}</p>
            <p>{request.timeRange}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>Are you available?</Label>
              <RadioGroup
                value={response || ""}
                onValueChange={(value) => setResponse(value as "yes" | "no")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes, I can babysit then</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No, I am not available then</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Additional Comments (Optional)</Label>
              <Textarea
                id="comments"
                placeholder="Add any additional comments here..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={mutation.isPending}>
              Send Response
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BabysitterResponse;