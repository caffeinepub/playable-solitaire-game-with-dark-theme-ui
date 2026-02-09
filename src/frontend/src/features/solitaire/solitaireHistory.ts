import { GameState } from './solitaireTypes';

export interface HistoryState {
  past: Array<{ state: GameState; moves: number }>;
  present: GameState;
  moves: number;
}

export function createHistory(initialState: GameState): HistoryState {
  return {
    past: [],
    present: initialState,
    moves: 0,
  };
}

export function pushHistory(history: HistoryState, newState: GameState, incrementMoves: boolean = false): HistoryState {
  const newMoves = incrementMoves ? history.moves + 1 : history.moves;
  return {
    past: [...history.past, { state: history.present, moves: history.moves }],
    present: newState,
    moves: newMoves,
  };
}

export function popHistory(history: HistoryState): HistoryState {
  if (history.past.length === 0) return history;
  
  const previous = [...history.past];
  const lastSnapshot = previous.pop()!;
  
  return {
    past: previous,
    present: lastSnapshot.state,
    moves: lastSnapshot.moves,
  };
}

export function canUndo(history: HistoryState): boolean {
  return history.past.length > 0;
}
