import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Trophy, Clock, Move, Award } from 'lucide-react';
import { PlaythroughResult } from '../results/usePlaythroughResults';

interface WinDialogProps {
  open: boolean;
  onNewGame: () => void;
  currentTime: number;
  currentMoves: number;
  bestTimes: PlaythroughResult[];
  bestMoves: PlaythroughResult[];
  formatTime: (seconds: number) => string;
}

export default function WinDialog({ 
  open, 
  onNewGame, 
  currentTime, 
  currentMoves, 
  bestTimes, 
  bestMoves, 
  formatTime 
}: WinDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-amber-500" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Congratulations!</DialogTitle>
          <DialogDescription className="text-center text-base">
            You've successfully completed the game. Well done!
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {/* Current Result */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/40">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Your Result
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Time:</span>
                  <span className="font-mono font-semibold">{formatTime(currentTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Move className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Moves:</span>
                  <span className="font-mono font-semibold">{currentMoves}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Best Times Leaderboard */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Best Times
              </h3>
              {bestTimes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No completed games yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {bestTimes.slice(0, 10).map((result, index) => (
                    <div 
                      key={result.timestamp} 
                      className="flex items-center justify-between bg-muted/20 rounded px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="font-mono font-medium">{formatTime(result.elapsedSeconds)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Move className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="font-mono text-muted-foreground">{result.moves}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Best Moves Leaderboard */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Move className="w-5 h-5 text-amber-500" />
                Best Moves
              </h3>
              {bestMoves.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No completed games yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {bestMoves.slice(0, 10).map((result, index) => (
                    <div 
                      key={result.timestamp} 
                      className="flex items-center justify-between bg-muted/20 rounded px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <Move className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="font-mono font-medium">{result.moves}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="font-mono text-muted-foreground">{formatTime(result.elapsedSeconds)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="sm:justify-center pt-4">
          <Button onClick={onNewGame} size="lg" className="gap-2">
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
