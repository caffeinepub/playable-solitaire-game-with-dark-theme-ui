import React from 'react';
import CardView from './CardView';
import { Card } from '../solitaireTypes';

interface PileViewProps {
  cards: Card[];
  onCardClick?: (cardIndex: number) => void;
  selectedIndex?: number;
  hintedIndex?: number;
  isEmpty?: boolean;
  emptyLabel?: string;
  isWasteStack?: boolean;
  isFoundationStack?: boolean;
  isTableau?: boolean;
  isDropTarget?: boolean;
  onDragOver?: (event: React.DragEvent) => void;
  onDragLeave?: () => void;
  onDrop?: (event: React.DragEvent) => void;
  isDraggable?: (cardIndex: number) => boolean;
  onDragStart?: (cardIndex: number, event: React.DragEvent) => void;
  onDragEnd?: () => void;
  isDraggedOver?: boolean;
}

export default function PileView({
  cards,
  onCardClick,
  selectedIndex,
  hintedIndex,
  isEmpty = false,
  emptyLabel = '',
  isWasteStack = false,
  isFoundationStack = false,
  isTableau = false,
  isDropTarget = false,
  onDragOver,
  onDragLeave,
  onDrop,
  isDraggable,
  onDragStart,
  onDragEnd,
  isDraggedOver = false,
}: PileViewProps) {
  // Empty pile placeholder
  if (cards.length === 0 && isEmpty) {
    return (
      <div
        className={`
          relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 border-dashed 
          ${isDraggedOver 
            ? 'border-amber-400 bg-amber-400/20' 
            : 'border-border/40 bg-muted/20'
          }
          flex items-center justify-center
          ${isDropTarget ? 'transition-all duration-200' : ''}
          ${isTableau ? 'min-h-[6rem] sm:min-h-[7rem]' : ''}
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <span className="text-2xl sm:text-3xl text-muted-foreground/30 font-bold select-none">
          {emptyLabel}
        </span>
      </div>
    );
  }

  // Waste pile - show only top card
  if (isWasteStack) {
    const topCard = cards[cards.length - 1];
    if (!topCard) {
      return (
        <div className="relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 border-dashed border-border/40 bg-muted/20 flex items-center justify-center">
          <span className="text-xs text-muted-foreground/50 font-medium">Waste</span>
        </div>
      );
    }

    const cardIndex = cards.length - 1;
    const canDrag = isDraggable ? isDraggable(cardIndex) : false;

    return (
      <div data-card-wrapper="waste" className="solitaire-card-wrapper">
        <CardView
          card={topCard}
          onClick={onCardClick ? () => onCardClick(cardIndex) : undefined}
          isSelected={selectedIndex === cardIndex}
          isHinted={hintedIndex === cardIndex}
          isDraggable={canDrag}
          onDragStart={onDragStart ? (event) => onDragStart(cardIndex, event) : undefined}
          onDragEnd={onDragEnd}
        />
      </div>
    );
  }

  // Foundation pile - show only top card
  if (isFoundationStack) {
    const topCard = cards[cards.length - 1];
    if (!topCard) {
      return (
        <div
          className={`
            relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 border-dashed 
            ${isDraggedOver 
              ? 'border-amber-400 bg-amber-400/20' 
              : 'border-border/40 bg-muted/20'
            }
            flex items-center justify-center transition-all duration-200
          `}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <span className="text-2xl sm:text-3xl text-muted-foreground/30 font-bold select-none">
            {emptyLabel}
          </span>
        </div>
      );
    }

    const cardIndex = cards.length - 1;
    const canDrag = isDraggable ? isDraggable(cardIndex) : false;

    return (
      <div
        data-card-wrapper="foundation"
        className="solitaire-card-wrapper relative"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <CardView
          card={topCard}
          onClick={onCardClick ? () => onCardClick(cardIndex) : undefined}
          isSelected={selectedIndex === cardIndex}
          isHinted={hintedIndex === cardIndex || hintedIndex === -1}
          isDraggable={canDrag}
          onDragStart={onDragStart ? (event) => onDragStart(cardIndex, event) : undefined}
          onDragEnd={onDragEnd}
        />
      </div>
    );
  }

  // Tableau pile - cascade cards
  if (isTableau) {
    return (
      <div
        className={`
          relative w-16 sm:w-20
          ${isDraggedOver && cards.length === 0 ? 'ring-2 ring-amber-400' : ''}
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {cards.length === 0 && isEmpty ? (
          <div className="relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 border-dashed border-border/40 bg-muted/20 flex items-center justify-center">
            <span className="text-2xl sm:text-3xl text-muted-foreground/30 font-bold select-none">
              {emptyLabel}
            </span>
          </div>
        ) : (
          cards.map((card, index) => {
            const canDrag = isDraggable ? isDraggable(index) : false;
            return (
              <div
                key={card.id}
                data-card-wrapper="tableau"
                className="solitaire-card-wrapper absolute"
                style={{ top: `${index * 1.5}rem` }}
              >
                <CardView
                  card={card}
                  onClick={onCardClick ? () => onCardClick(index) : undefined}
                  isSelected={selectedIndex === index}
                  isHinted={hintedIndex === index || (hintedIndex === -1 && index === cards.length)}
                  isDraggable={canDrag}
                  onDragStart={onDragStart ? (event) => onDragStart(index, event) : undefined}
                  onDragEnd={onDragEnd}
                />
              </div>
            );
          })
        )}
      </div>
    );
  }

  // Default: single card view
  if (cards.length > 0) {
    return (
      <div data-card-wrapper="default" className="solitaire-card-wrapper">
        <CardView card={cards[0]} />
      </div>
    );
  }

  return null;
}
