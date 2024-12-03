import React from 'react';
import { Toggle } from "@/components/ui/toggle";

interface TimeInputProps {
  hours: string;
  minutes: string;
  ampm: "AM" | "PM";
  onHoursChange: (value: string) => void;
  onMinutesChange: (value: string) => void;
  onAmPmChange: (value: "AM" | "PM") => void;
}

export const TimeInput = ({
  hours,
  minutes,
  ampm,
  onHoursChange,
  onMinutesChange,
  onAmPmChange,
}: TimeInputProps) => {
  const incrementMinutes = () => {
    const currentMinutes = parseInt(minutes);
    // Round up to next 5 minute increment
    const nextIncrement = Math.ceil((currentMinutes + 1) / 5) * 5;
    if (nextIncrement <= 59) {
      onMinutesChange(nextIncrement.toString().padStart(2, '0'));
    } else {
      onMinutesChange('00');
    }
  };

  const decrementMinutes = () => {
    const currentMinutes = parseInt(minutes);
    // Round down to previous 5 minute increment
    const prevIncrement = Math.floor((currentMinutes - 1) / 5) * 5;
    if (prevIncrement >= 0) {
      onMinutesChange(prevIncrement.toString().padStart(2, '0'));
    } else {
      onMinutesChange('55');
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col items-center bg-white rounded-lg shadow-sm border">
        <button
          type="button"
          className="px-3 py-1 hover:bg-gray-50"
          onClick={() => {
            const newHours = parseInt(hours);
            if (newHours < 12) {
              onHoursChange(String(newHours + 1).padStart(2, '0'));
            } else {
              onHoursChange('01');
            }
          }}
        >
          ▲
        </button>
        <input
          type="text"
          value={hours}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,2}$/.test(value)) {
              const numValue = parseInt(value || "0");
              if (numValue >= 0 && numValue <= 12) {
                onHoursChange(value.padStart(2, '0'));
              }
            }
          }}
          className="w-12 text-center border-y py-1"
        />
        <button
          type="button"
          className="px-3 py-1 hover:bg-gray-50"
          onClick={() => {
            const newHours = parseInt(hours);
            if (newHours > 1) {
              onHoursChange(String(newHours - 1).padStart(2, '0'));
            } else {
              onHoursChange('12');
            }
          }}
        >
          ▼
        </button>
      </div>
      <span className="text-xl">:</span>
      <div className="flex flex-col items-center bg-white rounded-lg shadow-sm border">
        <button
          type="button"
          className="px-3 py-1 hover:bg-gray-50"
          onClick={incrementMinutes}
        >
          ▲
        </button>
        <input
          type="text"
          value={minutes}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,2}$/.test(value)) {
              const numValue = parseInt(value || "0");
              if (numValue >= 0 && numValue <= 59) {
                onMinutesChange(value.padStart(2, '0'));
              }
            }
          }}
          className="w-12 text-center border-y py-1"
        />
        <button
          type="button"
          className="px-3 py-1 hover:bg-gray-50"
          onClick={decrementMinutes}
        >
          ▼
        </button>
      </div>
      <Toggle
        pressed={ampm === "PM"}
        onPressedChange={(pressed) => onAmPmChange(pressed ? "PM" : "AM")}
        className="ml-2"
      >
        {ampm}
      </Toggle>
    </div>
  );
};