import React from 'react';
import PhoneInput from 'react-phone-number-input/input';
import { cn } from "@/lib/utils";

interface PhoneNumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

const PhoneNumberInput = React.forwardRef<HTMLInputElement, PhoneNumberInputProps>(
  ({ className, error, onChange, value, maxLength, ...props }, ref) => {
    const handleChange = (newValue: string | undefined) => {
      // Only call onChange if the new value is undefined or its length is within maxLength
      if (!newValue || (maxLength && newValue.replace(/\D/g, '').length <= maxLength)) {
        onChange(newValue || '');
      }
    };

    return (
      <PhoneInput
        ref={ref}
        country="US"
        international
        withCountryCallingCode
        value={value}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500",
          className
        )}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

PhoneNumberInput.displayName = "PhoneNumberInput";

export { PhoneNumberInput };