import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface SortControlsProps {
  sortBy: "created" | "date";
  onSortChange: (value: "created" | "date") => void;
}

export const SortControls = ({ sortBy, onSortChange }: SortControlsProps) => {
  const handleSortChange = (value: string | undefined) => {
    if (value) {
      onSortChange(value as "created" | "date");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">Sort by</span>
      <ToggleGroup 
        type="single" 
        value={sortBy} 
        onValueChange={handleSortChange}
        className="border rounded-lg p-1 bg-muted/10"
      >
        <ToggleGroupItem 
          value="created" 
          variant="outline" 
          className="text-muted-foreground data-[state=on]:bg-secondary/50 data-[state=on]:border-b-2 data-[state=on]:border-primary/50 data-[state=on]:font-medium data-[state=on]:text-primary"
        >
          Created Date
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="date" 
          variant="outline" 
          className="text-muted-foreground data-[state=on]:bg-secondary/50 data-[state=on]:border-b-2 data-[state=on]:border-primary/50 data-[state=on]:font-medium data-[state=on]:text-primary"
        >
          Babysitting Date
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};