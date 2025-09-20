import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

// Avalanche C-Chain network configuration
const AVALANCHE_NETWORK = {
  chainId: '0xa86a', // 43114 in hex
  chainName: 'Avalanche C-Chain',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://snowtrace.io/'],
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [network, setNetwork] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum;
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      alert('Please install MetaMask to use this application!');
      return;
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const web3Signer = await web3Provider.getSigner();
        const network = await web3Provider.getNetwork();

        setAccount(accounts[0]);
        setProvider(web3Provider);
        setSigner(web3Signer);
        setNetwork(network);
        setIsConnected(true);
        setIsCorrectNetwork(network.chainId === BigInt(AVALANCHE_NETWORK.chainId));

        // Check if we need to switch networks
        if (network.chainId !== BigInt(AVALANCHE_NETWORK.chainId)) {
          await switchToAvalanche();
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Switch to Avalanche network
  const switchToAvalanche = async () => {
    if (!isMetaMaskInstalled()) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AVALANCHE_NETWORK.chainId }],
      });
      setIsCorrectNetwork(true);
    } catch (switchError) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [AVALANCHE_NETWORK],
          });
          setIsCorrectNetwork(true);
        } catch (addError) {
          console.error('Error adding Avalanche network:', addError);
          alert('Failed to add Avalanche network. Please add it manually in MetaMask.');
        }
      } else {
        console.error('Error switching to Avalanche network:', switchError);
        alert('Failed to switch to Avalanche network.');
      }
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
    setIsCorrectNetwork(false);
    setNetwork(null);
  };

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainId) => {
      const isCorrect = chainId === AVALANCHE_NETWORK.chainId;
      setIsCorrectNetwork(isCorrect);
      if (isCorrect && provider) {
        provider.getNetwork().then(setNetwork);
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
  }, [provider]);

  // Check if already connected on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) {
        setIsInitialized(true);
        return;
      }

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          const web3Signer = await web3Provider.getSigner();
          const network = await web3Provider.getNetwork();

          setAccount(accounts[0]);
          setProvider(web3Provider);
          setSigner(web3Signer);
          setNetwork(network);
          setIsConnected(true);
          setIsCorrectNetwork(network.chainId === BigInt(AVALANCHE_NETWORK.chainId));
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    checkConnection();
  }, []);

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
    isMetaMaskInstalled,
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
