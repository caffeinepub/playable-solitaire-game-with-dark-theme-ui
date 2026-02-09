import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Lightbulb, Play, Trophy, Settings } from 'lucide-react';

interface GameControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  onHint: () => void;
  onScores: () => void;
  onPreferences: () => void;
  canUndo: boolean;
}

export default function GameControls({ onNewGame, onUndo, onHint, onScores, onPreferences, canUndo }: GameControlsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button onClick={onNewGame} variant="default" size="default" className="gap-2">
        <Play className="w-4 h-4" />
        New Game
      </Button>
      <Button onClick={onUndo} variant="outline" size="default" disabled={!canUndo} className="gap-2">
        <RotateCcw className="w-4 h-4" />
        Undo
      </Button>
      <Button onClick={onHint} variant="outline" size="default" className="gap-2">
        <Lightbulb className="w-4 h-4" />
        Hint
      </Button>
      <Button onClick={onScores} variant="outline" size="default" className="gap-2">
        <Trophy className="w-4 h-4" />
        Scores
      </Button>
      <Button onClick={onPreferences} variant="outline" size="default" className="gap-2">
        <Settings className="w-4 h-4" />
        Preferences
      </Button>
    </div>
  );
}
