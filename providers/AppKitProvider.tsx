"use client";

import { AppKitProvider } from '@reown/appkit/react';
import { appKitOptions } from '@/lib/appkit-config';

export default function AppKitWrapper({ children }: { children: React.ReactNode }) {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  
  // Debug logging
  console.log('Project ID from env:', projectId);
  
  // Only render if we have a valid project ID
  if (!projectId || projectId === 'your-project-id-here' || projectId.length < 10) {
    console.error('Please set NEXT_PUBLIC_PROJECT_ID in your .env.local file');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Configuration Error</h1>
          <p className="text-gray-600">Please set NEXT_PUBLIC_PROJECT_ID in your .env.local file</p>
          <p className="text-sm text-gray-500 mt-2">Get your Project ID from https://cloud.reown.com</p>
          <p className="text-xs text-gray-400 mt-2">Current value: {projectId || 'undefined'}</p>
        </div>
      </div>
    );
  }

  return (
    <AppKitProvider {...appKitOptions}>
      {children}
    </AppKitProvider>
  );
}
