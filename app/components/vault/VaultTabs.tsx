"use client";

import { CardContainer } from "../ui/Container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import StakeCard from "./StakeCard";
import UnstakeCard from "./UnstakeCard";

interface VaultTabsProps {
  stakeData: {
    tokenSymbol: string;
    amount: number;
    currentPrice: number;
    estimatedApy: number;
  };
  unstakeData: {
    tokenSymbol: string;
    amount: number;
    currentPrice: number;
  };

  selectedToken: { symbol: string; mint: string; decimals: number }; // 新增
  setSelectedToken: (token: {
    symbol: string;
    mint: string;
    decimals: number;
  }) => void; // 新增
  supportedTokens: { symbol: string; mint: string; decimals: number }[];
}

export default function VaultTabs({
  stakeData,
  unstakeData,
  selectedToken,
  setSelectedToken,
  supportedTokens,
}: VaultTabsProps) {
  return (
    <CardContainer>
        <Tabs defaultValue="stake" className="">
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
            <StakeCard />
          </TabsContent>

          <TabsContent value="unstake" className="mt-0">
            <UnstakeCard
              // {...unstakeData}
              // selectedToken={selectedToken}
              // setSelectedToken={setSelectedToken}
              // supportedTokens={supportedTokens}
            />
          </TabsContent>
        </Tabs>
    </CardContainer>
  );
}
