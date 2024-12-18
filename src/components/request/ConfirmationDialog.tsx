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

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: "confirm" | "cancel";
  babysitterName: string;
}

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  babysitterName,
}: ConfirmationDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {action === "confirm" ? "Confirm" : "Cancel"} Request
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {action === "confirm" ? "confirm" : "cancel"} the request for {babysitterName}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {action === "confirm" ? "Confirm" : "Cancel"} Request
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};