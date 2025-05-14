"use client";

import { useEffect, useState } from "react";
import { CardContainer } from "../ui/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import BorrowCard from "./BorrowCard";
import WithdrawCard from "./WithdrawCard";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import useTokenStore from "@/store/useTokenStore";
import { PublicKey } from "@solana/web3.js";
import { getSolBalance } from "@/lib/borrow";
const tabs = [
  {
    label: "Borrow",
    value: "borrow",
  },
  {
    label: "Withdraw",
    value: "withdraw",
  },
];

export const DepositTabs = () => {
  const [selectedTab, setSelectedTab] = useState("borrow");
  const { connected: _connected, publicKey: walletPublicKey } = useWallet();
  const [connected, setConnected] = useState(_connected);
  const { selectedToken, setSelectedToken, setBalance, setIsLoading } = useTokenStore();

  const getBalance = async () => {
    if (!walletPublicKey) return;
    setIsLoading(true);
    try {
      const sol = await getSolBalance(walletPublicKey);
      setBalance(sol);
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSelectedToken({} as any);
  }, [selectedTab]);

  useEffect(() => {
    if (selectedToken.symbol === "SOL" && walletPublicKey) {
      getBalance();
    } else {
      setBalance(0);
    }
  }, [selectedToken.symbol, walletPublicKey]);

  useEffect(() => {
    const handleConnect = () => {
      setConnected(true);
    };
    const handleDisconnect = () => {
      setConnected(false);
    };

    window?.solana?.on("connect", handleConnect);
    window?.solana?.on("disconnect", handleDisconnect);

    return () => {
      window?.solana?.off("connect", handleConnect);
      window?.solana?.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <CardContainer>
      <Tabs
        value={selectedTab}
        onValueChange={(val) => setSelectedTab(val)}
      >
        <TabsList className="w-auto mb-6 bg-green-dark p-2 rounded-2xl border-4 border-black text-black/60 text-[15px]">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="px-2 py-1 data-[state=active]:bg-green-light data-[state=active]:shadow-inner-green data-[state=active]:border-green-lighter data-[state=active]:text-black font-bold"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={"borrow"} className="mt-0">
          <BorrowCard
            connected={connected}
            callback={getBalance}
          />
        </TabsContent>
        <TabsContent value={"withdraw"} className="mt-0">
          <WithdrawCard
            connected={connected}
            callback={getBalance}
          />
        </TabsContent>
      </Tabs>
    </CardContainer>
  );
};
