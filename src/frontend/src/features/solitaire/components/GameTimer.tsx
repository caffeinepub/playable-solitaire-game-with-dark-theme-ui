import React from 'react';
import { Clock } from 'lucide-react';

interface GameTimerProps {
  formattedTime: string;
  enabled: boolean;
}

export default function GameTimer({ formattedTime, enabled }: GameTimerProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="w-4 h-4" />
      {enabled ? (
        <span className="font-mono tabular-nums">{formattedTime}</span>
      ) : (
        <span className="text-xs italic">Timing disabled</span>
      )}
    </div>
  );
}
