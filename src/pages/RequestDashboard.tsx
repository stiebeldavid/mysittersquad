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

interface Request {
  id: string;
  date: string;
  timeRange: string;
  babysitterId: string;
  babysitterName: string;
  status: string;
  createdAt: string;
  babysitterDeleted?: boolean;
}

interface GroupedRequest {
  date: string;
  timeRange: string;
  createdAt: string;
  babysitters: {
    id: string;
    name: string;
    status: string;
    deleted?: boolean;
  }[];
}

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

  const handleSortChange = (value: string | undefined) => {
    if (value) {
      setSortBy(value as "created" | "date");
    }
  };

  const groupedRequests = requests.reduce((acc: GroupedRequest[], request) => {
    const key = `${request.date}-${request.timeRange}`;
    const existingGroup = acc.find(
      (group) => group.date === request.date && group.timeRange === request.timeRange
    );

    if (existingGroup) {
      existingGroup.babysitters.push({
        id: request.babysitterId,
        name: request.babysitterName,
        status: request.status,
        deleted: request.babysitterDeleted,
      });
    } else {
      acc.push({
        date: request.date,
        timeRange: request.timeRange,
        createdAt: request.createdAt,
        babysitters: [
          {
            id: request.babysitterId,
            name: request.babysitterName,
            status: request.status,
            deleted: request.babysitterDeleted,
          },
        ],
      });
    }

    return acc;
  }, []);

  const sortedRequests = [...groupedRequests].sort((a, b) => {
    if (sortBy === "created") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
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
        
        <ToggleGroup 
          type="single" 
          value={sortBy} 
          onValueChange={handleSortChange}
          className="justify-start"
        >
          <ToggleGroupItem value="created">Sort by Created Date</ToggleGroupItem>
          <ToggleGroupItem value="date">Sort by Babysitting Date</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-4">
        {sortedRequests.map((request) => (
          <RequestCard
            key={`${request.date}-${request.timeRange}`}
            date={request.date}
            timeRange={request.timeRange}
            createdAt={request.createdAt}
            babysitters={request.babysitters}
          />
        ))}
      </div>

      {requests.length === 0 && <EmptyState />}
    </div>
  );
};

export default RequestDashboard;