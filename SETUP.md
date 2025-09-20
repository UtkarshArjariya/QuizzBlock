# Kwizi Web3 Setup Guide

This application has been converted from a traditional Web2 authentication system to a Web3 application using MetaMask and Avalanche blockchain.

## ✅ Current Status

The application is **successfully running** on `http://localhost:3001` with the following features:
- ✅ MetaMask wallet connection
- ✅ Avalanche network integration  
- ✅ Web3 authentication (no traditional sign-in required)
- ✅ Quiz functionality with mock data
- ✅ Responsive Web3 UI

## Prerequisites

1. **Node.js** (v18 or higher) ✅
2. **MetaMask** browser extension ✅
3. **MongoDB** database (optional - app works with mock data)
4. **Avalanche network** access ✅

## Environment Variables (Optional)

Create a `.env.local` file in the root directory with the following variables:

```env
# Database (optional - app works without it)
DATABASE_URL="mongodb://localhost:27017/kwizi"

# Arcjet (optional - for security)
ARCJET_KEY="your_arcjet_key_here"

# Next.js
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your_nextauth_secret_here"
```

**Note**: The application currently works with mock data, so the database is optional for testing.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

3. Run the development server:
```bash
npm run dev
```

## Features

- **MetaMask Integration**: Connect your wallet to access the application
- **Avalanche Network**: Automatically switches to Avalanche C-Chain
- **Wallet Authentication**: No traditional sign-in/sign-up required
- **Quiz Platform**: Take quizzes and track your progress
- **Statistics**: View your quiz performance and stats

## Usage

1. Open the application in your browser
2. Click "Connect Wallet" to connect your MetaMask
3. If you're not on Avalanche network, the app will prompt you to switch
4. Once connected, you can browse and take quizzes
5. Your progress is tracked using your wallet address

## Network Configuration

The application is configured to work with:
- **Avalanche C-Chain** (Chain ID: 43114)
- **RPC URL**: https://api.avax.network/ext/bc/C/rpc
- **Block Explorer**: https://snowtrace.io/

## Troubleshooting

1. **MetaMask not detected**: Make sure MetaMask is installed and enabled
2. **Network issues**: Ensure you're connected to Avalanche C-Chain
3. **Database errors**: Check your MongoDB connection and DATABASE_URL
4. **Build errors**: Run `npm install` and `npx prisma generate`

## Development Notes

- The application uses client-side wallet authentication
- User data is stored using wallet addresses instead of traditional user IDs
- All authentication is handled through MetaMask
- The app automatically handles network switching to Avalanche
