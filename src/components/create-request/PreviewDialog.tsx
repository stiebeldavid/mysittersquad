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
import { format } from "date-fns";
import { formatTimeRange } from "@/utils/timeFormatting";

interface PreviewMessage {
  babysitter: {
    id: string;
    firstName: string;
  };
  message: string;
}

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  selectedBabysitters: any[];
  userName: string;
  onConfirm: () => void;
  notes?: string;
}

export const PreviewDialog = ({
  open,
  onOpenChange,
  date,
  startTime,
  endTime,
  selectedBabysitters,
  userName,
  onConfirm,
  notes,
}: PreviewDialogProps) => {
  const getPreviewMessages = (): PreviewMessage[] => {
    if (!date) return [];

    const dayStr = format(date, "EEEE, MMMM d");
    const timeRange = formatTimeRange(startTime, endTime);
    const notesSection = notes ? `\n\nAdditional Notes:\n${notes}` : "";

    return selectedBabysitters.map(sitter => ({
      babysitter: sitter,
      message: `Hi ${sitter.firstName},\n\n${userName} would like to know if you can babysit ${dayStr}, ${timeRange}.${notesSection}`
    }));
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Preview Request Messages</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 mt-4">
              {getPreviewMessages().map((preview) => (
                <div key={preview.babysitter.id} className="p-4 bg-muted rounded-lg whitespace-pre-line text-left">
                  {preview.message}
                </div>
              ))}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Send Requests
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};