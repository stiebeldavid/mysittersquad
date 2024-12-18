import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRequestByVerificationId } from "@/lib/airtable/requests";
import { ResponseForm } from "@/components/babysitter-response/ResponseForm";
import { VerificationForm } from "@/components/babysitter-response/VerificationForm";
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
          request={requestDetails}
          onSubmit={() => {}}
          isPending={false}
        />
      ) : (
        <VerificationForm
          onVerify={handleVerificationSubmit}
          isVerifying={false}
        />
      )}
    </div>
  );
};

export default BabysitterResponse;