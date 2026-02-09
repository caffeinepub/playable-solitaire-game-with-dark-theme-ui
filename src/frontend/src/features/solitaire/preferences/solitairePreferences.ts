// Client-side preferences module for Solitaire game settings
// Manages localStorage persistence for Timer, Move Tracking, and Ask Again preferences

export interface SolitairePreferences {
  timerEnabled: boolean;
  moveTrackingEnabled: boolean;
  askAgain: boolean;
}

const STORAGE_KEY = 'solitaire-preferences';

const DEFAULT_PREFERENCES: SolitairePreferences = {
  timerEnabled: true,
  moveTrackingEnabled: true,
  askAgain: true,
};

export function loadPreferences(): SolitairePreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...DEFAULT_PREFERENCES };
    
    const parsed = JSON.parse(stored);
    
    // Validate and merge with defaults to handle missing keys
    return {
      timerEnabled: typeof parsed.timerEnabled === 'boolean' ? parsed.timerEnabled : DEFAULT_PREFERENCES.timerEnabled,
      moveTrackingEnabled: typeof parsed.moveTrackingEnabled === 'boolean' ? parsed.moveTrackingEnabled : DEFAULT_PREFERENCES.moveTrackingEnabled,
      askAgain: typeof parsed.askAgain === 'boolean' ? parsed.askAgain : DEFAULT_PREFERENCES.askAgain,
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function savePreferences(preferences: SolitairePreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}
