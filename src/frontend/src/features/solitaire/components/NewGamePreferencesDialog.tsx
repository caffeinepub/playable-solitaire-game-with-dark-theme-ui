import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Clock, Move, X } from 'lucide-react';

interface NewGamePreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (preferences: { timerEnabled: boolean; moveTrackingEnabled: boolean; askAgain: boolean }) => void;
  defaultTimerEnabled: boolean;
  defaultMoveTrackingEnabled: boolean;
  defaultAskAgain: boolean;
}

export default function NewGamePreferencesDialog({
  open,
  onOpenChange,
  onConfirm,
  defaultTimerEnabled,
  defaultMoveTrackingEnabled,
  defaultAskAgain,
}: NewGamePreferencesDialogProps) {
  const [timerEnabled, setTimerEnabled] = useState(defaultTimerEnabled);
  const [moveTrackingEnabled, setMoveTrackingEnabled] = useState(defaultMoveTrackingEnabled);
  const [askAgain, setAskAgain] = useState(defaultAskAgain);

  // Reset to default values when dialog opens
  useEffect(() => {
    if (open) {
      setTimerEnabled(defaultTimerEnabled);
      setMoveTrackingEnabled(defaultMoveTrackingEnabled);
      setAskAgain(defaultAskAgain);
    }
  }, [open, defaultTimerEnabled, defaultMoveTrackingEnabled, defaultAskAgain]);

  const handleConfirm = () => {
    onConfirm({ timerEnabled, moveTrackingEnabled, askAgain });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Game Preferences</DialogTitle>
          <DialogDescription>
            Choose your preferences for this game
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Timer Option */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="timer"
              checked={timerEnabled}
              onCheckedChange={(checked) => setTimerEnabled(checked === true)}
            />
            <div className="flex-1 space-y-1">
              <Label
                htmlFor="timer"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                Timer
              </Label>
              <p className="text-sm text-muted-foreground">
                Track how long it takes to complete the game
              </p>
            </div>
          </div>

          {/* Move Tracking Option */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="moveTracking"
              checked={moveTrackingEnabled}
              onCheckedChange={(checked) => setMoveTrackingEnabled(checked === true)}
            />
            <div className="flex-1 space-y-1">
              <Label
                htmlFor="moveTracking"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
              >
                <Move className="w-4 h-4" />
                Move tracking
              </Label>
              <p className="text-sm text-muted-foreground">
                Count the number of moves you make
              </p>
            </div>
          </div>

          {/* Ask Again Option */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="askAgain"
                checked={askAgain}
                onCheckedChange={(checked) => setAskAgain(checked === true)}
              />
              <div className="flex-1 space-y-1">
                <Label
                  htmlFor="askAgain"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Ask Again?
                </Label>
                <p className="text-sm text-muted-foreground">
                  {askAgain 
                    ? "You'll be asked these preferences each time you start a new game" 
                    : "Your preferences will be saved and used automatically for future games"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleConfirm} className="w-full">
            Start Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
