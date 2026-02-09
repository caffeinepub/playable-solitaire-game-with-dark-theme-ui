import { Card, GameState, Rank, RANKS, SUITS, Suit, isRed, getRankValue, Selection } from './solitaireTypes';

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

// Helper to get cards from a selection
function getCardsFromSelection(state: GameState, selection: Selection): Card[] | null {
  if (selection.type === 'waste') {
    if (state.waste.length === 0) return null;
    return [state.waste[state.waste.length - 1]];
  } else if (selection.type === 'tableau' && selection.index !== undefined) {
    const pile = state.tableau[selection.index];
    const cardIndex = selection.cardIndex ?? pile.length - 1;
    if (cardIndex < 0 || cardIndex >= pile.length || !pile[cardIndex].faceUp) return null;
    return pile.slice(cardIndex);
  } else if (selection.type === 'foundation' && selection.index !== undefined) {
    const pile = state.foundations[selection.index];
    if (pile.length === 0) return null;
    return [pile[pile.length - 1]];
  }
  return null;
}

// Validate if a move is legal
export function canMoveToTableau(state: GameState, from: Selection, to: Selection): boolean {
  if (to.type !== 'tableau' || to.index === undefined) return false;
  
  const cards = getCardsFromSelection(state, from);
  if (!cards || cards.length === 0) return false;
  
  const targetPile = state.tableau[to.index];
  return canPlaceOnTableau(cards[0], targetPile);
}

export function canMoveToFoundation(state: GameState, from: Selection, to: Selection): boolean {
  if (to.type !== 'foundation' || to.index === undefined) return false;
  
  const cards = getCardsFromSelection(state, from);
  if (!cards || cards.length !== 1) return false;
  
  const targetPile = state.foundations[to.index];
  return canPlaceOnFoundation(cards[0], targetPile);
}

// Execute a move
export function moveCards(state: GameState, from: Selection, to: Selection): GameState {
  const newState = { ...state };
  
  // Get cards to move
  let cardsToMove: Card[] = [];
  
  if (from.type === 'waste') {
    if (newState.waste.length === 0) return state;
    cardsToMove = [newState.waste[newState.waste.length - 1]];
    newState.waste = newState.waste.slice(0, -1);
  } else if (from.type === 'tableau' && from.index !== undefined) {
    const pile = [...newState.tableau[from.index]];
    const cardIndex = from.cardIndex ?? pile.length - 1;
    if (cardIndex < 0 || cardIndex >= pile.length) return state;
    
    cardsToMove = pile.slice(cardIndex);
    newState.tableau = [...newState.tableau] as typeof newState.tableau;
    newState.tableau[from.index] = pile.slice(0, cardIndex);
    
    // Flip top card if it exists and is face down
    if (newState.tableau[from.index].length > 0) {
      const topCard = newState.tableau[from.index][newState.tableau[from.index].length - 1];
      if (!topCard.faceUp) {
        newState.tableau[from.index] = [...newState.tableau[from.index]];
        newState.tableau[from.index][newState.tableau[from.index].length - 1] = {
          ...topCard,
          faceUp: true,
        };
      }
    }
  } else if (from.type === 'foundation' && from.index !== undefined) {
    const pile = newState.foundations[from.index];
    if (pile.length === 0) return state;
    cardsToMove = [pile[pile.length - 1]];
    newState.foundations = [...newState.foundations] as typeof newState.foundations;
    newState.foundations[from.index] = pile.slice(0, -1);
  }
  
  if (cardsToMove.length === 0) return state;
  
  // Place cards at destination
  if (to.type === 'tableau' && to.index !== undefined) {
    newState.tableau = [...newState.tableau] as typeof newState.tableau;
    newState.tableau[to.index] = [...newState.tableau[to.index], ...cardsToMove];
  } else if (to.type === 'foundation' && to.index !== undefined) {
    if (cardsToMove.length !== 1) return state;
    newState.foundations = [...newState.foundations] as typeof newState.foundations;
    newState.foundations[to.index] = [...newState.foundations[to.index], cardsToMove[0]];
  }
  
  return newState;
}
