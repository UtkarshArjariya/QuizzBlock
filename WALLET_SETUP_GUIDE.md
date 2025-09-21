# Wallet Connection Setup Guide

## Quick Fix for Wallet Connection Issues

### 1. Get Your Reown Project ID

1. Go to [https://cloud.reown.com](https://cloud.reown.com)
2. Create an account or sign in
3. Create a new project
4. Copy your Project ID

### 2. Set Environment Variables

Create a `.env.local` file in your project root and add:

```bash
NEXT_PUBLIC_PROJECT_ID=your-actual-project-id-here
```

**Replace `your-actual-project-id-here` with your real Project ID from step 1.**

### 3. Restart Your Development Server

```bash
npm run dev
```

### 4. Test Wallet Connection

1. Open your app in the browser
2. Click "Connect Wallet"
3. Select your preferred wallet (MetaMask, WalletConnect, etc.)
4. Approve the connection

## Common Issues and Solutions

### Issue: "Configuration Error" message
**Solution:** Make sure you've set `NEXT_PUBLIC_PROJECT_ID` in `.env.local` with a real project ID.

### Issue: Wallet modal doesn't open
**Solution:** 
1. Check browser console for errors
2. Ensure your Project ID is valid
3. Try refreshing the page

### Issue: Can't disconnect wallet
**Solution:** The disconnect functionality has been improved. Try clicking disconnect again.

### Issue: Wrong network
**Solution:** Click "Switch to Avalanche" button to automatically switch to the correct network.

## Supported Wallets

- MetaMask
- WalletConnect
- Coinbase Wallet
- Trust Wallet
- Rainbow
- And 300+ more wallets

## Troubleshooting

If you still have issues:

1. Check the browser console for error messages
2. Make sure your wallet is unlocked
3. Try a different browser
4. Clear browser cache and cookies
5. Restart your development server

## Need Help?

- Check the [Reown AppKit Documentation](https://docs.reown.com/appkit)
- Visit the [Reown Community Forum](https://github.com/reown-com/appkit/discussions)
