import React from 'react';
import { Move } from 'lucide-react';

interface GameMovesProps {
  moves: number;
  enabled: boolean;
}

export default function GameMoves({ moves, enabled }: GameMovesProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Move className="w-4 h-4" />
      {enabled ? (
        <span className="font-mono tabular-nums">{moves}</span>
      ) : (
        <span className="text-xs italic">Tracking disabled</span>
      )}
    </div>
  );
}
