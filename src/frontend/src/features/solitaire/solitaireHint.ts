import { GameState, HintData, Selection } from './solitaireTypes';
import { canMoveToTableau, canMoveToFoundation } from './solitaireLogic';

export function findHint(state: GameState): HintData | null {
  // Priority 1: Waste to foundation
  if (state.waste.length > 0) {
    for (let foundationIndex = 0; foundationIndex < 4; foundationIndex++) {
      const from: Selection = { type: 'waste' };
      const to: Selection = { type: 'foundation', index: foundationIndex };
      if (canMoveToFoundation(state, from, to)) {
        return { from, to };
      }
    }
  }

  // Priority 2: Tableau to foundation
  for (let tableauIndex = 0; tableauIndex < 7; tableauIndex++) {
    const pile = state.tableau[tableauIndex];
    if (pile.length > 0) {
      const topCardIndex = pile.length - 1;
      for (let foundationIndex = 0; foundationIndex < 4; foundationIndex++) {
        const from: Selection = { type: 'tableau', index: tableauIndex, cardIndex: topCardIndex };
        const to: Selection = { type: 'foundation', index: foundationIndex };
        if (canMoveToFoundation(state, from, to)) {
          return { from, to };
        }
      }
    }
  }

  // Priority 3: Foundation to tableau
  for (let foundationIndex = 0; foundationIndex < 4; foundationIndex++) {
    const pile = state.foundations[foundationIndex];
    if (pile.length > 0) {
      const topCardIndex = pile.length - 1;
      for (let tableauIndex = 0; tableauIndex < 7; tableauIndex++) {
        const from: Selection = { type: 'foundation', index: foundationIndex, cardIndex: topCardIndex };
        const to: Selection = { type: 'tableau', index: tableauIndex };
        if (canMoveToTableau(state, from, to)) {
          return { from, to };
        }
      }
    }
  }

  // Priority 4: Waste to tableau
  if (state.waste.length > 0) {
    for (let tableauIndex = 0; tableauIndex < 7; tableauIndex++) {
      const from: Selection = { type: 'waste' };
      const to: Selection = { type: 'tableau', index: tableauIndex };
      if (canMoveToTableau(state, from, to)) {
        return { from, to };
      }
    }
  }

  // Priority 5: Tableau to tableau
  for (let fromTableauIndex = 0; fromTableauIndex < 7; fromTableauIndex++) {
    const pile = state.tableau[fromTableauIndex];
    for (let cardIndex = 0; cardIndex < pile.length; cardIndex++) {
      if (!pile[cardIndex].faceUp) continue;
      
      for (let toTableauIndex = 0; toTableauIndex < 7; toTableauIndex++) {
        if (fromTableauIndex === toTableauIndex) continue;
        
        const from: Selection = { type: 'tableau', index: fromTableauIndex, cardIndex };
        const to: Selection = { type: 'tableau', index: toTableauIndex };
        if (canMoveToTableau(state, from, to)) {
          return { from, to };
        }
      }
    }
  }

  return null;
}
