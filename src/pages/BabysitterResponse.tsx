import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRequestByVerificationId } from "@/lib/airtable/requests";
import { ResponseForm } from "@/components/request/ResponseForm";
import { VerificationForm } from "@/components/request/VerificationForm";
import type { RequestDetails } from "@/lib/airtable/requests/types";

const BabysitterResponse = () => {
  const [verificationId, setVerificationId] = useState<string>("");
  const { data: requestDetails, isLoading, error } = useQuery<RequestDetails | null>({
    queryKey: ["request", verificationId],
    queryFn: () => fetchRequestByVerificationId(verificationId),
    enabled: !!verificationId,
  });

  const handleVerificationSubmit = (id: string) => {
    setVerificationId(id);
  };

  return (
    <div className="page-container">
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading request</div>
      ) : requestDetails ? (
        <ResponseForm
          requestDate={requestDetails.requestDate}
          timeRange={requestDetails.timeRange}
          additionalNotes={requestDetails.additionalNotes}
          babysitterName={requestDetails.babysitterFirstName}
          parentName={requestDetails.parent ? `${requestDetails.parent.firstName} ${requestDetails.parent.lastName}` : ''}
          verificationId={requestDetails.verificationId}
        />
      ) : (
        <VerificationForm onSubmit={handleVerificationSubmit} />
      )}
    </div>
  );
};

export default BabysitterResponse;