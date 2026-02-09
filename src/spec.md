# Specification

## Summary
**Goal:** Fix the UI bug where the top card can disappear when dragging from a foundation pile that has multiple stacked cards, and make foundation rendering robust during moves.

**Planned changes:**
- Reproduce and diagnose the disappearing-card issue when dragging the top card from a multi-card foundation pile.
- Fix drag-and-drop state/update flow for foundation-to-other-pile moves so the dragged card either lands correctly or returns to its source on canceled/invalid drops.
- Harden foundation pile rendering to prevent React reconciliation issues (e.g., use stable, card-identity-based keys so the top card updates reliably as cards are moved on/off foundations).
- Ensure no regressions in drag-and-drop behavior or rendering for waste and tableau piles.

**User-visible outcome:** Dragging the top card from a stacked foundation pile no longer causes the card to vanish; valid drops move the card and reveal the next foundation card, while canceled/invalid drops leave the foundation unchanged.
