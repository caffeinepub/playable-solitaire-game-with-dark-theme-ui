import React from 'react';
import { Badge } from '@/components/ui/badge';

/**
 * Subtle draft mode indicator displayed when the app is in draft publishing state.
 * Shows a small badge in the top-right corner without interfering with gameplay.
 */
export function DraftIndicator() {
  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-muted-foreground/30 text-muted-foreground text-xs font-medium px-3 py-1">
        Draft
      </Badge>
    </div>
  );
}
