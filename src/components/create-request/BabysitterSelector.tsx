import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Babysitter {
  id: string;
  firstName: string;
  lastName: string;
  rate?: number;
}

interface BabysitterSelectorProps {
  selectedBabysitters: string[];
  onBabysittersChange: (babysitterIds: string[]) => void;
}

export const BabysitterSelector = ({
  selectedBabysitters,
  onBabysittersChange,
}: BabysitterSelectorProps) => {
  const [babysitters] = useState<Babysitter[]>([
    { id: "1", firstName: "Jane", lastName: "Smith", rate: 15 },
    { id: "2", firstName: "John", lastName: "Doe", rate: 18 },
  ]);

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
        {babysitters.map((sitter) => (
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
        ))}
      </div>
    </div>
  );
};