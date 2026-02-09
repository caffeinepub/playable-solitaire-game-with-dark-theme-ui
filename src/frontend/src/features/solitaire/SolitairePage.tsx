import React, { useEffect, useState, useRef } from 'react';
import { useSolitaireGame } from './useSolitaireGame';
import PileView from './components/PileView';
import GameControls from './components/GameControls';
import WinDialog from './components/WinDialog';
import { Selection, DragPayload } from './solitaireTypes';
import { SiX, SiFacebook, SiInstagram } from 'react-icons/si';
import { setDragData, getDragData, dragPayloadToSelection } from './solitaireDrag';

export default function SolitairePage() {
  const {
    gameState,
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
  const dragSessionActive = useRef(false);
  const dropHandled = useRef(false);
  
  useEffect(() => {
    if (hint) {
      const timer = setTimeout(() => clearHint(), 3000);
      return () => clearTimeout(timer);
    }
  }, [hint, clearHint]);
  
  const handlePileClick = (type: Selection['type'], index?: number, cardIndex?: number) => {
    const newSelection: Selection = { type, index, cardIndex };
    
    if (hint) {
      clearHint();
    }
    
    if (selection) {
      // Try to move - foundations can be targets but not sources
      move(selection, newSelection);
    } else {
      // Select - do NOT allow selecting from foundation piles
      if (type === 'waste' && gameState.waste.length > 0) {
        select(newSelection);
      } else if (type === 'tableau' && index !== undefined) {
        const pile = gameState.tableau[index];
        if (cardIndex !== undefined && cardIndex >= 0 && pile[cardIndex]?.faceUp) {
          select({ type, index, cardIndex });
        }
      }
      // Foundation selection removed - foundations are locked as sources
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
    // Reject any drag from foundation piles
    if (payload.type === 'foundation') {
      event.preventDefault();
      return;
    }
    
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
    
    // Additional validation: reject foundation sources
    if (dragPayload.type === 'foundation') {
      return;
    }
    
    const from = dragPayloadToSelection(dragPayload);
    const to: Selection = { type, index };
    
    // Attempt the move - if it fails, the game state won't change
    // and the cards will remain in their original location
    move(from, to);
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
  
  // Foundation cards are NEVER draggable - they are locked once placed
  const isFoundationDraggable = () => {
    return false;
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      onDragOver={handleDocumentDragOver}
      onDrop={handleDocumentDrop}
    >
      {/* Header */}
      <header className="border-b border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 bg-clip-text text-transparent">
            Klondike Solitaire
          </h1>
        </div>
      </header>
      
      {/* Main Game Area */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Controls */}
          <GameControls
            onNewGame={newGame}
            onUndo={undo}
            onHint={showHint}
            canUndo={canUndo}
          />
          
          {/* Top Row: Stock, Waste, and Foundations */}
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-between items-start">
            <div className="flex gap-3 sm:gap-4">
              {/* Stock */}
              <div
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                onClick={draw}
              >
                {gameState.stock.length > 0 ? (
                  <PileView
                    cards={[gameState.stock[gameState.stock.length - 1]]}
                    emptyLabel="Stock"
                  />
                ) : (
                  <div className="relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 border-dashed border-border/40 bg-muted/20 flex items-center justify-center hover:border-border/60 hover:bg-muted/30 transition-colors">
                    <span className="text-xs text-muted-foreground/50 font-medium">Reset</span>
                  </div>
                )}
              </div>
              
              {/* Waste */}
              <PileView
                cards={gameState.waste}
                onCardClick={() => handlePileClick('waste')}
                selectedIndex={selection?.type === 'waste' ? gameState.waste.length - 1 : undefined}
                hintedIndex={isHinted('waste') ? gameState.waste.length - 1 : undefined}
                isWasteStack={true}
                emptyLabel="Waste"
                isDraggable={isWasteDraggable}
                onDragStart={(index, event) => {
                  handleDragStart({ type: 'waste', cardIndex: index }, event);
                }}
                onDragEnd={handleDragEnd}
              />
            </div>
            
            {/* Foundations */}
            <div className="flex gap-3 sm:gap-4">
              {gameState.foundations.map((foundation, index) => (
                <PileView
                  key={index}
                  cards={foundation}
                  onCardClick={() => handlePileClick('foundation', index, foundation.length - 1)}
                  selectedIndex={selection?.type === 'foundation' && selection.index === index ? foundation.length - 1 : undefined}
                  hintedIndex={isHinted('foundation', index, -1) ? -1 : isHinted('foundation', index, foundation.length - 1) ? foundation.length - 1 : undefined}
                  isEmpty={true}
                  emptyLabel={['♥', '♦', '♣', '♠'][index]}
                  isFoundationStack={true}
                  isDropTarget={true}
                  onDragOver={handleDragOver('foundation', index)}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop('foundation', index)}
                  isDraggable={isFoundationDraggable}
                  onDragStart={(cardIndex, event) => {
                    handleDragStart({ type: 'foundation', index, cardIndex }, event);
                  }}
                  onDragEnd={handleDragEnd}
                  isDraggedOver={dragOverTarget?.type === 'foundation' && dragOverTarget.index === index}
                  isFoundationLocked={true}
                />
              ))}
            </div>
          </div>
          
          {/* Tableau */}
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-between">
            {gameState.tableau.map((pile, pileIndex) => (
              <PileView
                key={pileIndex}
                cards={pile}
                onCardClick={(cardIndex) => handlePileClick('tableau', pileIndex, cardIndex)}
                selectedIndex={
                  selection?.type === 'tableau' && selection.index === pileIndex
                    ? selection.cardIndex
                    : undefined
                }
                hintedIndex={
                  isHinted('tableau', pileIndex, -1)
                    ? -1
                    : hint?.from.type === 'tableau' && hint.from.index === pileIndex
                    ? hint.from.cardIndex
                    : undefined
                }
                isTableau={true}
                isEmpty={true}
                isDropTarget={true}
                onDragOver={handleDragOver('tableau', pileIndex)}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop('tableau', pileIndex)}
                isDraggable={isTableauDraggable(pileIndex)}
                onDragStart={(cardIndex, event) => {
                  handleDragStart({ type: 'tableau', index: pileIndex, cardIndex }, event);
                }}
                onDragEnd={handleDragEnd}
                isDraggedOver={dragOverTarget?.type === 'tableau' && dragOverTarget.index === pileIndex}
              />
            ))}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()}</span>
              <span>•</span>
              <span>
                Built with ❤️ using{' '}
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
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-amber-400 transition-colors"
                aria-label="Twitter"
              >
                <SiX className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-amber-400 transition-colors"
                aria-label="Facebook"
              >
                <SiFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-amber-400 transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Win Dialog */}
      <WinDialog open={isWon} onNewGame={newGame} />
    </div>
  );
}
