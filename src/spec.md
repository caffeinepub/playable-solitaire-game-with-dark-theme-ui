# Specification

## Summary
**Goal:** Ensure an empty tableau column remains a visible, interactive drag-and-drop drop target after its last card is moved to a foundation.

**Planned changes:**
- Update tableau rendering so that when a tableau column has no cards, it still displays an empty slot/drop zone in the correct position.
- Ensure the empty tableau drop zone participates in drag-and-drop interactions (drag-over highlighting and drop handling) the same way other tableau targets do.
- Enforce existing Klondike rules for empty tableau drops: accept a King (or King-led face-up run) and reject non-King drops without changing game state.

**User-visible outcome:** After moving the last card out of a tableau column, the empty space still appears as a drop zone and correctly allows King (or King-led run) drops while rejecting invalid drops, with consistent drag-over highlighting.
