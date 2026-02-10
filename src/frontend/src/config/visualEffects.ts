/**
 * Visual effects configuration module
 * Controls advanced shading effects (gradients, shadows) across the Solitaire UI
 */

// Read the environment variable (defaults to false for backward compatibility)
const envValue = import.meta.env.VITE_DISABLE_ADVANCED_SHADING;
export const disableAdvancedShading = envValue === 'true' || envValue === true;
