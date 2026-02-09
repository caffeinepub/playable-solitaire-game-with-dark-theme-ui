# Specification

## Summary
**Goal:** Store each winning playthrough’s completion time and move count, persist results locally, and show separate Best Times and Best Moves leaderboards in the win UI.

**Planned changes:**
- On win, record exactly one playthrough result entry containing both elapsedSeconds (from the existing timer) and moves (from the existing move counter), without duplicates from re-renders.
- Persist recorded playthrough results on the client (e.g., localStorage) and load them on app start, handling missing/empty storage safely.
- Derive and display two ranked lists from recorded results: Best Times (ascending by time) and Best Moves (ascending by moves), with each row showing both time (HH:MM:SS) and moves; include English empty-state messages when no results exist.
- Update the win dialog (or adjacent UI) to show the current win’s time and moves plus both ranked lists, keeping the existing Play Again behavior unchanged.

**User-visible outcome:** After winning, the player sees their completion time and moves along with two persistent leaderboards (Best Times and Best Moves) that remain available after reloading the page.
