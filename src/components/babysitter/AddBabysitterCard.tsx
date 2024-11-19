import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AddBabysitterCardProps {
  onClick: () => void;
}

export const AddBabysitterCard = ({ onClick }: AddBabysitterCardProps) => {
  return (
    <Card 
      className="card-hover cursor-pointer flex items-center justify-center"
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <Plus className="w-8 h-8 mb-2 text-primary" />
        <h3 className="text-lg font-semibold">Add New Babysitter</h3>
      </CardContent>
    </Card>
  );
};