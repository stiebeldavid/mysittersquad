import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface BabysitterListItemProps {
  id: string;
  requestId: string;
  name: string;
  status: string;
  deleted?: boolean;
  onAction?: (requestId: string, id: string, name: string, action: "confirm" | "cancel") => void;
}

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "parent confirmed":
      return "bg-green-500 text-white";
    case "parent cancelled":
      return "bg-red-500 text-white";
    case "available":
      return "bg-emerald-400";
    case "declined":
      return "bg-red-500";
    default:
      return "bg-yellow-500";
  }
};

const getNameStyle = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower === "parent confirmed") {
    return "font-bold";
  }
  if (statusLower === "parent cancelled" || statusLower === "declined") {
    return "text-gray-400";
  }
  return "";
};

const getDisplayStatus = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower === "parent confirmed") return "Confirmed";
  if (statusLower === "parent cancelled") return "Cancelled";
  return status;
};

export const BabysitterListItem = ({
  id,
  requestId,
  name,
  status,
  deleted,
  onAction,
}: BabysitterListItemProps) => {
  const nameStyle = getNameStyle(status);
  const nonActionableStatuses = ["parent confirmed", "parent cancelled", "declined", "pending"];
  const isActionable = !nonActionableStatuses.includes(status.toLowerCase()) && onAction;

  return (
    <div className="flex justify-between items-center py-2 border-b last:border-0">
      <div className="flex items-center gap-3">
        <Badge className={getStatusColor(status)}>
          {getDisplayStatus(status)}
        </Badge>
        <div className="flex items-center">
          <span className={nameStyle}>
            {name}
            {deleted && (
              <span className="text-muted-foreground ml-1">(deleted)</span>
            )}
          </span>
        </div>
      </div>
      {isActionable && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAction(requestId, id, name, "confirm")}
            className="text-green-600 hover:text-green-700 transition-colors"
          >
            <CheckCircle className="h-5 w-5" />
          </button>
          <button
            onClick={() => onAction(requestId, id, name, "cancel")}
            className="text-red-600 hover:text-red-700 transition-colors"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};