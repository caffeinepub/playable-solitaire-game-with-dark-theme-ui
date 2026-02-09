import { GameState } from './solitaireTypes';

export interface HistoryState {
  past: GameState[];
  present: GameState;
}

export function createHistory(initialState: GameState): HistoryState {
  return {
    past: [],
    present: initialState,
  };
}

export function pushHistory(history: HistoryState, newState: GameState): HistoryState {
  return {
    past: [...history.past, history.present],
    present: newState,
  };
}

export function popHistory(history: HistoryState): HistoryState {
  if (history.past.length === 0) return history;
  
  const previous = [...history.past];
  const present = previous.pop()!;
  
  return {
    past: previous,
    present,
  };
}

export function canUndo(history: HistoryState): boolean {
  return history.past.length > 0;
}
