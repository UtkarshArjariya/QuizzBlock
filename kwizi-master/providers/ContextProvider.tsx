"use client";
import React from "react";
import { GlobalContextProvider } from "@/context/globalContext";
import { Web3Provider } from "@/context/Web3Context";

interface Props {
  children: React.ReactNode;
}

function ContextProvider({ children }: Props) {
  return (
    <Web3Provider>
      <GlobalContextProvider>{children}</GlobalContextProvider>
    </Web3Provider>
  );
}

export default ContextProvider;
