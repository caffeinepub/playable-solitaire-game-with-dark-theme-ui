import React from 'react';
import { Card } from '../solitaireTypes';
import { disableAdvancedShading } from '../../../config/visualEffects';
import { useBackgroundImageRendering, useImgRendering } from '../../../config/cardRenderMode';
import { getCardBackgroundImage, getCardImageSrc } from './cardBackgroundImages';

interface CardViewProps {
  card: Card;
  onClick?: () => void;
  isSelected?: boolean;
  isHinted?: boolean;
  isDraggable?: boolean;
  onDragStart?: (event: React.DragEvent) => void;
  onDragEnd?: () => void;
}

export default function CardView({
  card,
  onClick,
  isSelected = false,
  isHinted = false,
  isDraggable = false,
  onDragStart,
  onDragEnd,
}: CardViewProps) {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  const suitSymbol = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
  }[card.suit];

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleDragStart = (event: React.DragEvent) => {
    if (isDraggable && onDragStart) {
      onDragStart(event);
    }
  };

  // <img> rendering mode
  if (useImgRendering) {
    return (
      <div
        data-card="true"
        className={`
          solitaire-card
          relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 overflow-hidden
          ${card.faceUp 
            ? `bg-card-surface border-card-border ${disableAdvancedShading ? '' : 'shadow-card'}` 
            : `bg-card-back border-card-back-border ${disableAdvancedShading ? '' : 'shadow-card'}`
          }
          ${isSelected ? 'ring-4 ring-amber-400 ring-offset-0' : ''}
          ${isHinted ? 'ring-4 ring-green-400 ring-offset-0 animate-pulse' : ''}
          ${onClick && card.faceUp ? 'cursor-pointer hover:ring-2 hover:ring-amber-300 active:ring-4 active:ring-amber-500' : ''}
          ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}
        `}
        onClick={handleClick}
        draggable={isDraggable}
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
      >
        {/* Image element - absolutely positioned, pointer-events-none to allow container interactions */}
        <img 
          src={getCardImageSrc(card)}
          alt={card.faceUp ? `${card.rank} of ${card.suit}` : 'Card back'}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none rounded-lg"
          draggable={false}
        />
      </div>
    );
  }

  // Background-image rendering mode
  if (useBackgroundImageRendering) {
    return (
      <div
        data-card="true"
        className={`
          solitaire-card
          relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 overflow-hidden
          ${card.faceUp 
            ? `bg-card-surface border-card-border ${disableAdvancedShading ? '' : 'shadow-card'}` 
            : `bg-card-back border-card-back-border ${disableAdvancedShading ? '' : 'shadow-card'}`
          }
          ${isSelected ? 'ring-4 ring-amber-400 ring-offset-0' : ''}
          ${isHinted ? 'ring-4 ring-green-400 ring-offset-0 animate-pulse' : ''}
          ${onClick && card.faceUp ? 'cursor-pointer hover:ring-2 hover:ring-amber-300 active:ring-4 active:ring-amber-500' : ''}
          ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}
        `}
        onClick={handleClick}
        draggable={isDraggable}
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
      >
        {/* Background-image layer - absolutely positioned, no filters/transforms */}
        <div 
          className="card-background-layer absolute inset-0 rounded-lg pointer-events-none"
          style={{
            backgroundImage: getCardBackgroundImage(card),
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>
    );
  }

  // Default DOM rendering mode
  return (
    <div
      data-card="true"
      className={`
        solitaire-card
        relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 overflow-hidden
        ${card.faceUp 
          ? `bg-card-surface border-card-border ${disableAdvancedShading ? '' : 'shadow-card'}` 
          : `bg-card-back border-card-back-border ${disableAdvancedShading ? '' : 'shadow-card'}`
        }
        ${isSelected ? 'ring-4 ring-amber-400 ring-offset-0' : ''}
        ${isHinted ? 'ring-4 ring-green-400 ring-offset-0 animate-pulse' : ''}
        ${onClick && card.faceUp ? 'cursor-pointer hover:ring-2 hover:ring-amber-300 active:ring-4 active:ring-amber-500' : ''}
        ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}
      `}
      onClick={handleClick}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      {card.faceUp ? (
        <div className="absolute inset-0 p-1 sm:p-2 flex flex-col justify-between">
          <div className={`text-sm sm:text-lg font-bold ${isRed ? 'text-card-suit-red' : 'text-card-suit-black'}`}>
            {card.rank}
            <div className="text-base sm:text-xl leading-none">{suitSymbol}</div>
          </div>
          <div className={`text-2xl sm:text-4xl text-center ${isRed ? 'text-card-suit-red' : 'text-card-suit-black'}`}>
            {suitSymbol}
          </div>
          <div className={`text-sm sm:text-lg font-bold text-right ${isRed ? 'text-card-suit-red' : 'text-card-suit-black'} rotate-180`}>
            {card.rank}
            <div className="text-base sm:text-xl leading-none">{suitSymbol}</div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-blue-400/30" />
        </div>
      )}
    </div>
  );
}
