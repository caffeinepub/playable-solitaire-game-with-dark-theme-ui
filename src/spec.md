# Specification

## Summary
**Goal:** Eliminate reflection/shine-like rendering artifacts on solitaire cards in Chromium browsers by auditing and hardening card-related styles while preserving coherent visuals across browsers.

**Planned changes:**
- Audit the solitaire card component and pile renderers (stock/back-of-card, waste, foundation, tableau) to identify the CSS causing reflection-like artifacts in Chrome/Edge, then update the relevant selectors/styles to remove the issue across idle/hover/drag/drop states.
- Remove or replace any transform-based hover/active effects on cards and their immediate wrappers, keeping clear hover/pressed affordances using non-transform styling (e.g., outline/ring/brightness).
- Add targeted defensive CSS for the card element and its wrappers to explicitly neutralize reflection/compositing-prone properties (e.g., `-webkit-box-reflect`, `filter`, `backdrop-filter`, `mix-blend-mode`, 3D transform settings) without impacting non-card UI.
- Verify and adjust the Tailwind `shadow-card` token (if used) to a standard, subtle `box-shadow` (no filters) and ensure consistent shadow behavior for face-up and face-down cards without breaking other shadow token consumers.

**User-visible outcome:** In Chrome and Edge, solitaire cards render cleanly (no mirrored/reflection artifacts) across all piles and interactions, while maintaining consistent card appearance and avoiding regressions in Firefox/Safari.
