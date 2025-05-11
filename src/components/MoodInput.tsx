'use client'

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MoodInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function MoodInput({ value, onChange, onSubmit, disabled = false }: MoodInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled) {
      onSubmit();
    }
  };

  return (
    <div className={cn(
      "relative border rounded-lg transition-all duration-200",
      isFocused ? "border-primary ring-2 ring-primary ring-opacity-20" : "border-input",
      disabled && "opacity-70"
    )}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Enter your mood (e.g., relaxed, energetic, nostalgic)"
        disabled={disabled}
        className="w-full px-4 py-3 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
}
