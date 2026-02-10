import React from 'react';
import SolitairePage from './features/solitaire/SolitairePage';
import MaintenanceMode from './components/MaintenanceMode';
import { DraftIndicator } from './components/DraftIndicator';
import { publishingState } from './config/publishing';
import { useRobotsPolicy } from './hooks/useRobotsPolicy';

function App() {
  // Apply robots policy based on publishing state
  useRobotsPolicy();

  // Show maintenance mode screen
  if (publishingState === 'maintenance') {
    return (
      <div className="dark min-h-screen bg-background text-foreground">
        <MaintenanceMode />
      </div>
    );
  }

  // Show the game in draft or live mode
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {publishingState === 'draft' && <DraftIndicator />}
      <SolitairePage />
    </div>
  );
}

export default App;
