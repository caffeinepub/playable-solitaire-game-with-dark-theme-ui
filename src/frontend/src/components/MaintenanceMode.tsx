import React from 'react';
import { Wrench } from 'lucide-react';

export default function MaintenanceMode() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <Wrench className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Under Maintenance
          </h1>
          <p className="text-lg text-muted-foreground">
            We're currently working on improvements to bring you a better experience.
          </p>
        </div>
        
        <div className="pt-4 text-sm text-muted-foreground">
          <p>Please check back soon!</p>
        </div>
      </div>
    </div>
  );
}
