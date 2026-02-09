import React, { useState } from 'react';
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

interface GamePreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (preferences: { timerEnabled: boolean; moveTrackingEnabled: boolean; askAgain: boolean }) => void;
  currentTimerEnabled: boolean;
  currentMoveTrackingEnabled: boolean;
  currentAskAgain: boolean;
}

export default function GamePreferencesDialog({
  open,
  onOpenChange,
  onSave,
  currentTimerEnabled,
  currentMoveTrackingEnabled,
  currentAskAgain,
}: GamePreferencesDialogProps) {
  const [timerEnabled, setTimerEnabled] = useState(currentTimerEnabled);
  const [moveTrackingEnabled, setMoveTrackingEnabled] = useState(currentMoveTrackingEnabled);
  const [askAgain, setAskAgain] = useState(currentAskAgain);

  // Reset to current values when dialog opens
  React.useEffect(() => {
    if (open) {
      setTimerEnabled(currentTimerEnabled);
      setMoveTrackingEnabled(currentMoveTrackingEnabled);
      setAskAgain(currentAskAgain);
    }
  }, [open, currentTimerEnabled, currentMoveTrackingEnabled, currentAskAgain]);

  const handleSave = () => {
    onSave({ timerEnabled, moveTrackingEnabled, askAgain });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Game Preferences</DialogTitle>
          <DialogDescription>
            Adjust your game preferences
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
              id="settings-timer"
              checked={timerEnabled}
              onCheckedChange={(checked) => setTimerEnabled(checked === true)}
            />
            <div className="flex-1 space-y-1">
              <Label
                htmlFor="settings-timer"
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
              id="settings-moveTracking"
              checked={moveTrackingEnabled}
              onCheckedChange={(checked) => setMoveTrackingEnabled(checked === true)}
            />
            <div className="flex-1 space-y-1">
              <Label
                htmlFor="settings-moveTracking"
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
                id="settings-askAgain"
                checked={askAgain}
                onCheckedChange={(checked) => setAskAgain(checked === true)}
              />
              <div className="flex-1 space-y-1">
                <Label
                  htmlFor="settings-askAgain"
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

        <DialogFooter className="gap-2">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
