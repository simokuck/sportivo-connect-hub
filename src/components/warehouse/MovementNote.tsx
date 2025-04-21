
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MovementNoteProps {
  note?: string;
}

export const MovementNote = ({ note }: MovementNoteProps) => {
  if (!note) return <span className="text-muted-foreground">-</span>;
  
  const shouldTruncate = note.length > 30;
  
  return shouldTruncate ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">
            {note.substring(0, 30)}...
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-md">
          <p>{note}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <span>{note}</span>
  );
};
