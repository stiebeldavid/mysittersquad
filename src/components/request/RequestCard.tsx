import { format, isThisYear, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    default:
      return "bg-yellow-500";
  }
};

export const RequestCard = ({ date, timeRange, createdAt, babysitters, notes }: RequestCardProps) => {
  // Parse the date string directly without timezone conversion
  const requestDate = parseISO(date);
  const createdDate = new Date(createdAt);
  const dateFormat = isThisYear(requestDate) ? "EEEE, MMMM d" : "EEEE, MMMM d, yyyy";

  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <CardTitle className="text-lg font-semibold">
            {format(requestDate, dateFormat)}
          </CardTitle>
          <span className="text-sm font-medium text-muted-foreground tracking-wide">
            {timeRange}
          </span>
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
          {notes && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground font-medium mb-1">Additional Notes:</p>
              <p className="text-sm whitespace-pre-line">{notes}</p>
            </div>
          )}
          <p className="text-sm text-muted-foreground pt-2">
            Request Created: {format(createdDate, "MMM d, yyyy")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};