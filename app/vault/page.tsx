'use client';

import VaultTabs from '../components/vault/VaultTabs';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function VaultPage() {
  const endpoint = "https://api3.binance.com/api/v3/ticker/price?symbols=[\"SOLUSDC\"]";
  const [stakeData, setStakeData] = useState({
    tokenSymbol: 'SOL',
    amount: 0.006,
    currentPrice: 0,
    estimatedApy: 8,
  });
  const [unstakeData, setUnstakeData] = useState({
    tokenSymbol: 'SOL',
    amount: 0.87780624,
    currentPrice: 0,
  });

  const handlePrice = async () => {
    try {
      const response = await axios.get(endpoint);
      const price = parseFloat(response.data[0].price); // Extract the price of SOL
      console.log(`Fetched price: {price} USDC`);
      setStakeData((prev) => ({
        ...prev,
        currentPrice: price,
      }));

      setUnstakeData((prev) => ({
        ...prev,
        currentPrice: price,
      }));
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };

  useEffect(() => {
    handlePrice();

    const interval = setInterval(() => {
      handlePrice();
    }, 10*1000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-yellow-50 dark:bg-[#030711] text-black dark:text-white">
      <main className="ml-64 p-8">
        <div className="max-w-xl mx-auto">
          <VaultTabs 
            stakeData={stakeData}
            unstakeData={unstakeData}
          />
        </div>
      </main>
    </div>
  );
}