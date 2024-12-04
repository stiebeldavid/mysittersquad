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
    <div className="inline-flex items-center gap-1">
      <div className="flex flex-col">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={incrementHour}
          type="button"
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <span className="text-center text-sm py-1">
          {hours.toString().padStart(2, "0")}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={decrementHour}
          type="button"
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      <span className="text-sm px-0.5">:</span>

      <div className="flex flex-col">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={incrementMinutes}
          type="button"
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <span className="text-center text-sm py-1">
          {minutes.toString().padStart(2, "0")}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={decrementMinutes}
          type="button"
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      <input
        id={id}
        type="time"
        value={value}
        onChange={handleTimeChange}
        className="sr-only"
      />
    </div>
  );
};