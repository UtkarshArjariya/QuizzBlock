import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useAppKit } from '@reown/appkit/react';
import { avalanche } from '@reown/appkit/networks';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [network, setNetwork] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get AppKit instance
  const appKit = useAppKit();

  // Connect wallet using AppKit
  const connectWallet = async () => {
    if (!appKit) {
      console.error('AppKit not initialized');
      return;
    }

    setIsConnecting(true);
    try {
      // Use the correct method to open the modal
      await appKit.open();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Switch to Avalanche network
  const switchToAvalanche = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    try {
      const avalancheChainId = '0xa86a'; // 43114 in hex
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: avalancheChainId }],
      });
      setIsCorrectNetwork(true);
    } catch (switchError) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xa86a',
              chainName: 'Avalanche C-Chain',
              nativeCurrency: {
                name: 'Avalanche',
                symbol: 'AVAX',
                decimals: 18,
              },
              rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
              blockExplorerUrls: ['https://snowtrace.io/'],
            }],
          });
          setIsCorrectNetwork(true);
        } catch (addError) {
          console.error('Error adding Avalanche network:', addError);
          alert('Failed to add Avalanche network. Please add it manually in your wallet.');
        }
      } else {
        console.error('Error switching to Avalanche network:', switchError);
        alert('Failed to switch to Avalanche network.');
      }
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      // Use AppKit's disconnect method
      if (appKit && appKit.disconnect) {
        await appKit.disconnect();
      }
      
      // Clear all state
      setAccount(null);
      setProvider(null);
      setSigner(null);
      setIsConnected(false);
      setIsCorrectNetwork(false);
      setNetwork(null);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      // Force clear state even if disconnect fails
      setAccount(null);
      setProvider(null);
      setSigner(null);
      setIsConnected(false);
      setIsCorrectNetwork(false);
      setNetwork(null);
    }
  };

  // Check if wallet is installed (AppKit handles this)
  const isWalletInstalled = () => {
    return true; // AppKit provides fallbacks
  };

  // Initialize AppKit state
  useEffect(() => {
    if (!appKit) {
      setIsInitialized(true);
      return;
    }

    try {
      // Check if already connected using AppKit's state
      const checkConnection = async () => {
        try {
          // Check if AppKit has connection state
          if (appKit.address) {
            const web3Provider = new ethers.BrowserProvider(window.ethereum);
            const web3Signer = await web3Provider.getSigner();
            const network = await web3Provider.getNetwork();

            setAccount(appKit.address);
            setProvider(web3Provider);
            setSigner(web3Signer);
            setNetwork(network);
            setIsConnected(true);
            
            // Check if network matches Avalanche (43114)
            const avalancheChainId = 43114;
            setIsCorrectNetwork(network.chainId === BigInt(avalancheChainId));
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      };

      checkConnection();
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing AppKit:', error);
      setIsInitialized(true);
    }
  }, [appKit]);

  // Listen for AppKit state changes
  useEffect(() => {
    if (!appKit) return;

    // Listen for AppKit connection changes
    const handleAppKitStateChange = () => {
      console.log('AppKit state change:', { address: appKit.address, isConnected: appKit.isConnected });
      
      if (appKit.address) {
        console.log('Wallet connected:', appKit.address);
        setAccount(appKit.address);
        setIsConnected(true);
        
        // Create provider and signer
        if (typeof window !== 'undefined' && window.ethereum) {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          web3Provider.getSigner().then((web3Signer) => {
            setProvider(web3Provider);
            setSigner(web3Signer);
          }).catch(console.error);
          
          // Check network
          web3Provider.getNetwork().then((network) => {
            setNetwork(network);
            const avalancheChainId = 43114;
            setIsCorrectNetwork(network.chainId === BigInt(avalancheChainId));
          }).catch(console.error);
        }
      } else {
        console.log('Wallet disconnected');
        setAccount(null);
        setProvider(null);
        setSigner(null);
        setIsConnected(false);
        setIsCorrectNetwork(false);
        setNetwork(null);
      }
    };

    // Initial state check
    handleAppKitStateChange();

    // Listen for window.ethereum events as backup
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          setProvider(null);
          setSigner(null);
          setIsConnected(false);
          setIsCorrectNetwork(false);
          setNetwork(null);
        } else {
          setAccount(accounts[0]);
          setIsConnected(true);
          
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          web3Provider.getSigner().then((web3Signer) => {
            setProvider(web3Provider);
            setSigner(web3Signer);
          }).catch(console.error);
        }
      };

      const handleChainChanged = (chainId) => {
        const avalancheChainId = 43114;
        const isCorrect = chainId === `0x${avalancheChainId.toString(16)}`;
        setIsCorrectNetwork(isCorrect);
        
        if (isCorrect && provider) {
          provider.getNetwork().then(setNetwork).catch(console.error);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [appKit, provider]);

  const value = {
    account,
    provider,
    signer,
    isConnected,
    isConnecting,
    network,
    isCorrectNetwork,
    isInitialized,
    connectWallet,
    disconnectWallet,
    switchToAvalanche,
    isWalletInstalled,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
