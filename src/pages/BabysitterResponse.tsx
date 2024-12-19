import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { fetchRequestByVerificationId, updateBabysitterResponse } from "@/lib/airtable";
import { ResponseForm } from "@/components/babysitter-response/ResponseForm";
import { SuccessMessage } from "@/components/babysitter-response/SuccessMessage";

const BabysitterResponse = () => {
  const { requestId } = useParams();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: request, isLoading, error } = useQuery({
    queryKey: ['request', requestId],
    queryFn: () => fetchRequestByVerificationId(requestId || ''),
    enabled: !!requestId,
  });

  const mutation = useMutation({
    mutationFn: ({ response, comments }: { response: string; comments: string }) => {
      if (!request?.recordId) return Promise.reject("Invalid data");
      
      // Determine status based on response
      let status;
      if (response === "Yes, I can babysit then") {
        status = "Available";
      } else if (response === "No, I am not available then") {
        status = "Declined";
      } else {
        status = "Received Comment";
      }

      return updateBabysitterResponse(request.recordId, {
        status,
        response: response ? `${response}${comments ? `. ${comments}` : ''}` : comments,
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

  const handleSubmit = (response: string, comments: string) => {
    mutation.mutate({ response, comments });
  };

  if (!requestId) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-red-600">Invalid Request</h2>
              <p className="text-lg">Sorry, we could not find that Babysitting Request.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  if (error || !request) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-red-600">Request Not Found</h2>
              <p className="text-lg">Sorry, we could not find that Babysitting Request.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4">
      {isSubmitted && request?.parent ? (
        <SuccessMessage parent={request.parent} />
      ) : (
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center">
                Welcome {request?.babysitterFirstName}!
              </h2>
              {request?.parent && (
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
              <p>{format(parseISO(request?.date || ''), "EEEE, MMMM d, yyyy")}</p>
              <p>{request?.timeRange}</p>
              {request?.notes && (
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