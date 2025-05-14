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
import { getPoolDetail, PoolDetailInfo } from "@/lib/getPoolDetails";
import { Connection, PublicKey } from "@solana/web3.js";
import { getSolBalance, getTokenBalance } from "@/lib/getBorrowBalance";
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
  const { connection } = useConnection();
  const [selectedTab, setSelectedTab] = useState("borrow");
  const { connected: _connected, publicKey: walletPublicKey } = useWallet();
  const wallet = useAnchorWallet();
  const [connected, setConnected] = useState(_connected);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [details, setDetails] = useState<PoolDetailInfo | null>(null);
  const { selectedToken, setSelectedToken, setBalance } = useTokenStore();

  const fetchDetails = async () => {
    try {
      if (!wallet) return;
      setIsLoadingDetails(true);
      const poolDetail = await getPoolDetail(
        wallet,
        connection,
        new PublicKey(selectedToken.mint || ""),
        walletPublicKey || new PublicKey("")
      );
      console.log("poolDetail", poolDetail);
      setDetails(poolDetail);
    } catch (error) {
      console.error("Error fetchDetails", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const getBalance = async () => {
    if (!walletPublicKey) return;
    const sol = await getSolBalance(walletPublicKey);
    setBalance(sol);
  };

  useEffect(() => {
    setSelectedToken({} as any);
  }, [selectedTab]);

  useEffect(() => {
    console.log('selectedToken', selectedToken)
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
            maxAmount={
              details?.userAssets?.cashAmount
                ? Number(details?.userAssets?.cashAmount)
                : 0
            }
          />
        </TabsContent>
        <TabsContent value={"withdraw"} className="mt-0">
          <WithdrawCard
            connected={connected}
            maxAmount={
              details?.userAssets?.lendingReceiptAmount
                ? Number(details?.userAssets?.lendingReceiptAmount)
                : 0
            }
          />
        </TabsContent>
      </Tabs>
    </CardContainer>
  );
};
