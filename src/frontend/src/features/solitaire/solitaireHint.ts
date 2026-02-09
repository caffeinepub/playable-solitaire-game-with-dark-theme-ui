import { GameState, HintData, Selection } from './solitaireTypes';
import { canPlaceOnFoundation, canPlaceOnTableau } from './solitaireLogic';

export function findHint(state: GameState): HintData | null {
  // Check waste to foundation
  if (state.waste.length > 0) {
    const wasteCard = state.waste[state.waste.length - 1];
    for (let i = 0; i < 4; i++) {
      if (canPlaceOnFoundation(wasteCard, state.foundations[i])) {
        return {
          from: { type: 'waste' },
          to: { type: 'foundation', index: i },
        };
      }
    }
  }
  
  // Check waste to tableau
  if (state.waste.length > 0) {
    const wasteCard = state.waste[state.waste.length - 1];
    for (let i = 0; i < 7; i++) {
      if (canPlaceOnTableau(wasteCard, state.tableau[i])) {
        return {
          from: { type: 'waste' },
          to: { type: 'tableau', index: i },
        };
      }
    }
  }
  
  // Check tableau to foundation
  for (let i = 0; i < 7; i++) {
    const pile = state.tableau[i];
    if (pile.length > 0) {
      const topCard = pile[pile.length - 1];
      if (topCard.faceUp) {
        for (let j = 0; j < 4; j++) {
          if (canPlaceOnFoundation(topCard, state.foundations[j])) {
            return {
              from: { type: 'tableau', index: i, cardIndex: pile.length - 1 },
              to: { type: 'foundation', index: j },
            };
          }
        }
      }
    }
  }
  
  // Check tableau to tableau
  for (let i = 0; i < 7; i++) {
    const pile = state.tableau[i];
    for (let cardIdx = 0; cardIdx < pile.length; cardIdx++) {
      const card = pile[cardIdx];
      if (card.faceUp) {
        for (let j = 0; j < 7; j++) {
          if (i !== j && canPlaceOnTableau(card, state.tableau[j])) {
            return {
              from: { type: 'tableau', index: i, cardIndex: cardIdx },
              to: { type: 'tableau', index: j },
            };
          }
        }
      }
    }
  }
  
  // NOTE: Foundation piles are locked - never suggest moves FROM foundations
  // This ensures hints never use foundation as a source
  
  // Check if can draw from stock
  if (state.stock.length > 0) {
    return {
      from: { type: 'waste' },
      to: { type: 'waste' },
    };
  }
  
  return null;
}
