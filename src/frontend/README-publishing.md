# Publishing Configuration

This application includes a three-state publishing system that allows you to control the app's visibility and functionality.

## Publishing States

The app supports three publishing states:

1. **Maintenance Mode**
   - Shows a maintenance screen to visitors
   - Not indexed by search engines (noindex, nofollow)
   - Use when the app is under development or temporarily unavailable

2. **Draft Mode** (default for draft deployments)
   - App is fully functional with all features enabled
   - Shows a subtle "Draft" indicator in the top-right corner
   - Not indexed by search engines (noindex, nofollow)
   - Use for testing and preview before going live

3. **Live Mode**
   - App is fully public and functional
   - No draft indicator shown
   - Indexed by search engines (index, follow)
   - Use when the app is ready for public access

## Current Status

The app defaults to **draft mode** when no environment variables are set, ensuring draft deployments are functional.

## How to Change Publishing State

### Option 1: Environment Variable (Recommended)

Create or edit a `.env` file in the `frontend` directory and add one of the following:

**For Draft Mode (default):**
