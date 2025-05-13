"use client";

import VaultTabs from "../components/vault/VaultTabs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Script from "next/script";
import useStakeStore from "../store/useStakeStore";

export default function HomePage() {
  const { selectedToken, setSelectedToken, supportedTokens } = useStakeStore();
  const [stakeData, setStakeData] = useState({
    tokenSymbol: "mvmUSD",
    amount: 0.006,
    currentPrice: 0,
    estimatedApy: 8,
  });
  const [unstakeData, setUnstakeData] = useState({
    tokenSymbol: "USD*",
    amount: 0.87780624,
    currentPrice: 0,
  });

  const handlePrice = async () => {
    try {
      if (!selectedToken || !selectedToken.mint) {
        console.error("selectedToken or mint is undefined.");
        return;
      }

      const endpoint = `https://api.jup.ag/price/v2?ids=${selectedToken.mint}`;
      const response = await axios.get(endpoint);

      if (
        !response.data ||
        !response.data.data ||
        !response.data.data[selectedToken.mint]
      ) {
        console.error(`No valid price data for ${selectedToken.mint}`);
        return;
      }

      const tokenPrice = parseFloat(
        response.data.data[selectedToken.mint].price
      );
      console.log(`Fetched price for ${selectedToken.symbol}: ${tokenPrice}`);

      setStakeData((prev) => ({
        ...prev,
        currentPrice: tokenPrice,
        tokenSymbol: selectedToken.symbol,
      }));

      setUnstakeData((prev) => ({
        ...prev,
        currentPrice: tokenPrice,
        tokenSymbol: selectedToken.symbol,
      }));
    } catch (error) {
      console.error(`Error fetching ${selectedToken.symbol} price:`, error);
    }
  };

  useEffect(() => {
    handlePrice();
    const interval = setInterval(handlePrice, 10 * 1000);
    return () => clearInterval(interval);
  }, [selectedToken.symbol]);

  return (
    <>            
      <div className="h-full dark:bg-[#030711] text-black dark:text-white mt-20">
        <main className="w-full p-8">
          <div className="max-w-xl mx-auto">
            <VaultTabs
              stakeData={stakeData}
              unstakeData={unstakeData}
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken as any}
              supportedTokens={supportedTokens}
            />
          </div>
        </main>
      </div>
      <Script
        src="https://terminal.jup.ag/main-v1.js"
        strategy="afterInteractive"
      />
    </>
  );
}
