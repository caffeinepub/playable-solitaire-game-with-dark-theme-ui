import React from 'react';
import { Card } from '../solitaireTypes';
import CardView from './CardView';
import { cn } from '@/lib/utils';

interface PileViewProps {
  cards: Card[];
  onCardClick?: (index: number) => void;
  selectedIndex?: number;
  hintedIndex?: number;
  isTableau?: boolean;
  isWasteStack?: boolean;
  isFoundationStack?: boolean;
  isEmpty?: boolean;
  emptyLabel?: string;
  className?: string;
  // Drag and drop props
  onDragStart?: (index: number, event: React.DragEvent) => void;
  onDragEnd?: (event: React.DragEvent) => void;
  onDragOver?: (event: React.DragEvent) => void;
  onDragLeave?: (event: React.DragEvent) => void;
  onDrop?: (event: React.DragEvent) => void;
  isDraggable?: (index: number) => boolean;
  isDropTarget?: boolean;
  isDraggedOver?: boolean;
  isFoundationLocked?: boolean;
}

export default function PileView({
  cards,
  onCardClick,
  selectedIndex,
  hintedIndex,
  isTableau = false,
  isWasteStack = false,
  isFoundationStack = false,
  isEmpty = false,
  emptyLabel = '',
  className,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  isDraggable,
  isDropTarget = false,
  isDraggedOver = false,
  isFoundationLocked = false,
}: PileViewProps) {
  const showEmpty = isEmpty && cards.length === 0;
  
  // Tableau: vertical offset
  const tableauOffset = 28;
  
  const handleCardDragStart = (index: number) => (event: React.DragEvent) => {
    if (isDraggable && !isDraggable(index)) {
      event.preventDefault();
      return;
    }
    if (onDragStart) {
      onDragStart(index, event);
    }
  };
  
  const handleCardDragEnd = (event: React.DragEvent) => {
    if (onDragEnd) {
      onDragEnd(event);
    }
  };
  
  const handleDropZoneDragOver = (event: React.DragEvent) => {
    if (isDropTarget && onDragOver) {
      onDragOver(event);
    }
  };
  
  const handleDropZoneDragLeave = (event: React.DragEvent) => {
    // Only trigger if we're actually leaving the drop zone, not just moving to a child
    if (isDropTarget && onDragLeave && event.currentTarget === event.target) {
      onDragLeave(event);
    }
  };
  
  const handleDropZoneDrop = (event: React.DragEvent) => {
    if (isDropTarget && onDrop) {
      onDrop(event);
    }
  };
  
  if (showEmpty) {
    return (
      <div
        className={cn(
          'relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 border-dashed border-border/40 bg-muted/20 flex items-center justify-center transition-all',
          isDraggedOver && 'border-amber-400/60 bg-amber-400/10 scale-105',
          className
        )}
        onDragOver={handleDropZoneDragOver}
        onDragLeave={handleDropZoneDragLeave}
        onDrop={handleDropZoneDrop}
      >
        <span className="text-2xl text-muted-foreground/40 font-bold select-none">
          {emptyLabel}
        </span>
      </div>
    );
  }
  
  if (cards.length === 0) {
    return (
      <div className={cn('relative w-16 h-24 sm:w-20 sm:h-28', className)} />
    );
  }
  
  // Waste pile: show only the top card (single stack)
  if (isWasteStack) {
    const topCard = cards[cards.length - 1];
    const topIndex = cards.length - 1;
    const canDrag = isDraggable ? isDraggable(topIndex) : false;
    
    return (
      <div className={cn('relative w-16 h-24 sm:w-20 sm:h-28', className)}>
        <CardView
          card={topCard}
          onClick={onCardClick ? () => onCardClick(topIndex) : undefined}
          isSelected={selectedIndex === topIndex}
          isHinted={hintedIndex === topIndex}
          draggable={canDrag}
          onDragStart={canDrag ? handleCardDragStart(topIndex) : undefined}
          onDragEnd={canDrag ? handleCardDragEnd : undefined}
        />
      </div>
    );
  }
  
  // Foundation pile: fully overlapped, show only top card
  if (isFoundationStack) {
    const topCard = cards[cards.length - 1];
    const topIndex = cards.length - 1;
    const canDrag = isDraggable ? isDraggable(topIndex) : false;
    
    return (
      <div
        className={cn(
          'relative w-16 h-24 sm:w-20 sm:h-28 transition-all',
          isDraggedOver && 'scale-105',
          className
        )}
        onDragOver={handleDropZoneDragOver}
        onDragLeave={handleDropZoneDragLeave}
        onDrop={handleDropZoneDrop}
      >
        {/* Use card.id as key so React properly replaces the card when top card changes */}
        <div key={topCard.id}>
          <CardView
            card={topCard}
            onClick={undefined}
            isSelected={selectedIndex === topIndex}
            isHinted={hintedIndex === topIndex || hintedIndex === -1}
            draggable={false}
            onDragStart={undefined}
            onDragEnd={undefined}
            isLocked={isFoundationLocked}
          />
        </div>
      </div>
    );
  }
  
  // Tableau pile: vertical stack
  return (
    <div
      className={cn('relative', className)}
      style={{
        width: '80px',
        height: cards.length > 0 ? `${112 + (cards.length - 1) * tableauOffset}px` : '112px',
        minHeight: '112px',
      }}
      onDragOver={handleDropZoneDragOver}
      onDragLeave={handleDropZoneDragLeave}
      onDrop={handleDropZoneDrop}
    >
      {cards.map((card, index) => {
        const canDrag = isDraggable ? isDraggable(index) : false;
        
        return (
          <div
            key={card.id}
            className="absolute"
            style={{
              top: `${index * tableauOffset}px`,
              left: 0,
              zIndex: index,
            }}
          >
            <CardView
              card={card}
              onClick={card.faceUp && onCardClick ? () => onCardClick(index) : undefined}
              isSelected={selectedIndex === index}
              isHinted={hintedIndex === index || (hintedIndex === -1 && index === cards.length)}
              draggable={canDrag}
              onDragStart={canDrag ? handleCardDragStart(index) : undefined}
              onDragEnd={canDrag ? handleCardDragEnd : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
