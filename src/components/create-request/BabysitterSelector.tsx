import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { fetchBabysitters } from "@/lib/airtable";
import { useAuthStore } from "@/store/authStore";

interface BabysitterSelectorProps {
  selectedBabysitters: string[];
  onBabysittersChange: (babysitterIds: string[]) => void;
}

export const BabysitterSelector = ({
  selectedBabysitters,
  onBabysittersChange,
}: BabysitterSelectorProps) => {
  const user = useAuthStore((state) => state.user);
  
  const { data: babysitters = [], isLoading } = useQuery({
    queryKey: ['babysitters', user?.mobile],
    queryFn: () => fetchBabysitters(user?.mobile || ''),
    enabled: !!user?.mobile,
  });

  const handleBabysitterToggle = (babysitterId: string) => {
    if (selectedBabysitters.includes(babysitterId)) {
      onBabysittersChange(selectedBabysitters.filter(id => id !== babysitterId));
    } else {
      onBabysittersChange([...selectedBabysitters, babysitterId]);
    }
  };

  if (isLoading) {
    return <div>Loading babysitters...</div>;
  }

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