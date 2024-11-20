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
    firstName?: string;
    lastName?: string;
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
  const requestDate = parseISO(date);
  const createdDate = new Date(createdAt);
  const dateFormat = isThisYear(requestDate) ? "EEEE, MMMM d" : "EEEE, MMMM d, yyyy";

  return (
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
              <span>
                {babysitter.firstName && babysitter.lastName 
                  ? `${babysitter.firstName} ${babysitter.lastName}`
                  : babysitter.name}
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
  );
};