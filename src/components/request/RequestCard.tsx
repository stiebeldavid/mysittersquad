import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { updateBabysitterResponse } from "@/lib/airtable/requests";
import { useToast } from "@/components/ui/use-toast";
import { RequestHeader } from "./RequestHeader";
import { BabysitterListItem } from "./BabysitterListItem";
import { ConfirmationDialog } from "./ConfirmationDialog";

interface RequestCardProps {
  date: string;
  timeRange: string;
  createdAt: string;
  babysitters: {
    id: string;
    requestId: string;
    name: string;
    status: string;
    deleted?: boolean;
  }[];
  notes?: string;
}

export const RequestCard = ({ 
  date, 
  timeRange, 
  createdAt, 
  babysitters: initialBabysitters, 
  notes 
}: RequestCardProps) => {
  const [babysitters, setBabysitters] = useState(initialBabysitters);
  const [selectedBabysitter, setSelectedBabysitter] = useState<{
    id: string;
    requestId: string;
    name: string;
    action: "confirm" | "cancel";
  } | null>(null);
  const { toast } = useToast();

  const handleAction = async () => {
    if (!selectedBabysitter) return;

    try {
      const newStatus = selectedBabysitter.action === "confirm" ? "Parent Confirmed" : "Parent Cancelled";
      await updateBabysitterResponse(selectedBabysitter.requestId, {
        status: newStatus,
        response: newStatus, // Add this line to satisfy the type requirement
      });

      // Update the local state immediately
      setBabysitters(prev => prev.map(babysitter => 
        babysitter.id === selectedBabysitter.id 
          ? { ...babysitter, status: newStatus }
          : babysitter
      ));

      toast({
        title: "Success",
        description: `Request ${selectedBabysitter.action}ed for ${selectedBabysitter.name}`,
      });

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

  const createdAtDate = createdAt ? parseISO(createdAt) : new Date();

  return (
    <>
      <Card className="card-hover text-left">
        <CardHeader className="pb-2">
          <RequestHeader 
            date={date}
            timeRange={timeRange}
            notes={notes}
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {babysitters.map((babysitter) => (
              <BabysitterListItem
                key={babysitter.id}
                {...babysitter}
                onAction={(requestId, id, name, action) => 
                  setSelectedBabysitter({ id, requestId, name, action })
                }
              />
            ))}
            <p className="text-sm text-muted-foreground pt-2">
              Created: {format(createdAtDate, "MMMM dd, yyyy hh:mm a")}
            </p>
          </div>
        </CardContent>
      </Card>

      {selectedBabysitter && (
        <ConfirmationDialog
          isOpen={!!selectedBabysitter}
          onClose={() => setSelectedBabysitter(null)}
          onConfirm={handleAction}
          action={selectedBabysitter.action}
          babysitterName={selectedBabysitter.name}
        />
      )}
    </>
  );
};