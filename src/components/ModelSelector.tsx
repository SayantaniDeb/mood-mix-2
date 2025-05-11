'use client'

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModelSelectorProps {
  models: string[];
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

export default function ModelSelector({ models, selectedModel, onSelectModel }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const formatModelName = (modelId: string): string => {
    // Convert model IDs to readable names
    return modelId
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
      .replace('Gpt', 'GPT')
      .replace('4o', '4o');
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-2 rounded-md",
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary hover:bg-opacity-80",
          "transition-colors duration-200"
        )}
      >
        <span>Model: {formatModelName(selectedModel)}</span>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isOpen && "transform rotate-180"
        )} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-popover rounded-md shadow-lg border border-border">
          <div className="py-1 max-h-60 overflow-auto">
            {models.map((model) => (
              <button
                key={model}
                onClick={() => {
                  onSelectModel(model);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2 flex items-center justify-between",
                  "hover:bg-accent hover:text-accent-foreground",
                  selectedModel === model && "bg-accent bg-opacity-50"
                )}
              >
                <span>{formatModelName(model)}</span>
                {selectedModel === model && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
