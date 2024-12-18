import { format, isThisYear, parseISO } from "date-fns";
import { CardTitle } from "@/components/ui/card";

interface RequestHeaderProps {
  date: string;
  timeRange: string;
  notes?: string;
}

export const RequestHeader = ({ date, timeRange, notes }: RequestHeaderProps) => {
  const requestDate = date ? parseISO(date) : new Date();
  const dateFormat = isThisYear(requestDate) ? "EEEE, MMMM d" : "EEEE, MMMM d, yyyy";

  return (
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
  );
};