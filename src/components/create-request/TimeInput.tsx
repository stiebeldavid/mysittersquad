import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  id: string;
}

export const TimeInput = ({ value, onChange, id }: TimeInputProps) => {
  const [hours, minutes] = value.split(":").map(Number);

  const incrementHour = () => {
    const newHours = (hours + 1) % 24;
    onChange(`${newHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
  };

  const decrementHour = () => {
    const newHours = (hours - 1 + 24) % 24;
    onChange(`${newHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
  };

  const incrementMinutes = () => {
    const newMinutes = Math.min(Math.ceil(minutes / 5) * 5, 55);
    onChange(`${hours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`);
  };

  const decrementMinutes = () => {
    const newMinutes = Math.max(Math.floor(minutes / 5) * 5 - 5, 0);
    onChange(`${hours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2"
          onClick={incrementHour}
          type="button"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2"
          onClick={decrementHour}
          type="button"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <input
        id={id}
        type="time"
        value={value}
        onChange={handleTimeChange}
        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2"
          onClick={incrementMinutes}
          type="button"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2"
          onClick={decrementMinutes}
          type="button"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};