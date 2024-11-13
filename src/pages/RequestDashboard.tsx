import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Request {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "declined";
  notes?: string;
}

const RequestDashboard = () => {
  const [requests] = useState<Request[]>([
    {
      id: "1",
      date: new Date(),
      startTime: "18:00",
      endTime: "22:00",
      status: "pending",
      notes: "Kids need help with bedtime routine",
    },
  ]);

  const getStatusColor = (status: Request["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "declined":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-6">Babysitting Requests</h1>

      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id} className="card-hover">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Request for {format(request.date, "MMMM d, yyyy")}</span>
                <Badge className={getStatusColor(request.status)}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{format(request.date, "EEEE, MMMM d")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>
                      {request.startTime} - {request.endTime}
                    </span>
                  </div>
                </div>
                {request.notes && (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Notes:</p>
                    <p>{request.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {requests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No babysitting requests yet.</p>
            <p className="text-gray-500">Create a new request to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDashboard;