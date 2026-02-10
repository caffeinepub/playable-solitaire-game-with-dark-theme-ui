/**
 * Publishing configuration for the application.
 * Controls whether the app is in maintenance, draft, or live mode.
 * 
 * Publishing states:
 * - maintenance: App shows maintenance screen, not indexed by search engines
 * - draft: App is functional but shows draft indicator, not indexed by search engines
 * - live: App is fully public and indexable by search engines
 * 
 * To change modes:
 * 1. Set VITE_PUBLISHING_STATE=draft or VITE_PUBLISHING_STATE=live in your .env file, or
 * 2. For backward compatibility, VITE_MAINTENANCE_MODE=true forces maintenance mode
 */

export type PublishingState = 'maintenance' | 'draft' | 'live';

const getPublishingState = (): PublishingState => {
  // Check legacy maintenance mode variable first (backward compatibility)
  const legacyMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE;
  if (legacyMaintenanceMode === 'true' || legacyMaintenanceMode === true) {
    return 'maintenance';
  }
  
  // Check new publishing state variable
  const publishingState = import.meta.env.VITE_PUBLISHING_STATE;
  
  if (publishingState === 'draft') {
    return 'draft';
  }
  
  if (publishingState === 'live') {
    return 'live';
  }
  
  if (publishingState === 'maintenance') {
    return 'maintenance';
  }
  
  // Default to draft mode for draft deployments
  return 'draft';
};

export const publishingState: PublishingState = getPublishingState();

// Legacy exports for backward compatibility
export const publishingConfig = {
  isMaintenanceMode: publishingState === 'maintenance',
  isLive: publishingState === 'live',
};
