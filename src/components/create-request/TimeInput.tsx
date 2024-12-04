import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  id: string;
}

export const TimeInput = ({ value, onChange, id }: TimeInputProps) => {
  // Convert 24h to 12h format for display
  const get12HourTime = (hour: number) => {
    if (hour === 0) return 12;
    if (hour > 12) return hour - 12;
    return hour;
  };

  const [hours, minutes] = value.split(":").map(Number);
  const isPM = hours >= 12;
  const display12Hour = get12HourTime(hours);

  const incrementHour = () => {
    const newHours = (hours + 1) % 24;
    onChange(`${newHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
  };

  const decrementHour = () => {
    const newHours = (hours - 1 + 24) % 24;
    onChange(`${newHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
  };

  const incrementMinutes = () => {
    const currentMinutes = minutes;
    let newMinutes;
    
    if (currentMinutes % 5 === 0) {
      // If we're already at a 5-minute mark, go to the next one
      newMinutes = (currentMinutes + 5) % 60;
    } else {
      // Round up to the next 5-minute mark
      newMinutes = Math.ceil(currentMinutes / 5) * 5;
      if (newMinutes === currentMinutes) {
        newMinutes = (Math.floor(currentMinutes / 5) * 5 + 5) % 60;
      }
    }
    
    // Handle hour rollover
    const newHours = newMinutes < minutes ? (hours + 1) % 24 : hours;
    onChange(`${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`);
  };

  const decrementMinutes = () => {
    const currentMinutes = minutes;
    let newMinutes;
    
    if (currentMinutes % 5 === 0) {
      // If we're already at a 5-minute mark, go to the previous one
      newMinutes = (currentMinutes - 5 + 60) % 60;
    } else {
      // Round down to the previous 5-minute mark
      newMinutes = Math.floor(currentMinutes / 5) * 5;
    }
    
    // Handle hour rollback
    const newHours = newMinutes > minutes ? (hours - 1 + 24) % 24 : hours;
    onChange(`${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={incrementHour}
          type="button"
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <span className="text-center text-sm font-medium w-6">
          {display12Hour.toString().padStart(2, "0")}
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

      <span className="text-sm font-medium">:</span>

      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={incrementMinutes}
          type="button"
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <span className="text-center text-sm font-medium w-6">
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

      <span className="text-sm font-medium ml-1">
        {isPM ? 'PM' : 'AM'}
      </span>

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