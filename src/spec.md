# Specification

## Summary
**Goal:** Lock the four foundation piles (upper slots) so cards placed there cannot be clicked or dragged out, while still allowing valid drops into foundations.

**Planned changes:**
- Disable all pointer/drag interactions for cards in the four foundation piles (no click selection, no drag start/payload), while keeping drop targets for valid moves from waste/tableau.
- Ensure game logic features respect the locked foundation rule: undo can still undo moves into foundations, and hints never suggest moves with a foundation as the source.
- Add a subtle “locked” visual affordance on foundation top cards and remove hover/active styling that implies interactivity for foundation cards only (waste/tableau styling unchanged).

**User-visible outcome:** Cards in the upper four foundation slots visibly appear locked and cannot be selected or dragged by the player, but players can still move appropriate cards onto foundations; undo continues to work for moves into foundations and hints won’t suggest moving from foundations.
