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
import { Trophy } from 'lucide-react';

interface WinDialogProps {
  open: boolean;
  onNewGame: () => void;
}

export default function WinDialog({ open, onNewGame }: WinDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
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
        <DialogFooter className="sm:justify-center">
          <Button onClick={onNewGame} size="lg" className="gap-2">
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
