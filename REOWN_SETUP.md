# Reown AppKit Setup

This project now uses Reown AppKit (formerly WalletConnect) instead of MetaMask-specific wallet connections.

## Setup Instructions

### 1. Get a Reown Project ID

1. Go to [https://cloud.reown.com](https://cloud.reown.com)
2. Create an account or sign in
3. Create a new project
4. Copy your Project ID

### 2. Set Environment Variables

Create a `.env.local` file in your project root and add:

```bash
http://localhost:3000/all-quizzeshttp://localhost:3000/all-quizzesNEXT_PUBLIC_PROJECT_ID=your-project-id-here
```

Replace `your-project-id-here` with your actual Project ID from step 1.

### 3. Features

The new implementation provides:

- **Multi-wallet support**: Users can connect with MetaMask, WalletConnect, Coinbase Wallet, and many other wallets
- **Better UX**: Unified connection modal with multiple wallet options
- **Mobile support**: QR code scanning for mobile wallets
- **Network switching**: Automatic Avalanche network detection and switching
- **Theme customization**: Custom colors matching your app's design

### 4. Supported Networks

Currently configured for:
- **Avalanche C-Chain** (Chain ID: 43114)

### 5. Wallet Support

The AppKit supports 300+ wallets including:
- MetaMask
- WalletConnect
- Coinbase Wallet
- Trust Wallet
- Rainbow
- And many more...

### 6. Migration Notes

The following changes were made during migration:

- Replaced MetaMask-specific `window.ethereum` calls with AppKit hooks
- Updated `isMetaMaskInstalled()` to `isWalletInstalled()` (always returns true)
- Added AppKit provider wrapper around the app
- Maintained the same API for existing components
- Added proper TypeScript support

### 7. Troubleshooting

If you encounter issues:

1. Make sure your Project ID is correctly set in `.env.local`
2. Restart your development server after adding environment variables
3. Check the browser console for any error messages
4. Verify your project is properly configured at [cloud.reown.com](https://cloud.reown.com)
