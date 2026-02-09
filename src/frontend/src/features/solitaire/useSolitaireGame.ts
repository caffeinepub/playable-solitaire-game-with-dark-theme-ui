import { useReducer, useCallback } from 'react';
import { GameState, Selection, HintData } from './solitaireTypes';
import { dealInitialGame, drawFromStock, canPlaceOnTableau, canPlaceOnFoundation } from './solitaireLogic';
import { createHistory, pushHistory, popHistory, canUndo, HistoryState } from './solitaireHistory';
import { findHint } from './solitaireHint';
import { checkWin } from './solitaireWin';

interface SolitaireState {
  history: HistoryState;
  selection: Selection | null;
  hint: HintData | null;
  isWon: boolean;
}

type Action =
  | { type: 'NEW_GAME' }
  | { type: 'DRAW' }
  | { type: 'SELECT'; selection: Selection }
  | { type: 'MOVE'; from: Selection; to: Selection; isDragMove?: boolean }
  | { type: 'UNDO' }
  | { type: 'SHOW_HINT' }
  | { type: 'CLEAR_HINT' }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'CLEAR_UI_STATE' };

function reducer(state: SolitaireState, action: Action): SolitaireState {
  switch (action.type) {
    case 'NEW_GAME': {
      const newGame = dealInitialGame();
      return {
        history: createHistory(newGame),
        selection: null,
        hint: null,
        isWon: false,
      };
    }
    
    case 'DRAW': {
      const newState = drawFromStock(state.history.present);
      // Draw does not increment move counter
      return {
        ...state,
        history: pushHistory(state.history, newState, false),
        selection: null,
        hint: null,
        isWon: false,
      };
    }
    
    case 'SELECT': {
      return {
        ...state,
        selection: action.selection,
        hint: null,
      };
    }
    
    case 'MOVE': {
      const newState = performMove(state.history.present, action.from, action.to);
      
      // If move is invalid (returns null), clear UI state but don't change game state
      if (!newState) {
        return {
          ...state,
          selection: null,
          hint: null,
        };
      }
      
      const isWon = checkWin(newState);
      // Only increment move counter for drag moves (isDragMove === true)
      const shouldIncrementMoves = action.isDragMove === true;
      
      return {
        ...state,
        history: pushHistory(state.history, newState, shouldIncrementMoves),
        selection: null,
        hint: null,
        isWon,
      };
    }
    
    case 'UNDO': {
      if (!canUndo(state.history)) return state;
      return {
        ...state,
        history: popHistory(state.history),
        selection: null,
        hint: null,
        isWon: false,
      };
    }
    
    case 'SHOW_HINT': {
      const hint = findHint(state.history.present);
      return {
        ...state,
        hint,
        selection: null,
      };
    }
    
    case 'CLEAR_HINT': {
      return {
        ...state,
        hint: null,
      };
    }
    
    case 'CLEAR_SELECTION': {
      return {
        ...state,
        selection: null,
      };
    }
    
    case 'CLEAR_UI_STATE': {
      return {
        ...state,
        selection: null,
        hint: null,
      };
    }
    
    default:
      return state;
  }
}

function performMove(state: GameState, from: Selection, to: Selection): GameState | null {
  const newState = { ...state };
  
  // Get source cards
  let sourceCards: typeof state.waste | typeof state.tableau[0] | null = null;
  let cardIndex = 0;
  
  if (from.type === 'waste') {
    if (state.waste.length === 0) return null;
    sourceCards = state.waste;
    cardIndex = state.waste.length - 1;
  } else if (from.type === 'tableau' && from.index !== undefined) {
    sourceCards = state.tableau[from.index];
    cardIndex = from.cardIndex ?? sourceCards.length - 1;
  } else if (from.type === 'foundation' && from.index !== undefined) {
    sourceCards = state.foundations[from.index];
    cardIndex = sourceCards.length - 1;
  }
  
  if (!sourceCards || sourceCards.length === 0) return null;
  
  const movingCards = sourceCards.slice(cardIndex);
  if (movingCards.length === 0 || !movingCards[0].faceUp) return null;
  
  // Validate and perform move
  if (to.type === 'foundation' && to.index !== undefined) {
    if (movingCards.length !== 1) return null;
    if (!canPlaceOnFoundation(movingCards[0], state.foundations[to.index])) return null;
    
    newState.foundations = [...state.foundations] as typeof state.foundations;
    newState.foundations[to.index] = [...state.foundations[to.index], movingCards[0]];
  } else if (to.type === 'tableau' && to.index !== undefined) {
    if (!canPlaceOnTableau(movingCards[0], state.tableau[to.index])) return null;
    
    // Clone the entire tableau array first
    newState.tableau = [...state.tableau] as typeof state.tableau;
    // Add cards to target pile
    newState.tableau[to.index] = [...state.tableau[to.index], ...movingCards];
  } else {
    return null;
  }
  
  // Remove from source - must happen after target update to preserve tableau changes
  if (from.type === 'waste') {
    newState.waste = state.waste.slice(0, -1);
  } else if (from.type === 'tableau' && from.index !== undefined) {
    // If tableau wasn't already cloned (non-tableau target), clone it now
    if (!newState.tableau || newState.tableau === state.tableau) {
      newState.tableau = [...state.tableau] as typeof state.tableau;
    }
    // Update the source pile in the already-cloned tableau
    newState.tableau[from.index] = sourceCards.slice(0, cardIndex);
    
    // Flip top card if needed
    const pile = newState.tableau[from.index];
    if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
      pile[pile.length - 1] = { ...pile[pile.length - 1], faceUp: true };
    }
  } else if (from.type === 'foundation' && from.index !== undefined) {
    newState.foundations = [...state.foundations] as typeof state.foundations;
    newState.foundations[from.index] = sourceCards.slice(0, -1);
  }
  
  return newState;
}

export function useSolitaireGame() {
  const [state, dispatch] = useReducer(reducer, null, () => ({
    history: createHistory(dealInitialGame()),
    selection: null,
    hint: null,
    isWon: false,
  }));
  
  const newGame = useCallback(() => dispatch({ type: 'NEW_GAME' }), []);
  const draw = useCallback(() => dispatch({ type: 'DRAW' }), []);
  const select = useCallback((selection: Selection) => dispatch({ type: 'SELECT', selection }), []);
  const move = useCallback((from: Selection, to: Selection, isDragMove?: boolean) => 
    dispatch({ type: 'MOVE', from, to, isDragMove }), []);
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const showHint = useCallback(() => dispatch({ type: 'SHOW_HINT' }), []);
  const clearHint = useCallback(() => dispatch({ type: 'CLEAR_HINT' }), []);
  const clearSelection = useCallback(() => dispatch({ type: 'CLEAR_SELECTION' }), []);
  const clearUIState = useCallback(() => dispatch({ type: 'CLEAR_UI_STATE' }), []);
  
  return {
    gameState: state.history.present,
    moves: state.history.moves,
    selection: state.selection,
    hint: state.hint,
    isWon: state.isWon,
    canUndo: canUndo(state.history),
    newGame,
    draw,
    select,
    move,
    undo,
    showHint,
    clearHint,
    clearSelection,
    clearUIState,
  };
}
