import { useEffect } from 'react';
import { publishingState } from '@/config/publishing';

/**
 * Hook that manages the robots meta tag based on publishing state.
 * - maintenance/draft: Sets noindex, nofollow (prevents search engine indexing)
 * - live: Removes noindex, nofollow (allows search engine indexing)
 */
export function useRobotsPolicy() {
  useEffect(() => {
    // Find or create the robots meta tag
    let robotsTag = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    
    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.name = 'robots';
      document.head.appendChild(robotsTag);
    }
    
    // Set content based on publishing state
    if (publishingState === 'live') {
      // Allow indexing in live mode
      robotsTag.content = 'index, follow';
    } else {
      // Prevent indexing in maintenance and draft modes
      robotsTag.content = 'noindex, nofollow';
    }
  }, []);
}
