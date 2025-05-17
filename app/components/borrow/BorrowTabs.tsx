"use client";

import { useEffect, useMemo, useState } from "react";
import { CardContainer } from "../ui/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import BorrowCard from "./BorrowCard";
import WithdrawCard from "./WithdrawCard";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import useTokenStore from "@/store/useTokenStore";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getSolBalance } from "@/lib/borrow";
import { getPoolDetail, getUserTokenAmount } from "@/lib/stake";
import useNetworkStore from "@/store/useNetworkStore";
import toast, { Toaster } from "react-hot-toast";
import { ETH_MINT } from "@/core/setting";

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
  const wallet = useAnchorWallet();
  const { currentNetwork, connected } = useNetworkStore();
  const [selectedTab, setSelectedTab] = useState("borrow");
  const { publicKey: walletPublicKey } = useWallet();
  const { selectedToken, setSelectedToken, setBalance, setIsLoading } =
    useTokenStore();

  const connection = useMemo(() => {
    return new Connection(currentNetwork.rpcUrl, "confirmed");
  }, [currentNetwork.rpcUrl]);

  const getBalance = async () => {
    if (!walletPublicKey) return;
    setIsLoading(true);
    try {
      const wsol = await getUserTokenAmount(
        connection,
        walletPublicKey,
        ETH_MINT
      );
      // const sol = await getSolBalance(connection, walletPublicKey);
      const sol = parseFloat((wsol / LAMPORTS_PER_SOL).toFixed(5));
      setBalance(sol);
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDetails = async () => {
    try {
      if (!wallet || !walletPublicKey) {
        toast.error("Wallet not connected");
        return;
      }
      setIsLoading(true);
      const poolDetail = await getPoolDetail(
        wallet,
        connection,
        new PublicKey("fv1mcUWtZX3GVNvK55P3w36nd6r1wsQkPsb3TS2QTT6"),
        walletPublicKey || new PublicKey("")
      );
      setBalance(
        poolDetail?.userAssets?.lendingReceiptAmount
          ? Number(poolDetail?.userAssets?.lendingReceiptAmount)
          : 0
      );
    } catch (error) {
      console.error("Error fetchDetails", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSelectedToken({} as any);
  }, [selectedTab]);

  useEffect(() => {
    if (selectedToken.symbol === "SOL" && walletPublicKey) {
      if (selectedTab === "withdraw") {
        fetchDetails();
      } else {
        getBalance();
      }
    } else {
      setBalance(0);
    }
  }, [selectedToken.symbol, walletPublicKey]);

  return (
    <CardContainer>
      <Toaster position="top-right" />

      <Tabs value={selectedTab} onValueChange={(val) => setSelectedTab(val)}>
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
          <BorrowCard connected={connected} callback={getBalance} />
        </TabsContent>
        <TabsContent value={"withdraw"} className="mt-0">
          <WithdrawCard connected={connected} callback={fetchDetails} />
        </TabsContent>
      </Tabs>
    </CardContainer>
  );
};
