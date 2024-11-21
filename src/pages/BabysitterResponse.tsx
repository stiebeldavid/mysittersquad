import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { verifyBabysitterRequest, updateBabysitterResponse } from "@/lib/airtable";

const VerificationForm = ({ onVerify, isVerifying }: { onVerify: (mobile: string) => void, isVerifying: boolean }) => {
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

const ResponseForm = ({ request, onSubmit, isPending }: { 
  request: any, 
  onSubmit: (response: string, comments: string) => void,
  isPending: boolean 
}) => {
  const [response, setResponse] = useState<"yes" | "no" | null>(null);
  const [comments, setComments] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!response) {
      toast.error("Please select a response");
      return;
    }
    onSubmit(response, comments);
  };

  return (
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

      <Button type="submit" disabled={isPending}>
        Send Response
      </Button>
    </form>
  );
};

const SuccessMessage = ({ parent }: { parent: any }) => (
  <Card>
    <CardContent className="p-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-green-600">Thanks for your response!</h2>
        <p className="text-lg">
          {parent.firstName} {parent.lastName} has been notified.
        </p>
        <p className="text-gray-600">You can close this page now.</p>
      </div>
    </CardContent>
  </Card>
);

const BabysitterResponse = () => {
  const { requestId } = useParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [verifiedMobile, setVerifiedMobile] = useState("");

  const { data: request, refetch } = useQuery({
    queryKey: ["request", requestId, verifiedMobile],
    queryFn: () => verifyBabysitterRequest(requestId || "", verifiedMobile),
    enabled: false, // Disable the query by default
  });

  const mutation = useMutation({
    mutationFn: ({ response, comments }: { response: string, comments: string }) => {
      if (!request?.id) return Promise.reject("Invalid data");
      return updateBabysitterResponse(request.id, {
        status: response === "yes" ? "Available" : "Declined",
        response: `${response === "yes" ? "Yes, I can babysit then" : "No, I am not available then"}${
          comments ? `. ${comments}` : ""
        }`,
      });
    },
    onSuccess: () => {
      toast.success("Response submitted successfully!");
      setIsSubmitted(true);
    },
    onError: () => {
      toast.error("Failed to submit response. Please try again.");
    },
  });

  const handleVerify = async (mobile: string) => {
    try {
      setIsVerifying(true);
      setVerifiedMobile(mobile);
      const result = await refetch();
      
      if (!result.data) {
        toast.error("Could not find that babysitting request");
      }
    } catch (error) {
      toast.error("Invalid mobile number format");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (response: string, comments: string) => {
    mutation.mutate({ response, comments });
  };

  if (isLoading || isVerifying) {
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

  return (
    <div className="container max-w-2xl mx-auto p-4">
      {isSubmitted && request?.parent ? (
        <SuccessMessage parent={request.parent} />
      ) : !request ? (
        <VerificationForm onVerify={handleVerify} isVerifying={isVerifying} />
      ) : (
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center">
                Welcome {request.babysitterFirstName}!
              </h2>
              {request.parent && (
                <p className="text-lg text-center text-muted-foreground">
                  {request.parent.firstName} {request.parent.lastName} sent you a Babysitting Request
                </p>
              )}
              <CardTitle>Babysitting Request Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-medium">Date and Time</h3>
              <p>{format(parseISO(request.date), "EEEE, MMMM d, yyyy")}</p>
              <p>{request.timeRange}</p>
              {request.notes && (
                <div className="mt-4">
                  <h3 className="font-medium">Additional Notes</h3>
                  <p className="text-muted-foreground">{request.notes}</p>
                </div>
              )}
            </div>
            <ResponseForm 
              request={request}
              onSubmit={handleSubmit}
              isPending={mutation.isPending}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BabysitterResponse;
