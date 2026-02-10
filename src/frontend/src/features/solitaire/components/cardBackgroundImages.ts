/**
 * Helper module to generate image sources for card faces and backs
 * Used when CardView is in background-image or img rendering mode
 */

import { Card, Suit, Rank } from '../solitaireTypes';

/**
 * Generate an SVG data URI for a card face (raw src string for <img>)
 */
export function getCardFaceImageSrc(card: Card): string {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  const suitSymbol = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
  }[card.suit];

  // Use theme-aware colors that work in both light and dark modes
  const textColor = isRed ? '#dc2626' : '#1e293b';
  
  // Create an SVG with the card face layout
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 112" width="80" height="112">
      <!-- Top-left corner -->
      <text x="8" y="16" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="${textColor}">
        ${card.rank}
      </text>
      <text x="8" y="32" font-family="system-ui, sans-serif" font-size="18" fill="${textColor}">
        ${suitSymbol}
      </text>
      
      <!-- Center suit symbol -->
      <text x="40" y="68" font-family="system-ui, sans-serif" font-size="36" fill="${textColor}" text-anchor="middle">
        ${suitSymbol}
      </text>
      
      <!-- Bottom-right corner (rotated) -->
      <g transform="translate(72, 96) rotate(180)">
        <text x="0" y="16" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="${textColor}">
          ${card.rank}
        </text>
        <text x="0" y="32" font-family="system-ui, sans-serif" font-size="18" fill="${textColor}">
          ${suitSymbol}
        </text>
      </g>
    </svg>
  `;

  // Encode the SVG as a data URI
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Generate an image src for a card back (raw src string for <img>)
 */
export function getCardBackImageSrc(): string {
  // Simple circular pattern for card back
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 112" width="80" height="112">
      <circle cx="40" cy="56" r="24" fill="none" stroke="rgba(96, 165, 250, 0.3)" stroke-width="4"/>
    </svg>
  `;

  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Get the appropriate image src for a card (for <img> elements)
 */
export function getCardImageSrc(card: Card): string {
  if (card.faceUp) {
    return getCardFaceImageSrc(card);
  } else {
    return getCardBackImageSrc();
  }
}

/**
 * Generate a CSS background-image value for a card face
 */
export function getCardFaceBackgroundImage(card: Card): string {
  return `url("${getCardFaceImageSrc(card)}")`;
}

/**
 * Generate a CSS background-image value for a card back
 */
export function getCardBackBackgroundImage(): string {
  return `url("${getCardBackImageSrc()}")`;
}

/**
 * Get the appropriate background-image value for a card (for CSS background-image)
 */
export function getCardBackgroundImage(card: Card): string {
  if (card.faceUp) {
    return getCardFaceBackgroundImage(card);
  } else {
    return getCardBackBackgroundImage();
  }
}
