import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Babysitter } from "@/types/babysitter";

interface BabysitterSelectorProps {
  selectedBabysitters: string[];
  onBabysittersChange: (babysitterIds: string[]) => void;
}

export const BabysitterSelector = ({
  selectedBabysitters,
  onBabysittersChange,
}: BabysitterSelectorProps) => {
  const [babysitters, setBabysitters] = useState<Babysitter[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from an API or local storage
    const storedBabysitters = localStorage.getItem('babysitters');
    if (storedBabysitters) {
      setBabysitters(JSON.parse(storedBabysitters));
    }
  }, []);

  const handleBabysitterToggle = (babysitterId: string) => {
    if (selectedBabysitters.includes(babysitterId)) {
      onBabysittersChange(selectedBabysitters.filter(id => id !== babysitterId));
    } else {
      onBabysittersChange([...selectedBabysitters, babysitterId]);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Select Babysitters to Contact</Label>
      <div className="space-y-2">
        {babysitters.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No babysitters added yet. Add babysitters in the Babysitters section.
          </p>
        ) : (
          babysitters.map((sitter) => (
            <div key={sitter.id} className="flex items-center space-x-2">
              <Checkbox
                id={`sitter-${sitter.id}`}
                checked={selectedBabysitters.includes(sitter.id)}
                onCheckedChange={() => handleBabysitterToggle(sitter.id)}
              />
              <Label htmlFor={`sitter-${sitter.id}`}>
                {sitter.firstName} {sitter.lastName}
                {sitter.rate && ` ($${sitter.rate}/hr)`}
              </Label>
            </div>
          ))
        )}
      </div>
    </div>
  );
};