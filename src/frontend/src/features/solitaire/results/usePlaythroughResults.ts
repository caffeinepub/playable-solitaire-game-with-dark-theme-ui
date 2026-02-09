import { useState, useEffect, useCallback } from 'react';

export interface PlaythroughResult {
  elapsedSeconds: number;
  moves: number;
  timestamp: number;
}

interface UsePlaythroughResultsReturn {
  results: PlaythroughResult[];
  addResult: (result: { elapsedSeconds: number; moves: number }) => void;
  bestTimes: PlaythroughResult[];
  bestMoves: PlaythroughResult[];
  formatTime: (seconds: number) => string;
}

const STORAGE_KEY = 'solitaire-playthrough-results';

function loadResults(): PlaythroughResult[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveResults(results: PlaythroughResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function usePlaythroughResults(): UsePlaythroughResultsReturn {
  const [results, setResults] = useState<PlaythroughResult[]>(() => loadResults());

  // Persist to localStorage whenever results change
  useEffect(() => {
    saveResults(results);
  }, [results]);

  const addResult = useCallback((result: { elapsedSeconds: number; moves: number }) => {
    const newResult: PlaythroughResult = {
      elapsedSeconds: result.elapsedSeconds,
      moves: result.moves,
      timestamp: Date.now(),
    };
    setResults((prev) => [...prev, newResult]);
  }, []);

  // Derive sorted leaderboards
  const bestTimes = [...results].sort((a, b) => a.elapsedSeconds - b.elapsedSeconds);
  const bestMoves = [...results].sort((a, b) => a.moves - b.moves);

  const formatTime = useCallback((totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    results,
    addResult,
    bestTimes,
    bestMoves,
    formatTime,
  };
}
