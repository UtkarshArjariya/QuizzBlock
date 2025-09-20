"use client";
import { chart, home, login } from "@/utils/Icons";
import { useWeb3 } from "@/context/Web3Context";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

function Header() {
  const pathname = usePathname();
  const {
    account,
    isConnected,
    isConnecting,
    isCorrectNetwork,
    isInitialized,
    connectWallet,
    disconnectWallet,
    switchToAvalanche,
    isMetaMaskInstalled,
  } = useWeb3();

  const menu = [
    {
      name: "Home",
      icon: home,
      link: "/",
    },
    {
      name: "Live Quiz",
      icon: "🎮",
      link: "/live-quiz",
    },
    {
      name: "My Stats",
      icon: chart,
      link: "/stats",
    },
  ];

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="min-h-[8vh] px-[10rem] xl:px-[15rem] border-b-2 flex items-center">
      <nav className="flex-1 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/icon--logo-lg.png"
            alt="logo"
            width={50}
            height={50}
            priority
          />
          <h1 className="text-3xl font-bold text-blue-400">Kwizi</h1>
        </Link>

        <ul className="flex items-center gap-8">
          {menu.map((item, index) => (
            <li key={index}>
              <Link
                href={item.link}
                className={`py-1 px-6 flex items-center gap-2 text-lg leading-none text-gray-400 rounded-lg
                  ${
                    pathname === item.link
                      ? "bg-blue-500/20 text-blue-400 border-2 border-blue-400"
                      : ""
                  }
                  
                  `}
              >
                <span className="text-2xl text-blue-400">{item.icon}</span>
                <span
                  className={`font-bold uppercase
                  ${pathname === item.link ? "text-blue-400" : "text-gray-400"}
                  `}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {!isInitialized ? (
            <div className="w-32 h-12 bg-gray-200 animate-pulse rounded-lg"></div>
          ) : isConnected ? (
            <div className="flex items-center gap-3">
              {!isCorrectNetwork && (
                <Button
                  onClick={switchToAvalanche}
                  className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg"
                >
                  Switch to Avalanche
                </Button>
              )}
              <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white font-mono text-sm">
                  {formatAddress(account)}
                </span>
              </div>
              <Button
                onClick={disconnectWallet}
                className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              className="py-5 bg-blue-400 flex items-center gap-2 font-semibold text-lg rounded-lg
            hover:bg-blue-500/90"
              onClick={connectWallet}
              disabled={isConnecting || !isMetaMaskInstalled()}
            >
              {login}
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
