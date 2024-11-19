import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchRequests } from "@/lib/airtable";
import { useAuthStore } from "@/store/authStore";

interface Request {
  id: string;
  date: string;
  timeRange: string;
  babysitterId: string;
  status: string;
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

  const groupedRequests = requests.reduce((acc: Record<string, Request[]>, request) => {
    if (!acc[request.status]) {
      acc[request.status] = [];
    }
    acc[request.status].push(request);
    return acc;
  }, {});

  if (isLoading) {
    return <div className="page-container">Loading...</div>;
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-6">Babysitting Requests</h1>

      {Object.entries(groupedRequests).map(([status, statusRequests]) => (
        <div key={status} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{status}</h2>
          <div className="space-y-4">
            {statusRequests.map((request) => (
              <Card key={request.id} className="card-hover">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Request for {format(new Date(request.date), "MMMM d, yyyy")}</span>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{format(new Date(request.date), "EEEE, MMMM d")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{request.timeRange}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

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