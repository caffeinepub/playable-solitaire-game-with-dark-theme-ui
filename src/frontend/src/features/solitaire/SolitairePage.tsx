import React, { useEffect, useState, useRef } from 'react';
import { useSolitaireGame } from './useSolitaireGame';
import PileView from './components/PileView';
import GameControls from './components/GameControls';
import WinDialog from './components/WinDialog';
import ScoresDialog from './components/ScoresDialog';
import NewGamePreferencesDialog from './components/NewGamePreferencesDialog';
import GamePreferencesDialog from './components/GamePreferencesDialog';
import GameTimer from './components/GameTimer';
import GameMoves from './components/GameMoves';
import { useGameTimer } from './hooks/useGameTimer';
import { usePlaythroughResults } from './results/usePlaythroughResults';
import { loadPreferences, savePreferences, SolitairePreferences } from './preferences/solitairePreferences';
import { Selection, DragPayload } from './solitaireTypes';
import { SiX, SiFacebook, SiInstagram } from 'react-icons/si';
import { setDragData, getDragData, dragPayloadToSelection } from './solitaireDrag';

export default function SolitairePage() {
  const {
    gameState,
    moves,
    selection,
    hint,
    isWon,
    canUndo,
    newGame,
    draw,
    select,
    move,
    undo,
    showHint,
    clearHint,
    clearUIState,
  } = useSolitaireGame();
  
  const [dragOverTarget, setDragOverTarget] = useState<{ type: string; index?: number } | null>(null);
  const [gameInstanceKey, setGameInstanceKey] = useState(0);
  const [scoresDialogOpen, setScoresDialogOpen] = useState(false);
  const [preferencesDialogOpen, setPreferencesDialogOpen] = useState(false);
  const [newGameDialogOpen, setNewGameDialogOpen] = useState(false);
  const [preferences, setPreferences] = useState<SolitairePreferences>(() => loadPreferences());
  const dragSessionActive = useRef(false);
  const dropHandled = useRef(false);
  const winRecorded = useRef<number | null>(null);
  
  // Timer hook - stops when game is won, respects enabled preference
  const { formattedTime, elapsedSeconds } = useGameTimer(gameInstanceKey, !isWon, preferences.timerEnabled);
  
  // Results tracking
  const { addResult, bestTimes, bestMoves, formatTime } = usePlaythroughResults();
  
  useEffect(() => {
    if (hint) {
      const timer = setTimeout(() => clearHint(), 3000);
      return () => clearTimeout(timer);
    }
  }, [hint, clearHint]);
  
  // Record result when game is won (only once per game instance, only if both metrics enabled)
  useEffect(() => {
    if (isWon && winRecorded.current !== gameInstanceKey) {
      winRecorded.current = gameInstanceKey;
      // Only record if both timer and move tracking are enabled
      if (preferences.timerEnabled && preferences.moveTrackingEnabled) {
        addResult({ elapsedSeconds, moves });
      }
    }
  }, [isWon, gameInstanceKey, elapsedSeconds, moves, addResult, preferences.timerEnabled, preferences.moveTrackingEnabled]);
  
  const handleNewGameRequest = () => {
    if (preferences.askAgain) {
      // Show preferences dialog
      setNewGameDialogOpen(true);
    } else {
      // Start game immediately with saved preferences
      startNewGame();
    }
  };
  
  const handleNewGameConfirm = (newPrefs: { timerEnabled: boolean; moveTrackingEnabled: boolean; askAgain: boolean }) => {
    // Save preferences
    const updatedPrefs: SolitairePreferences = {
      timerEnabled: newPrefs.timerEnabled,
      moveTrackingEnabled: newPrefs.moveTrackingEnabled,
      askAgain: newPrefs.askAgain,
    };
    setPreferences(updatedPrefs);
    savePreferences(updatedPrefs);
    
    // Close dialog and start game
    setNewGameDialogOpen(false);
    startNewGame();
  };
  
  const startNewGame = () => {
    newGame();
    setGameInstanceKey((prev) => prev + 1);
  };
  
  const handlePreferencesSave = (newPrefs: { timerEnabled: boolean; moveTrackingEnabled: boolean; askAgain: boolean }) => {
    const updatedPrefs: SolitairePreferences = {
      timerEnabled: newPrefs.timerEnabled,
      moveTrackingEnabled: newPrefs.moveTrackingEnabled,
      askAgain: newPrefs.askAgain,
    };
    setPreferences(updatedPrefs);
    savePreferences(updatedPrefs);
  };
  
  const handlePileClick = (type: Selection['type'], index?: number, cardIndex?: number) => {
    const newSelection: Selection = { type, index, cardIndex };
    
    if (hint) {
      clearHint();
    }
    
    if (selection) {
      // Try to move - all pile types can be sources or targets
      // Click-based moves do NOT increment the move counter (isDragMove = false)
      move(selection, newSelection, false, preferences.moveTrackingEnabled);
    } else {
      // Select - allow selecting from waste, tableau, and foundation piles
      if (type === 'waste' && gameState.waste.length > 0) {
        select(newSelection);
      } else if (type === 'tableau' && index !== undefined) {
        const pile = gameState.tableau[index];
        if (cardIndex !== undefined && cardIndex >= 0 && pile[cardIndex]?.faceUp) {
          select({ type, index, cardIndex });
        }
      } else if (type === 'foundation' && index !== undefined) {
        const pile = gameState.foundations[index];
        if (pile.length > 0) {
          // Only allow selecting the top card from foundation
          select({ type, index, cardIndex: pile.length - 1 });
        }
      }
    }
  };
  
  const isHinted = (type: Selection['type'], index?: number, cardIndex?: number): boolean => {
    if (!hint) return false;
    
    if (type === 'waste' && hint.from.type === 'waste') return true;
    if (type === hint.from.type && hint.from.index === index && hint.from.cardIndex === cardIndex) return true;
    if (type === hint.to.type && hint.to.index === index) return cardIndex === -1;
    
    return false;
  };
  
  // Drag and drop handlers
  const handleDragStart = (payload: DragPayload, event: React.DragEvent) => {
    setDragData(event, payload);
    clearUIState();
    dragSessionActive.current = true;
    dropHandled.current = false;
  };
  
  const handleDragEnd = () => {
    // Always clear drag-over state when drag ends
    setDragOverTarget(null);
    dragSessionActive.current = false;
    dropHandled.current = false;
  };
  
  const handleDragOver = (type: 'tableau' | 'foundation', index: number) => (event: React.DragEvent) => {
    event.preventDefault();
    setDragOverTarget({ type, index });
  };
  
  const handleDragLeave = () => {
    setDragOverTarget(null);
  };
  
  const handleDrop = (type: 'tableau' | 'foundation', index: number) => (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOverTarget(null);
    dropHandled.current = true;
    
    const dragPayload = getDragData(event);
    if (!dragPayload) return;
    
    const from = dragPayloadToSelection(dragPayload);
    const to: Selection = { type, index };
    
    // Attempt the move - if it fails, the game state won't change
    // and the cards will remain in their original location
    // Drag-and-drop moves DO increment the move counter (isDragMove = true) if tracking enabled
    move(from, to, true, preferences.moveTrackingEnabled);
  };
  
  // Handle drops outside valid drop zones (background, header, footer, etc.)
  const handleDocumentDragOver = (event: React.DragEvent) => {
    if (dragSessionActive.current) {
      event.preventDefault();
    }
  };
  
  const handleDocumentDrop = (event: React.DragEvent) => {
    if (dragSessionActive.current && !dropHandled.current) {
      event.preventDefault();
      event.stopPropagation();
      // Drop outside valid zone - clear drag state but don't change game state
      setDragOverTarget(null);
      dragSessionActive.current = false;
      dropHandled.current = false;
    }
  };
  
  // Determine which cards are draggable
  const isWasteDraggable = (index: number) => {
    return index === gameState.waste.length - 1 && gameState.waste.length > 0;
  };
  
  const isTableauDraggable = (pileIndex: number) => (cardIndex: number) => {
    const pile = gameState.tableau[pileIndex];
    return cardIndex >= 0 && cardIndex < pile.length && pile[cardIndex].faceUp;
  };
  
  // Foundation cards are now draggable - only the top card
  const isFoundationDraggable = (pileIndex: number) => (cardIndex: number) => {
    const pile = gameState.foundations[pileIndex];
    return pile.length > 0 && cardIndex === pile.length - 1;
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      onDragOver={handleDocumentDragOver}
      onDrop={handleDocumentDrop}
    >
      {/* Header */}
      <header className="border-b border-border/40 bg-card/20">
        <div className="container mx-auto px-4 py-4 relative">
          <h1 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 bg-clip-text text-transparent">
            Simple Solitaire
          </h1>
          {/* Timer and Moves in upper right corner (desktop) */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-4">
            <GameTimer formattedTime={formattedTime} enabled={preferences.timerEnabled} />
            <GameMoves moves={moves} enabled={preferences.moveTrackingEnabled} />
          </div>
        </div>
      </header>

      {/* Main game area */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        {/* Timer and Moves (mobile - below header) */}
        <div className="flex sm:hidden items-center justify-center gap-4 mb-4">
          <GameTimer formattedTime={formattedTime} enabled={preferences.timerEnabled} />
          <GameMoves moves={moves} enabled={preferences.moveTrackingEnabled} />
        </div>

        {/* Game controls */}
        <div className="mb-6 sm:mb-8">
          <GameControls
            onNewGame={handleNewGameRequest}
            onUndo={undo}
            onHint={showHint}
            onScores={() => setScoresDialogOpen(true)}
            onPreferences={() => setPreferencesDialogOpen(true)}
            canUndo={canUndo}
          />
        </div>

        {/* Game board */}
        <div className="space-y-8 sm:space-y-12">
          {/* Top row: Stock, Waste, and Foundations */}
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start">
            {/* Stock pile */}
            <div
              data-card-wrapper="stock"
              className="solitaire-card-wrapper relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 bg-gradient-to-br from-blue-600 to-blue-800 border-blue-700 shadow-card flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-amber-300 active:ring-4 active:ring-amber-500"
              onClick={draw}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-blue-400/30" />
            </div>

            {/* Waste pile */}
            <PileView
              cards={gameState.waste}
              onCardClick={(cardIndex) => handlePileClick('waste', undefined, cardIndex)}
              selectedIndex={selection?.type === 'waste' ? selection.cardIndex : undefined}
              hintedIndex={hint?.from.type === 'waste' ? hint.from.cardIndex : undefined}
              isWasteStack={true}
              isDraggable={isWasteDraggable}
              onDragStart={(cardIndex, event) => {
                handleDragStart({ type: 'waste', cardIndex }, event);
              }}
              onDragEnd={handleDragEnd}
            />

            {/* Spacer */}
            <div className="hidden sm:block w-4" />

            {/* Foundation piles */}
            {gameState.foundations.map((foundation, index) => (
              <PileView
                key={index}
                cards={foundation}
                onCardClick={(cardIndex) => handlePileClick('foundation', index, cardIndex)}
                selectedIndex={selection?.type === 'foundation' && selection.index === index ? selection.cardIndex : undefined}
                hintedIndex={
                  hint?.from.type === 'foundation' && hint.from.index === index
                    ? hint.from.cardIndex
                    : hint?.to.type === 'foundation' && hint.to.index === index
                    ? -1
                    : undefined
                }
                isEmpty={true}
                emptyLabel={['A', 'A', 'A', 'A'][index]}
                isFoundationStack={true}
                isDropTarget={true}
                onDragOver={handleDragOver('foundation', index)}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop('foundation', index)}
                isDraggedOver={dragOverTarget?.type === 'foundation' && dragOverTarget.index === index}
                isDraggable={isFoundationDraggable(index)}
                onDragStart={(cardIndex, event) => {
                  handleDragStart({ type: 'foundation', index, cardIndex }, event);
                }}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>

          {/* Tableau piles */}
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start">
            {gameState.tableau.map((pile, index) => (
              <PileView
                key={index}
                cards={pile}
                onCardClick={(cardIndex) => handlePileClick('tableau', index, cardIndex)}
                selectedIndex={selection?.type === 'tableau' && selection.index === index ? selection.cardIndex : undefined}
                hintedIndex={
                  hint?.from.type === 'tableau' && hint.from.index === index
                    ? hint.from.cardIndex
                    : hint?.to.type === 'tableau' && hint.to.index === index
                    ? -1
                    : undefined
                }
                isEmpty={true}
                emptyLabel="K"
                isTableau={true}
                isDropTarget={true}
                onDragOver={handleDragOver('tableau', index)}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop('tableau', index)}
                isDraggedOver={dragOverTarget?.type === 'tableau' && dragOverTarget.index === index}
                isDraggable={isTableauDraggable(index)}
                onDragStart={(cardIndex, event) => {
                  handleDragStart({ type: 'tableau', index, cardIndex }, event);
                }}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/20 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'solitaire-app'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 transition-colors"
              >
                caffeine.ai
              </a>
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="X (Twitter)"
              >
                <SiX className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <SiFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <WinDialog
        open={isWon}
        onNewGame={handleNewGameRequest}
        currentTime={elapsedSeconds}
        currentMoves={moves}
        bestTimes={bestTimes}
        bestMoves={bestMoves}
        formatTime={formatTime}
        timerEnabled={preferences.timerEnabled}
        moveTrackingEnabled={preferences.moveTrackingEnabled}
      />

      <ScoresDialog
        open={scoresDialogOpen}
        onOpenChange={setScoresDialogOpen}
        bestTimes={bestTimes}
        bestMoves={bestMoves}
        formatTime={formatTime}
      />

      <NewGamePreferencesDialog
        open={newGameDialogOpen}
        onOpenChange={setNewGameDialogOpen}
        onConfirm={handleNewGameConfirm}
        defaultTimerEnabled={preferences.timerEnabled}
        defaultMoveTrackingEnabled={preferences.moveTrackingEnabled}
        defaultAskAgain={preferences.askAgain}
      />

      <GamePreferencesDialog
        open={preferencesDialogOpen}
        onOpenChange={setPreferencesDialogOpen}
        onSave={handlePreferencesSave}
        currentTimerEnabled={preferences.timerEnabled}
        currentMoveTrackingEnabled={preferences.moveTrackingEnabled}
        currentAskAgain={preferences.askAgain}
      />
    </div>
  );
}
