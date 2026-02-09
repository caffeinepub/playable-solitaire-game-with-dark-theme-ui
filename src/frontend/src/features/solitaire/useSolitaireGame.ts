import { useReducer, useCallback } from 'react';
import { GameState, Selection, HintData } from './solitaireTypes';
import { dealInitialGame, canMoveToTableau, canMoveToFoundation, moveCards, drawFromStock } from './solitaireLogic';
import { checkWin } from './solitaireWin';
import { findHint } from './solitaireHint';
import { createSnapshot, restoreSnapshot, HistorySnapshot } from './solitaireHistory';

interface SolitaireState {
  gameState: GameState;
  history: HistorySnapshot[];
  selection: Selection | null;
  hint: HintData | null;
}

type SolitaireAction =
  | { type: 'NEW_GAME' }
  | { type: 'DRAW' }
  | { type: 'SELECT'; selection: Selection | null }
  | { type: 'MOVE'; from: Selection; to: Selection; isDragMove: boolean; moveTrackingEnabled: boolean }
  | { type: 'UNDO' }
  | { type: 'SHOW_HINT' }
  | { type: 'CLEAR_HINT' }
  | { type: 'CLEAR_UI_STATE' };

function solitaireReducer(state: SolitaireState, action: SolitaireAction): SolitaireState {
  switch (action.type) {
    case 'NEW_GAME': {
      const newGameState = dealInitialGame();
      return {
        gameState: newGameState,
        history: [createSnapshot(newGameState, 0)],
        selection: null,
        hint: null,
      };
    }

    case 'DRAW': {
      const newGameState = drawFromStock(state.gameState);
      return {
        ...state,
        gameState: newGameState,
        selection: null,
        hint: null,
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
      const { from, to, isDragMove, moveTrackingEnabled } = action;
      let newGameState = state.gameState;
      let moveSuccessful = false;

      // Validate and execute move
      if (to.type === 'tableau') {
        if (canMoveToTableau(state.gameState, from, to)) {
          newGameState = moveCards(state.gameState, from, to);
          moveSuccessful = true;
        }
      } else if (to.type === 'foundation') {
        if (canMoveToFoundation(state.gameState, from, to)) {
          newGameState = moveCards(state.gameState, from, to);
          moveSuccessful = true;
        }
      }

      if (moveSuccessful) {
        // Get current move count from latest history
        const currentMoves = state.history.length > 0 
          ? state.history[state.history.length - 1].moves 
          : 0;
        
        // Only increment move counter if this is a drag move AND move tracking is enabled
        const newMoves = (isDragMove && moveTrackingEnabled) ? currentMoves + 1 : currentMoves;
        
        return {
          ...state,
          gameState: newGameState,
          history: [...state.history, createSnapshot(newGameState, newMoves)],
          selection: null,
          hint: null,
        };
      }

      // Move failed - just clear selection
      return {
        ...state,
        selection: null,
        hint: null,
      };
    }

    case 'UNDO': {
      if (state.history.length <= 1) return state;

      const newHistory = state.history.slice(0, -1);
      const previousSnapshot = newHistory[newHistory.length - 1];
      const restoredState = restoreSnapshot(previousSnapshot);

      return {
        ...state,
        gameState: restoredState,
        history: newHistory,
        selection: null,
        hint: null,
      };
    }

    case 'SHOW_HINT': {
      const hint = findHint(state.gameState);
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

const initialGameState = dealInitialGame();
const initialState: SolitaireState = {
  gameState: initialGameState,
  history: [createSnapshot(initialGameState, 0)],
  selection: null,
  hint: null,
};

export function useSolitaireGame() {
  const [state, dispatch] = useReducer(solitaireReducer, initialState);

  const newGame = useCallback(() => {
    dispatch({ type: 'NEW_GAME' });
  }, []);

  const draw = useCallback(() => {
    dispatch({ type: 'DRAW' });
  }, []);

  const select = useCallback((selection: Selection | null) => {
    dispatch({ type: 'SELECT', selection });
  }, []);

  const move = useCallback((from: Selection, to: Selection, isDragMove: boolean, moveTrackingEnabled: boolean = true) => {
    dispatch({ type: 'MOVE', from, to, isDragMove, moveTrackingEnabled });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const showHint = useCallback(() => {
    dispatch({ type: 'SHOW_HINT' });
  }, []);

  const clearHint = useCallback(() => {
    dispatch({ type: 'CLEAR_HINT' });
  }, []);

  const clearUIState = useCallback(() => {
    dispatch({ type: 'CLEAR_UI_STATE' });
  }, []);

  const currentMoves = state.history.length > 0 
    ? state.history[state.history.length - 1].moves 
    : 0;

  return {
    gameState: state.gameState,
    moves: currentMoves,
    selection: state.selection,
    hint: state.hint,
    isWon: checkWin(state.gameState),
    canUndo: state.history.length > 1,
    newGame,
    draw,
    select,
    move,
    undo,
    showHint,
    clearHint,
    clearUIState,
  };
}
