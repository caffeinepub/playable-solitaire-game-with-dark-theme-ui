import { GameState } from './solitaireTypes';

export function checkWin(state: GameState): boolean {
  return state.foundations.every(pile => pile.length === 13);
}
