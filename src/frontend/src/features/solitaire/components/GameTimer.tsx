import React from 'react';
import { Clock } from 'lucide-react';

interface GameTimerProps {
  formattedTime: string;
}

/**
 * Displays the elapsed game time in HH:MM:SS format.
 * Styled for the dark theme with subtle, legible appearance.
 */
export default function GameTimer({ formattedTime }: GameTimerProps) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Clock className="w-4 h-4" />
      <span className="font-mono text-sm tabular-nums">{formattedTime}</span>
    </div>
  );
}
