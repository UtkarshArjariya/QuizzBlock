"use client";
import { chart, home, login } from "@/utils/Icons";
import { useWeb3 } from "@/context/SimpleWeb3Context";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

function Header() {
  const pathname = usePathname();
  const {
    isConnected,
    isConnecting,
    isInitialized,
    connectWallet,
    disconnectWallet,
    isWalletInstalled,
  } = useWeb3();

  const menu = [
    {
      name: "Home",
      icon: home,
      link: "/",
    },
    {
      name: "My Quizzes",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
          <g><path d="M0,0h24v24H0V0z" fill="none"/></g>
          <g><g>
            <path d="M4,6H2v14c0,1.1,0.9,2,2,2h14v-2H4V6z"/>
            <path d="M20,2H8C6.9,2,6,2.9,6,4v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M14.01,15 c-0.59,0-1.05-0.47-1.05-1.05c0-0.59,0.47-1.04,1.05-1.04c0.59,0,1.04,0.45,1.04,1.04C15.04,14.53,14.6,15,14.01,15z M16.51,8.83 c-0.63,0.93-1.23,1.21-1.56,1.81c-0.13,0.24-0.18,0.4-0.18,1.18h-1.52c0-0.41-0.06-1.08,0.26-1.65c0.41-0.73,1.18-1.16,1.63-1.8 c0.48-0.68,0.21-1.94-1.14-1.94c-0.88,0-1.32,0.67-1.5,1.23l-1.37-0.57C11.51,5.96,12.52,5,13.99,5c1.23,0,2.08,0.56,2.51,1.26 C16.87,6.87,17.08,7.99,16.51,8.83z"/>
          </g></g>
        </svg>
      ),
      link: "/all-quizzes",
    },
    {
      name: "my stats",
      icon: chart,
      link: "/stats",
    },
  ];


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
          <h1 className="text-3xl font-bold text-blue-400">QuizBlock</h1>
        </Link>

        <ul className="flex items-center gap-8">
          {menu.map((item, index) => (
            <li key={index}>
              <Link
                href={item.link}
                className={`py-1 px-6 flex items-center gap-2 text-lg leading-none text-gray-400 rounded-lg
                  hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200
                  ${
                    pathname === item.link
                      ? "bg-blue-500/20 text-blue-400 border-2 border-blue-400"
                      : ""
                  }
                  `}
              >
                <span className="text-2xl text-blue-400 hover:text-blue-500 transition-colors duration-200">{item.icon}</span>
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
            <Button
              onClick={disconnectWallet}
              className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg"
            >
              Disconnect
            </Button>
          ) : (
            <Button
              className="py-5 bg-blue-400 flex items-center gap-2 font-semibold text-lg rounded-lg
            hover:bg-blue-500/90"
              onClick={connectWallet}
              disabled={isConnecting || !isWalletInstalled()}
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
