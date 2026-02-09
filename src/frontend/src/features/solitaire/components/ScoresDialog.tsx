import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Trophy, Clock, Move, X } from 'lucide-react';
import { PlaythroughResult } from '../results/usePlaythroughResults';

interface ScoresDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bestTimes: PlaythroughResult[];
  bestMoves: PlaythroughResult[];
  formatTime: (seconds: number) => string;
}

export default function ScoresDialog({ 
  open, 
  onOpenChange, 
  bestTimes, 
  bestMoves, 
  formatTime 
}: ScoresDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-amber-500" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Leaderboards</DialogTitle>
          <DialogDescription className="text-center text-base">
            Your best completed games
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {/* Best Times */}
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
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono font-semibold">{formatTime(result.elapsedSeconds)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Move className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{result.moves} moves</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Separator />
            
            {/* Least Moves */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Move className="w-5 h-5 text-amber-500" />
                Least Moves
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
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <Move className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono font-semibold">{result.moves} moves</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{formatTime(result.elapsedSeconds)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
        
        <div className="flex justify-center pt-4">
          <Button onClick={() => onOpenChange(false)} variant="default">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
