# Specification

## Summary
**Goal:** Let players dismiss the “New Game Preferences” modal via a top-right close (X) control (and standard dismissal, where supported) without selecting options or starting a new game.

**Planned changes:**
- Add a visible, clickable top-right “X” close control to the New Game Preferences modal using composition (without modifying read-only UI component files).
- Wire the dialog for controlled open/close from the parent (e.g., via an open state and onOpenChange handler) so dismiss actions can close the modal.
- Ensure dismissing/closing the dialog (X/ESC/outside click, if supported) does not trigger “Start Game” and does not persist/update any preference values.
- Reset/initialize the dialog’s option state on each reopen from the latest default preference props (avoid stale state from prior opens).

**User-visible outcome:** When the New Game Preferences dialog is open, the user can close it using the top-right X (and other supported dismissal methods) without starting a new game or changing any saved preferences, leaving the current game state unchanged.
