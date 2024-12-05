import { format, isThisYear, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RequestCardProps {
  date: string;
  timeRange: string;
  createdAt: string;
  babysitters: {
    id: string;
    name: string;
    status: string;
    deleted?: boolean;
  }[];
  notes?: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-500";
    case "declined":
      return "bg-red-500";
    case "available":
      return "bg-emerald-400";
    default:
      return "bg-yellow-500";
  }
};

export const RequestCard = ({ date, timeRange, createdAt, babysitters, notes }: RequestCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const requestDate = parseISO(date);
  const createdDate = new Date(createdAt);
  const dateFormat = isThisYear(requestDate) ? "EEEE, MMMM d" : "EEEE, MMMM d, yyyy";

  const handleConfirmBabysitter = (babysitterId: string) => {
    // TODO: Implement the API call to confirm babysitter
    toast.success("Babysitter confirmed successfully!");
    setIsModalOpen(false);
  };

  const handleCancelRequest = () => {
    // TODO: Implement the API call to cancel request
    toast.success("Request cancelled successfully!");
    setIsModalOpen(false);
  };

  return (
    <>
      <Card 
        className="card-hover text-left cursor-pointer transition-all hover:shadow-md"
        onClick={() => setIsModalOpen(true)}
      >
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <CardTitle className="text-lg font-semibold">
              {format(requestDate, dateFormat)}
            </CardTitle>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-muted-foreground tracking-wide">
                {timeRange}
              </span>
              {notes && (
                <span className="text-sm text-muted-foreground">
                  Note: {notes}
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {babysitters.map((babysitter) => (
              <div
                key={babysitter.id}
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <span>
                  {babysitter.name}
                  {babysitter.deleted && (
                    <span className="text-muted-foreground ml-1">(deleted)</span>
                  )}
                </span>
                <Badge className={getStatusColor(babysitter.status)}>
                  {babysitter.status}
                </Badge>
              </div>
            ))}
            <p className="text-sm text-muted-foreground pt-2">
              Request Created: {format(createdDate, "MMM d, yyyy")}
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Babysitting Request Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-medium">Date and Time</h3>
              <p>{format(requestDate, "EEEE, MMMM d, yyyy")}</p>
              <p className="text-muted-foreground">{timeRange}</p>
            </div>

            {notes && (
              <div className="space-y-2">
                <h3 className="font-medium">Additional Notes</h3>
                <p className="text-muted-foreground">{notes}</p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-medium">Babysitters</h3>
              {babysitters.map((babysitter) => (
                <div
                  key={babysitter.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{babysitter.name}</p>
                    <Badge className={getStatusColor(babysitter.status)}>
                      {babysitter.status}
                    </Badge>
                  </div>
                  
                  {babysitter.status.toLowerCase() === "available" && (
                    <Button
                      onClick={() => handleConfirmBabysitter(babysitter.id)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirm
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <Button
                variant="destructive"
                onClick={handleCancelRequest}
                className="w-full"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};