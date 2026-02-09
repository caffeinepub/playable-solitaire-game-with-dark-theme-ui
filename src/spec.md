# Specification

## Summary
**Goal:** Remove the foundation (suit space) “lock” behavior so foundation piles are fully interactive move sources again, while keeping all existing Klondike legality rules intact.

**Planned changes:**
- Enable selecting and dragging the top card from foundation piles as valid move sources, with normal move validation and no state change on illegal moves.
- Remove lock-related drag payload blocking/serialization restrictions and ensure drops originating from foundations are handled like other sources.
- Remove the lock icon overlay and any locked/disabled styling on foundation top cards, restoring normal hover/active/draggable visuals.
- Update the Hint system to include legal moves from foundation top cards to tableau piles, without changing existing hint behavior for other move types.

**User-visible outcome:** Players can click or drag the top card from a foundation pile to attempt moves to tableau; legal moves work, illegal moves do nothing, foundations no longer look locked, and hints may suggest legal foundation-to-tableau moves.
