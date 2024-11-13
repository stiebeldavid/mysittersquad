import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Kid {
  id: string;
  firstName: string;
  age: number;
}

interface KidSelectorProps {
  selectedKids: string[];
  onKidsChange: (kidIds: string[]) => void;
}

export const KidSelector = ({ selectedKids, onKidsChange }: KidSelectorProps) => {
  const navigate = useNavigate();
  const [kids] = useState<Kid[]>([
    { id: "1", firstName: "Alice", age: 5 },
    { id: "2", firstName: "Bob", age: 3 },
  ]);

  const handleKidToggle = (kidId: string) => {
    if (selectedKids.includes(kidId)) {
      onKidsChange(selectedKids.filter(id => id !== kidId));
    } else {
      onKidsChange([...selectedKids, kidId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Select Kids</Label>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New Kid
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Kid</DialogTitle>
            </DialogHeader>
            <Button onClick={() => navigate("/kids")}>
              Go to Kid Profiles
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2">
        {kids.map((kid) => (
          <div key={kid.id} className="flex items-center space-x-2">
            <Checkbox
              id={`kid-${kid.id}`}
              checked={selectedKids.includes(kid.id)}
              onCheckedChange={() => handleKidToggle(kid.id)}
            />
            <Label htmlFor={`kid-${kid.id}`}>
              {kid.firstName} ({kid.age} years old)
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};