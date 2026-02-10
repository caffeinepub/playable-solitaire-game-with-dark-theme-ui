# Specification

## Summary
**Goal:** Publish the app in production Live Mode so it runs without draft-only UI and is indexable by search engines.

**Planned changes:**
- Set/standardize the production publishing configuration to use `VITE_PUBLISHING_STATE=live` and ensure draft-only UI (including the Draft indicator badge) is not rendered in live mode.
- Ensure the rendered `<meta name="robots">` policy is `index, follow` in live mode and `noindex, nofollow` in draft/maintenance modes.
- Add or adjust frontend environment configuration examples and/or publishing documentation to make switching between draft and live deployments straightforward without code changes.

**User-visible outcome:** When deployed with live configuration, the app runs in Live Mode with no Draft badge and allows search engines to index the site; draft deployments continue to behave as draft.
