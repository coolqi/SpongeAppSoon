"use client";

import { useCallback, useEffect, useState } from "react";
import { CardContainer } from "../ui/Container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import StakeCard from "./StakeCard";
import UnstakeCard from "./UnstakeCard";
import useStakeStore from "@/store/useStakeStore";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { getPoolDetail } from "@/lib/stake";
import { PublicKey } from "@solana/web3.js";

export default function StakeTabs() {
  const [selectedTab, setSelectedTab] = useState("stake");
  const { connected: _connected, publicKey: walletPublicKey } = useWallet();
  const { selectedToken, setSelectedToken, setBalance, setIsLoading } =
    useStakeStore();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  useEffect(() => {
    setSelectedToken({} as any);
    setBalance(0);
  }, [selectedTab]);

  const getBalance = useCallback(async () => {
    if (!wallet || !walletPublicKey) return;
    setIsLoading(true);
    try {
      const poolDetail = await getPoolDetail(
        wallet,
        connection,
        new PublicKey("3y53jbCNMgjbVLFDnw1KkD6TRnoXidaSo6KubxtR2HV1"),
        walletPublicKey || new PublicKey(""),
      );
      const totalCanStake = poolDetail?.userAssets?.cashAmount;
      const totalCanUnstake = poolDetail?.userAssets?.userSCashAmount;
      if (selectedTab === "unstake") {
        setBalance(totalCanUnstake ? Number(totalCanUnstake) : 0);
        return;
      }
      setBalance(totalCanStake ? Number(totalCanStake) : 0);
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTab, wallet, connection, walletPublicKey, setBalance]);

  useEffect(() => {
    if (selectedToken.symbol) {
      getBalance();
    }
  }, [selectedToken.symbol]);
  return (
    <CardContainer>
      <Tabs value={selectedTab} onValueChange={(val) => setSelectedTab(val)}>
        <TabsList className="w-auto mb-6 bg-green-dark p-2 rounded-2xl border-4 border-black text-black/60 text-[15px]">
          <TabsTrigger
            value="stake"
            className="px-2 py-1 data-[state=active]:bg-green-light data-[state=active]:shadow-inner-green data-[state=active]:border-green-lighter data-[state=active]:text-black font-bold"
          >
            Stake
          </TabsTrigger>
          <TabsTrigger
            value="unstake"
            className="px-2 py-1 data-[state=active]:bg-green-light data-[state=active]:shadow-inner-green data-[state=active]:border-green-lighter data-[state=active]:text-black font-bold"
          >
            Unstake
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stake" className="mt-0">
          <StakeCard callback={getBalance} />
        </TabsContent>

        <TabsContent value="unstake" className="mt-0">
          <UnstakeCard callback={getBalance} />
        </TabsContent>
      </Tabs>
    </CardContainer>
  );
}
