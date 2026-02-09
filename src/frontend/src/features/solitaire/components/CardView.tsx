import React from 'react';
import { Card } from '../solitaireTypes';

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

  return (
    <div
      className={`
        relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 
        ${card.faceUp 
          ? 'bg-white border-slate-300 shadow-md' 
          : 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-700'
        }
        ${isSelected ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900' : ''}
        ${isHinted ? 'ring-4 ring-green-400 ring-offset-2 ring-offset-slate-900 animate-pulse' : ''}
        ${onClick && card.faceUp ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
        ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}
        transition-all duration-200
      `}
      onClick={handleClick}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      {card.faceUp ? (
        <div className="absolute inset-0 p-1 sm:p-2 flex flex-col justify-between">
          <div className={`text-sm sm:text-lg font-bold ${isRed ? 'text-red-600' : 'text-slate-900'}`}>
            {card.rank}
            <div className="text-base sm:text-xl leading-none">{suitSymbol}</div>
          </div>
          <div className={`text-2xl sm:text-4xl text-center ${isRed ? 'text-red-600' : 'text-slate-900'}`}>
            {suitSymbol}
          </div>
          <div className={`text-sm sm:text-lg font-bold text-right ${isRed ? 'text-red-600' : 'text-slate-900'} rotate-180`}>
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
