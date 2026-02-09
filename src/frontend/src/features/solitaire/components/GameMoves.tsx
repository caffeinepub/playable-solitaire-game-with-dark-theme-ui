import React from 'react';
import { Move } from 'lucide-react';

interface GameMovesProps {
  moves: number;
}

/**
 * Displays the current move counter.
 * Styled to match the GameTimer component for visual consistency.
 */
export default function GameMoves({ moves }: GameMovesProps) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Move className="w-4 h-4" />
      <span className="font-mono text-sm tabular-nums">
        Moves: {moves}
      </span>
    </div>
  );
}
