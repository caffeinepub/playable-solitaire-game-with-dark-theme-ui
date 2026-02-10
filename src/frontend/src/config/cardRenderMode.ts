/**
 * Card rendering mode configuration module
 * Controls whether cards are rendered using DOM elements, CSS background-image, or <img> elements
 */

// Read the environment variable (defaults to 'dom' for backward compatibility)
const envValue = import.meta.env.VITE_CARD_RENDER_MODE;

export type CardRenderMode = 'dom' | 'background-image' | 'img';

export const cardRenderMode: CardRenderMode = 
  envValue === 'background-image' ? 'background-image' :
  envValue === 'img' ? 'img' :
  'dom';

export const useBackgroundImageRendering = cardRenderMode === 'background-image';
export const useImgRendering = cardRenderMode === 'img';
