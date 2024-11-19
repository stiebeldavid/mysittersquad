import { format, isThisYear } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTimeRange } from "@/utils/timeFormatting";
import { GroupedRequest } from "@/types/request";

interface RequestCardProps {
  groupedRequest: GroupedRequest;
}

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

export const RequestCard = ({ groupedRequest }: RequestCardProps) => {
  const requestDate = new Date(groupedRequest.date);
  const createdDate = new Date(groupedRequest.createdAt);
  const dateFormat = isThisYear(requestDate) ? "EEEE, MMMM d" : "EEEE, MMMM d, yyyy";

  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <CardTitle className="text-lg font-semibold">
            {format(requestDate, dateFormat)}
          </CardTitle>
          <span className="text-sm font-medium text-muted-foreground tracking-wide">
            {formatTimeRange(groupedRequest.timeRange)}
          </span>
        </div>
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
          <p className="text-sm text-muted-foreground pt-2">
            Request Created: {format(createdDate, "MMM d, yyyy")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};