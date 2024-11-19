import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { fetchRequests } from "@/lib/airtable";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RequestCard } from "@/components/request/RequestCard";
import { Request, GroupedRequest } from "@/types/request";

const RequestDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [sortBy, setSortBy] = useState<"created" | "date">("created");

  const { data: requests = [], isLoading, error } = useQuery({
    queryKey: ['requests', user?.mobile],
    queryFn: () => {
      if (!user?.mobile) {
        throw new Error('No mobile number available');
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

  const groupedRequests = requests.reduce((acc: GroupedRequest[], request: Request) => {
    const key = `${request.date}-${request.timeRange}`;
    const existingGroup = acc.find(
      (group) => group.date === request.date && group.timeRange === request.timeRange
    );

    if (existingGroup) {
      existingGroup.babysitters.push({
        id: request.babysitterId,
        name: request.babysitterName,
        status: request.status,
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

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">Error loading requests. Please try again later.</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-4">
          {sortedRequests.map((groupedRequest) => (
            <RequestCard 
              key={`${groupedRequest.date}-${groupedRequest.timeRange}`}
              groupedRequest={groupedRequest}
            />
          ))}
        </div>
      )}

      {!isLoading && !error && requests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No babysitting requests yet.</p>
          <p className="text-gray-500">Create a new request to get started!</p>
        </div>
      )}
    </div>
  );
};

export default RequestDashboard;