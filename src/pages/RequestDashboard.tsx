import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchRequests } from "@/lib/airtable";
import { useAuthStore } from "@/store/authStore";

interface Request {
  id: string;
  date: string;
  timeRange: string;
  babysitterId: string;
  babysitterName: string;
  status: string;
}

interface GroupedRequest {
  date: string;
  timeRange: string;
  babysitters: {
    id: string;
    name: string;
    status: string;
  }[];
}

const RequestDashboard = () => {
  const user = useAuthStore((state) => state.user);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['requests', user?.mobile],
    queryFn: () => fetchRequests(user?.mobile || ''),
    enabled: !!user?.mobile,
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500";
      case "declined":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  // Group requests by date and time range
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
      });
    } else {
      acc.push({
        date: request.date,
        timeRange: request.timeRange,
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

  // Sort requests in reverse chronological order
  const sortedRequests = groupedRequests.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (isLoading) {
    return <div className="page-container">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Babysitting Requests</h1>
        </div>
      </div>

      <div className="space-y-4">
        {sortedRequests.map((groupedRequest) => (
          <Card key={`${groupedRequest.date}-${groupedRequest.timeRange}`} className="card-hover">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{format(new Date(groupedRequest.date), "MMMM d, yyyy")}</span>
                <span className="text-sm font-normal text-gray-600">
                  {groupedRequest.timeRange}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {groupedRequest.babysitters.map((babysitter) => (
                  <div
                    key={babysitter.id}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <span>{babysitter.name}</span>
                    <Badge className={getStatusColor(babysitter.status)}>
                      {babysitter.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No babysitting requests yet.</p>
          <p className="text-gray-500">Create a new request to get started!</p>
        </div>
      )}
    </div>
  );
};

export default RequestDashboard;