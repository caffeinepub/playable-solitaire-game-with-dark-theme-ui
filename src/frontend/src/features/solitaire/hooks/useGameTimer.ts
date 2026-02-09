import { useState, useEffect, useRef } from 'react';

interface UseGameTimerReturn {
  formattedTime: string;
  elapsedSeconds: number;
}

/**
 * Custom hook that tracks elapsed time for a game instance.
 * Resets when gameInstanceKey changes, updates every second.
 */
export function useGameTimer(gameInstanceKey: number, isActive: boolean = true): UseGameTimerReturn {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Reset timer when game instance changes
  useEffect(() => {
    setElapsedSeconds(0);
  }, [gameInstanceKey]);

  // Start/stop interval based on isActive
  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on unmount or dependency change
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, gameInstanceKey]);

  // Format as HH:MM:SS
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    formattedTime: formatTime(elapsedSeconds),
    elapsedSeconds,
  };
}
