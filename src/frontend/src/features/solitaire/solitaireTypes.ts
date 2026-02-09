export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
  id: string;
}

export interface GameState {
  stock: Card[];
  waste: Card[];
  foundations: [Card[], Card[], Card[], Card[]];
  tableau: [Card[], Card[], Card[], Card[], Card[], Card[], Card[]];
}

export interface Selection {
  type: 'waste' | 'foundation' | 'tableau';
  index?: number;
  cardIndex?: number;
}

export interface HintData {
  from: Selection;
  to: Selection;
}

export interface DragPayload {
  type: 'waste' | 'foundation' | 'tableau';
  index?: number;
  cardIndex?: number;
}

export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

export function isRed(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}

export function getRankValue(rank: Rank): number {
  return RANKS.indexOf(rank) + 1;
}
