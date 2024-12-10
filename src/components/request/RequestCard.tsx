import { format, isThisYear, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { updateBabysitterResponse } from "@/lib/airtable/requests";
import { useToast } from "@/components/ui/use-toast";

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
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-yellow-500";
  }
};

export const RequestCard = ({ date, timeRange, createdAt, babysitters, notes }: RequestCardProps) => {
  const [selectedBabysitter, setSelectedBabysitter] = useState<{
    id: string;
    name: string;
    action: "confirm" | "cancel";
  } | null>(null);
  const { toast } = useToast();
  const requestDate = parseISO(date);
  const createdDate = new Date(createdAt);
  const dateFormat = isThisYear(requestDate) ? "EEEE, MMMM d" : "EEEE, MMMM d, yyyy";

  const handleAction = async () => {
    if (!selectedBabysitter) return;

    try {
      const newStatus = selectedBabysitter.action === "confirm" ? "Confirmed" : "Cancelled";
      await updateBabysitterResponse(selectedBabysitter.id, {
        status: newStatus,
        response: `Parent ${newStatus.toLowerCase()} the request`,
      });

      toast({
        title: "Success",
        description: `Request ${newStatus.toLowerCase()} for ${selectedBabysitter.name}`,
      });

      // Update the local state to reflect the change
      const updatedBabysitters = babysitters.map(b => 
        b.id === selectedBabysitter.id ? { ...b, status: newStatus } : b
      );
      
      // Close the dialog
      setSelectedBabysitter(null);
    } catch (error) {
      console.error("Error updating request:", error);
      toast({
        title: "Error",
        description: "Failed to update the request. Please try again.",
        variant: "destructive",
      });
    }
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
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  {babysitter.status.toLowerCase() !== "confirmed" && 
                   babysitter.status.toLowerCase() !== "cancelled" && (
                    <>
                      <button
                        onClick={() => setSelectedBabysitter({
                          id: babysitter.id,
                          name: babysitter.name,
                          action: "confirm"
                        })}
                        className="text-green-600 hover:text-green-700 transition-colors"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setSelectedBabysitter({
                          id: babysitter.id,
                          name: babysitter.name,
                          action: "cancel"
                        })}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  <span>
                    {babysitter.name}
                    {babysitter.deleted && (
                      <span className="text-muted-foreground ml-1">(deleted)</span>
                    )}
                  </span>
                </div>
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

      <AlertDialog open={!!selectedBabysitter} onOpenChange={() => setSelectedBabysitter(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedBabysitter?.action === "confirm" ? "Confirm" : "Cancel"} Request
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {selectedBabysitter?.action === "confirm" ? "confirm" : "cancel"} the request for {selectedBabysitter?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>
              {selectedBabysitter?.action === "confirm" ? "Confirm" : "Cancel"} Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};