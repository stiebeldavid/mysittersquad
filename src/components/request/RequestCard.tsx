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
    response?: string;
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
      <Card className="card-hover text-left">
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
                className="flex flex-col gap-2 py-2 border-b last:border-0"
              >
                <div className="flex justify-between items-center">
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
                
                {babysitter.response && (
                  <div className="text-sm text-muted-foreground pl-4 border-l-2 border-muted my-1">
                    "{babysitter.response}"
                  </div>
                )}
                
                {babysitter.status.toLowerCase() === "available" && (
                  <Button
                    onClick={() => handleConfirmBabysitter(babysitter.id)}
                    size="sm"
                    className="w-24 ml-auto"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm
                  </Button>
                )}
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
            <DialogTitle>Cancel Request</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p>Are you sure you want to cancel this request for all babysitters?</p>
            <Button
              variant="destructive"
              onClick={handleCancelRequest}
              className="w-full"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};