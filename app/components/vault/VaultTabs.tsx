'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import StakeCard from './StakeCard';
import UnstakeCard from './UnstakeCard';

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
  selectedToken: { symbol: string; mint: string }; // 新增
  setSelectedToken: (token: { symbol: string; mint: string }) => void; // 新增
  supportedTokens: { symbol: string; mint: string }[];
}

export default function VaultTabs({ stakeData, unstakeData, selectedToken, setSelectedToken, supportedTokens }: VaultTabsProps) {
  return (
    <div className="bg-yellow-100 dark:bg-[#1A1F2E] rounded-3xl border-4 border-blue-400 p-6">
      <div className="text-2xl font-bold mb-6 text-center">
        Sponge Vault
      </div>
      
      <Tabs defaultValue="stake" className="w-full">
        <TabsList className="w-full mb-6 bg-yellow-200 dark:bg-[#141921] p-2 rounded-2xl border-4 border-yellow-400">
          <TabsTrigger 
            value="stake" 
            className="w-1/2 data-[state=active]:bg-green-400 data-[state=active]:text-white font-bold"
          >
            Stake
          </TabsTrigger>
          <TabsTrigger 
            value="unstake"
            className="w-1/2 data-[state=active]:bg-red-400 data-[state=active]:text-white font-bold"
          >
            Unstake
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stake" className="mt-0">
          <StakeCard 
            {...stakeData} 
            selectedToken={selectedToken} 
            setSelectedToken={setSelectedToken} 
            supportedTokens={supportedTokens}
          />
        </TabsContent>

        <TabsContent value="unstake" className="mt-0">
          <UnstakeCard
            {...unstakeData}
            selectedToken={selectedToken} 
            setSelectedToken={setSelectedToken} 
            supportedTokens={supportedTokens}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
