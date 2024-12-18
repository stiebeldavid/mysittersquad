import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface BabysitterListItemProps {
  id: string;
  name: string;
  status: string;
  deleted?: boolean;
  onAction?: (id: string, name: string, action: "confirm" | "cancel") => void;
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

export const BabysitterListItem = ({
  id,
  name,
  status,
  deleted,
  onAction,
}: BabysitterListItemProps) => {
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-0">
      <div className="flex items-center gap-3">
        {status.toLowerCase() !== "confirmed" && 
         status.toLowerCase() !== "cancelled" && onAction && (
          <>
            <button
              onClick={() => onAction(id, name, "confirm")}
              className="text-green-600 hover:text-green-700 transition-colors"
            >
              <CheckCircle className="h-5 w-5" />
            </button>
            <button
              onClick={() => onAction(id, name, "cancel")}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </>
        )}
        <span>
          {name}
          {deleted && (
            <span className="text-muted-foreground ml-1">(deleted)</span>
          )}
        </span>
      </div>
      <Badge className={getStatusColor(status)}>
        {status}
      </Badge>
    </div>
  );
};