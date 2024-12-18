import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { fetchRequests } from "@/lib/airtable";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { RequestCard } from "@/components/request/RequestCard";
import { EmptyState } from "@/components/request/EmptyState";
import { format, parseISO } from "date-fns";
import type { Request, GroupedRequest } from "@/lib/airtable/requests/types";

const getStatusPriority = (status: string | undefined): number => {
  if (!status) return 3; // Default priority for undefined status
  
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

  const { data: requests = [], isLoading } = useQuery<Request[]>({
    queryKey: ['requests', user?.mobile],
    queryFn: () => {
      if (!user?.mobile) {
        return [];
      }
      return fetchRequests(user.mobile);
    },
    enabled: !!user?.mobile,
  });

  const handleSortChange = (value: string | undefined) => {
    if (value) {
      setSortBy(value as "created" | "date");
    }
  };

  // Group requests by unique combination of date and time range
  const groupedRequests = requests.reduce((acc: { [key: string]: GroupedRequest }, request: Request) => {
    const key = `${request["Request Date"]}-${request["Time Range"]}`;

    if (!acc[key]) {
      acc[key] = {
        requestDate: request["Request Date"],
        timeRange: request["Time Range"],
        createdAt: request["Created At"],
        additionalNotes: request["Additional Notes"],
        babysitters: [],
      };
    }

    acc[key].babysitters.push({
      id: request["Babysitter ID"],
      name: `${request["First Name (from Babysitter)"]} ${request["Last Name (from Babysitter)"]}`,
      status: request["Status"] || "Unknown", // Provide a default status if undefined
      deleted: request["Babysitter Deleted"],
    });

    // Sort babysitters by status priority
    acc[key].babysitters.sort((a, b) => 
      getStatusPriority(a.status) - getStatusPriority(b.status)
    );

    return acc;
  }, {});

  const sortedRequests = Object.values(groupedRequests).sort((a, b) => {
    if (sortBy === "created") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
  });

  if (isLoading) {
    return <div className="page-container">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">My Requests</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Sort by</span>
          <ToggleGroup 
            type="single" 
            value={sortBy} 
            onValueChange={handleSortChange}
            className="border rounded-lg p-1 bg-muted/10"
          >
            <ToggleGroupItem 
              value="created" 
              variant="outline" 
              className="text-muted-foreground data-[state=on]:bg-secondary/50 data-[state=on]:border-b-2 data-[state=on]:border-primary/50 data-[state=on]:font-medium data-[state=on]:text-primary"
            >
              Created Date
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="date" 
              variant="outline" 
              className="text-muted-foreground data-[state=on]:bg-secondary/50 data-[state=on]:border-b-2 data-[state=on]:border-primary/50 data-[state=on]:font-medium data-[state=on]:text-primary"
            >
              Babysitting Date
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="space-y-4">
        {sortedRequests.map((request) => (
          <RequestCard
            key={`${request.requestDate}-${request.timeRange}`}
            date={request.requestDate}
            timeRange={request.timeRange}
            createdAt={format(parseISO(request.createdAt), "PPpp")}
            babysitters={request.babysitters}
            notes={request.additionalNotes}
          />
        ))}
      </div>

      {requests.length === 0 && <EmptyState />}
    </div>
  );
};

export default RequestDashboard;