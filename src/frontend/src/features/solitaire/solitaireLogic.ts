import { Card, GameState, Rank, RANKS, SUITS, Suit, isRed, getRankValue } from './solitaireTypes';

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        suit,
        rank,
        faceUp: false,
        id: `${suit}-${rank}`,
      });
    }
  }
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function dealInitialGame(): GameState {
  const deck = shuffleDeck(createDeck());
  const tableau: [Card[], Card[], Card[], Card[], Card[], Card[], Card[]] = [[], [], [], [], [], [], []];
  
  let deckIndex = 0;
  for (let i = 0; i < 7; i++) {
    for (let j = i; j < 7; j++) {
      const card = { ...deck[deckIndex++] };
      card.faceUp = j === i;
      tableau[j].push(card);
    }
  }
  
  const stock = deck.slice(deckIndex).map(c => ({ ...c, faceUp: false }));
  
  return {
    stock,
    waste: [],
    foundations: [[], [], [], []],
    tableau,
  };
}

export function canPlaceOnTableau(card: Card, targetPile: Card[]): boolean {
  if (targetPile.length === 0) {
    return card.rank === 'K';
  }
  
  const topCard = targetPile[targetPile.length - 1];
  if (!topCard.faceUp) return false;
  
  const cardValue = getRankValue(card.rank);
  const topValue = getRankValue(topCard.rank);
  
  return cardValue === topValue - 1 && isRed(card.suit) !== isRed(topCard.suit);
}

export function canPlaceOnFoundation(card: Card, foundationPile: Card[]): boolean {
  if (foundationPile.length === 0) {
    return card.rank === 'A';
  }
  
  const topCard = foundationPile[foundationPile.length - 1];
  const cardValue = getRankValue(card.rank);
  const topValue = getRankValue(topCard.rank);
  
  return card.suit === topCard.suit && cardValue === topValue + 1;
}

export function drawFromStock(state: GameState): GameState {
  if (state.stock.length === 0) {
    if (state.waste.length === 0) return state;
    
    return {
      ...state,
      stock: state.waste.map(c => ({ ...c, faceUp: false })).reverse(),
      waste: [],
    };
  }
  
  const newStock = [...state.stock];
  const drawnCard = { ...newStock.pop()!, faceUp: true };
  
  return {
    ...state,
    stock: newStock,
    waste: [...state.waste, drawnCard],
  };
}
