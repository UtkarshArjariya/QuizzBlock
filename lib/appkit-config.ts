import { AppKitOptions } from '@reown/appkit/react';
import { avalanche } from '@reown/appkit/networks';

// Ensure we have a valid project ID
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  console.warn('NEXT_PUBLIC_PROJECT_ID is not set. Please set it in your .env.local file.');
}

// AppKit configuration - MetaMask only
export const appKitOptions: AppKitOptions = {
  projectId: projectId || 'demo-project-id',
  networks: [avalanche],
  wallets: [
    {
      id: 'metamask',
      name: 'MetaMask',
      homepage: 'https://metamask.io',
      imageId: '0a52e96a-0b70-4cbf-83d0-2b9a3b7c5c8c',
      mobile: {
        native: 'metamask://',
        universal: 'https://metamask.app.link',
      },
      desktop: {
        native: 'metamask://',
        universal: 'https://metamask.app.link',
      },
    },
  ],
  metadata: {
    name: 'QuizBlock',
    description: 'Web3 and Tech Quiz Platform',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://quizblock.com',
    icons: ['/icon--logo-lg.png']
  },
  themeMode: 'light',
  features: {
    analytics: false,
    email: false,
  },
  themeVariables: {
    '--w3m-color-mix': '#3B82F6',
    '--w3m-color-mix-strength': 40,
  },
};
