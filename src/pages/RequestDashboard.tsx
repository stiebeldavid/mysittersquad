import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchRequests } from "@/lib/airtable";
import { useAuthStore } from "@/store/authStore";
import { DashboardHeader } from "@/components/request/DashboardHeader";
import { SortControls } from "@/components/request/SortControls";
import { RequestList } from "@/components/request/RequestList";
import type { Request } from "@/lib/airtable/requests/types";

const getStatusPriority = (status: string): number => {
  if (!status) return 3;
  switch (status.toLowerCase()) {
    case "available":
      return 1;
    case "declined":
      return 2;
    default:
      return 3;
  }
};

const RequestDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [sortBy, setSortBy] = useState<"created" | "date">("created");

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['requests', user?.mobile],
    queryFn: () => {
      if (!user?.mobile) {
        return [];
      }
      return fetchRequests(user.mobile);
    },
    enabled: !!user?.mobile,
  });

  const groupedRequests = requests.reduce((acc: { [key: string]: any }, request: Request) => {
    if (!request.requestGroupId) {
      console.warn('Request missing requestGroupId:', request);
      return acc;
    }

    if (!acc[request.requestGroupId]) {
      acc[request.requestGroupId] = {
        requestDate: request.requestDate,
        timeRange: request.timeRange,
        createdAt: request.createdAt,
        additionalNotes: request.additionalNotes,
        babysitters: [],
      };
    }

    const fullName = `${request.babysitterFirstName} ${request.babysitterLastName}`.trim();

    acc[request.requestGroupId].babysitters.push({
      id: request.babysitterId,
      requestId: request.id,  // Add the request ID here
      name: fullName,
      status: request.status || 'Unknown',
      deleted: request.babysitterDeleted,
    });

    // Sort babysitters by status priority
    acc[request.requestGroupId].babysitters.sort((a, b) => 
      getStatusPriority(a.status) - getStatusPriority(b.status)
    );

    return acc;
  }, {});

  if (isLoading) {
    return <div className="page-container">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="flex flex-col gap-6 mb-8">
        <DashboardHeader />
        <SortControls 
          sortBy={sortBy} 
          onSortChange={setSortBy} 
        />
      </div>

      <RequestList 
        groupedRequests={groupedRequests}
        sortBy={sortBy}
      />
    </div>
  );
};

export default RequestDashboard;