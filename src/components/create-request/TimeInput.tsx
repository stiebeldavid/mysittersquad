import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  id: string;
  onTabFromMinutes?: () => void;  // New prop to handle tabbing from minutes
}

export const TimeInput = ({ value, onChange, id, onTabFromMinutes }: TimeInputProps) => {
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
      newMinutes = (currentMinutes + 5) % 60;
    } else {
      newMinutes = Math.ceil(currentMinutes / 5) * 5;
      if (newMinutes === currentMinutes) {
        newMinutes = (Math.floor(currentMinutes / 5) * 5 + 5) % 60;
      }
    }
    
    const newHours = newMinutes < minutes ? (hours + 1) % 24 : hours;
    onChange(`${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`);
  };

  const decrementMinutes = () => {
    const currentMinutes = minutes;
    let newMinutes;
    
    if (currentMinutes % 5 === 0) {
      newMinutes = (currentMinutes - 5 + 60) % 60;
    } else {
      newMinutes = Math.floor(currentMinutes / 5) * 5;
    }
    
    const newHours = newMinutes > minutes ? (hours - 1 + 24) % 24 : hours;
    onChange(`${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHour = parseInt(e.target.value);
    if (isNaN(newHour)) return;
    
    let adjustedHour = newHour;
    if (isPM && newHour !== 12) adjustedHour = newHour + 12;
    if (!isPM && newHour === 12) adjustedHour = 0;
    
    if (newHour >= 1 && newHour <= 12) {
      onChange(`${adjustedHour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinute = parseInt(e.target.value);
    if (isNaN(newMinute) || newMinute < 0 || newMinute > 59) return;
    onChange(`${hours.toString().padStart(2, "0")}:${newMinute.toString().padStart(2, "0")}`);
  };

  const handleMinutesKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && !e.shiftKey && onTabFromMinutes) {
      e.preventDefault();
      onTabFromMinutes();
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
        <Input
          type="text"
          value={display12Hour.toString().padStart(2, "0")}
          onChange={handleHourChange}
          className="h-7 w-10 text-center p-0 text-sm font-medium"
        />
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
        <Input
          type="text"
          value={minutes.toString().padStart(2, "0")}
          onChange={handleMinuteChange}
          onKeyDown={handleMinutesKeyDown}
          className="h-7 w-10 text-center p-0 text-sm font-medium"
        />
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
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
    </div>
  );
};