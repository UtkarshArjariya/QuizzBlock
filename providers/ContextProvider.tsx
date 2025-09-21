"use client";
import React from "react";
import { GlobalContextProvider } from "@/context/globalContext";
import { Web3Provider } from "@/context/Web3Context";
import AppKitWrapper from "./AppKitProvider";

interface Props {
  children: React.ReactNode;
}

function ContextProvider({ children }: Props) {
  return (
    <AppKitWrapper>
      <Web3Provider>
        <GlobalContextProvider>{children}</GlobalContextProvider>
      </Web3Provider>
    </AppKitWrapper>
  );
}

export default ContextProvider;
