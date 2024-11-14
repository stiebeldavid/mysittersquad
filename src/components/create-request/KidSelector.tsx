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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Kid } from "@/types/kid";
import { useFamilyStore } from "@/store/familyStore";

interface KidSelectorProps {
  selectedKids: string[];
  onKidsChange: (kidIds: string[]) => void;
}

export const KidSelector = ({ selectedKids, onKidsChange }: KidSelectorProps) => {
  const navigate = useNavigate();
  const { kids } = useFamilyStore();

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
            <Button onClick={() => navigate("/family")}>
              Go to Family Profiles
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2">
        {kids.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No kids added yet. Add kids in the Family Profile section.
          </p>
        ) : (
          kids.map((kid) => (
            <div key={kid.id} className="flex items-center space-x-2">
              <Checkbox
                id={`kid-${kid.id}`}
                checked={selectedKids.includes(kid.id)}
                onCheckedChange={() => handleKidToggle(kid.id)}
              />
              <Label htmlFor={`kid-${kid.id}`}>
                {kid.firstName} ({kid.age} years old)
                {kid.allergies && <span className="text-red-500 ml-2">Has allergies</span>}
              </Label>
            </div>
          ))
        )}
      </div>
    </div>
  );
};