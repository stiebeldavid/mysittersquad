import { RequestCard } from "./RequestCard";
import { EmptyState } from "./EmptyState";
import { Request } from "@/lib/airtable/requests/types";

interface GroupedRequest {
  requestDate: string;
  timeRange: string;
  createdAt: string;
  additionalNotes?: string;
  babysitters: {
    id: string;
    name: string;
    status: string;
    deleted?: boolean;
  }[];
}

interface RequestListProps {
  groupedRequests: Record<string, GroupedRequest>;
  sortBy: "created" | "date";
}

export const RequestList = ({ groupedRequests, sortBy }: RequestListProps) => {
  const sortedRequests = Object.values(groupedRequests).sort((a, b) => {
    if (sortBy === "created") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
  });

  if (sortedRequests.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {sortedRequests.map((request) => (
        <RequestCard
          key={`${request.requestDate}-${request.timeRange}`}
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