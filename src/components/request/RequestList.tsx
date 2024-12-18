import { RequestCard } from "./RequestCard";
import { EmptyState } from "./EmptyState";
import { Request } from "@/lib/airtable/requests/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, CheckCircle2, XCircle } from "lucide-react";

interface GroupedRequest {
  requestDate: string;
  timeRange: string;
  createdAt: string;
  additionalNotes?: string;
  babysitters: {
    id: string;
    requestId: string;
    name: string;
    status: string;
    deleted?: boolean;
  }[];
}

interface RequestListProps {
  groupedRequests: Record<string, GroupedRequest>;
  sortBy: "created" | "date";
}

const getStatusPriority = (status: string): number => {
  if (!status) return 4;
  switch (status.toLowerCase()) {
    case "parent confirmed":
      return 0;
    case "available":
      return 1;
    case "declined":
      return 2;
    default:
      return 3;
  }
};

export const RequestList = ({ groupedRequests, sortBy }: RequestListProps) => {
  const sortedRequests = Object.entries(groupedRequests).sort(([, a], [, b]) => {
    if (sortBy === "created") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
  });

  // Sort babysitters within each request
  const sortedRequestsWithSortedBabysitters = sortedRequests.map(([groupId, request]) => {
    const sortedBabysitters = [...request.babysitters].sort(
      (a, b) => getStatusPriority(a.status) - getStatusPriority(b.status)
    );

    return [groupId, { ...request, babysitters: sortedBabysitters }] as [string, GroupedRequest];
  });

  if (sortedRequestsWithSortedBabysitters.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <Alert variant="default" className="bg-muted border-muted-foreground/20">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Click ✅ to confirm a babysitter, or click ❌ to cancel. The babysitter will be notified of your decision.
        </AlertDescription>
      </Alert>

      {sortedRequestsWithSortedBabysitters.map(([groupId, request]) => (
        <RequestCard
          key={groupId}
          date={request.requestDate}
          timeRange={request.timeRange}
          createdAt={request.createdAt}
          babysitters={request.babysitters}
          notes={request.additionalNotes}
        />
      ))}
    </div>
  );
};