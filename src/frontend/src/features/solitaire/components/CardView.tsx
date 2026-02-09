import React from 'react';
import { Card, Suit } from '../solitaireTypes';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface CardViewProps {
  card: Card;
  onClick?: () => void;
  isSelected?: boolean;
  isHinted?: boolean;
  offset?: number;
  className?: string;
  style?: React.CSSProperties;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent) => void;
  onDragEnd?: (event: React.DragEvent) => void;
  isLocked?: boolean;
}

const suitSymbols: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

const suitColors: Record<Suit, string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-foreground',
  spades: 'text-foreground',
};

export default function CardView({ 
  card, 
  onClick, 
  isSelected, 
  isHinted, 
  offset = 0, 
  className, 
  style,
  draggable = false,
  onDragStart,
  onDragEnd,
  isLocked = false,
}: CardViewProps) {
  const combinedStyle = {
    top: `${offset}px`,
    ...style,
  };

  if (!card.faceUp) {
    return (
      <div
        className={cn(
          'relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 cursor-pointer transition-all',
          'bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900',
          'border-emerald-600',
          'hover:scale-105 active:scale-95',
          isSelected && 'ring-2 ring-amber-400 ring-offset-2 ring-offset-background',
          isHinted && 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-background animate-pulse',
          className
        )}
        style={combinedStyle}
        onClick={onClick}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="absolute inset-2 border-2 border-emerald-600/40 rounded" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-emerald-600/60" />
        </div>
      </div>
    );
  }
  
  return (
    <div
      className={cn(
        'relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 transition-all',
        'bg-card border-border shadow-md',
        !isLocked && 'cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95',
        isLocked && 'cursor-not-allowed opacity-90',
        isSelected && 'ring-2 ring-amber-400 ring-offset-2 ring-offset-background scale-105',
        isHinted && 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-background animate-pulse',
        draggable && !isLocked && 'cursor-grab active:cursor-grabbing',
        className
      )}
      style={combinedStyle}
      onClick={!isLocked ? onClick : undefined}
      draggable={draggable && !isLocked}
      onDragStart={!isLocked ? onDragStart : undefined}
      onDragEnd={!isLocked ? onDragEnd : undefined}
    >
      <div className="absolute top-1 left-1.5 flex flex-col items-center leading-none">
        <span className={cn('text-sm sm:text-base font-bold', suitColors[card.suit])}>{card.rank}</span>
        <span className={cn('text-lg sm:text-xl', suitColors[card.suit])}>{suitSymbols[card.suit]}</span>
      </div>
      <div className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none rotate-180">
        <span className={cn('text-sm sm:text-base font-bold', suitColors[card.suit])}>{card.rank}</span>
        <span className={cn('text-lg sm:text-xl', suitColors[card.suit])}>{suitSymbols[card.suit]}</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn('text-4xl sm:text-5xl', suitColors[card.suit])}>{suitSymbols[card.suit]}</span>
      </div>
      {isLocked && (
        <div className="absolute top-0 right-0 bg-slate-800/80 rounded-bl-lg rounded-tr-lg p-1">
          <Lock className="w-3 h-3 text-amber-400/80" />
        </div>
      )}
    </div>
  );
}
