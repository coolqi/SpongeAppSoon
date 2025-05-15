"use client";

import { useEffect, useState } from "react";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import useNetworkStore from "@/store/useNetworkStore";
import axios from "axios";
import Link from "next/link";

interface StakingInfo {
  ethStakeAmount: number;
  ethPoints: number;
  solStakeAmount: number;
  solPoints: number;
}

export default function PortfolioPage() {
  const { currentNetwork } = useNetworkStore();
  const wallet = useAnchorWallet();
  const [stakingInfo, setStakingInfo] = useState<StakingInfo>({
    ethStakeAmount: 0,
    ethPoints: 0,
    solStakeAmount: 0,
    solPoints: 0,
  });
  const [solPrice, setSolPrice] = useState(0);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get(
          'https://api3.binance.com/api/v3/ticker/price?symbols=["SOLUSDC"]',
        );
        setSolPrice(parseFloat(response.data[0].price));
      } catch (error) {
        console.error("Error fetching SOL price:", error);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStakingInfo = async () => {
      if (!wallet || !currentNetwork) return;

      try {
        const connection = new Connection(currentNetwork.rpcUrl, "confirmed");
        const userStatePDA = PublicKey.findProgramAddressSync(
          [Buffer.from("user_state"), wallet.publicKey.toBuffer()],
          new PublicKey((currentNetwork as any).contractAddress),
        )[0];

        const accountInfo = await connection.getAccountInfo(userStatePDA);
        if (accountInfo) {
          setStakingInfo({
            ethStakeAmount: accountInfo.lamports / 1e9,
            ethPoints: 0,
            solStakeAmount: accountInfo.lamports / 1e9,
            solPoints: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching staking info:", error);
      }
    };

    fetchStakingInfo();
  }, [wallet, currentNetwork]);

  const totalValue =
    (stakingInfo.ethStakeAmount + stakingInfo.solStakeAmount) * solPrice;

  return (
    <div className=" bg-yellow-50 dark:bg-[#030711] text-black dark:text-white">
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Portfolio</h1>
            <Link
              href="/referral"
              className="px-4 py-2 bg-purple-400 text-black rounded-xl hover:bg-purple-300 border-2 border-purple-600 transition-all"
            >
              Referral Program 🎁
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-[#0A0F1C] rounded-xl p-6 border-4 border-yellow-400">
              <h2 className="text-lg font-semibold mb-4">Total Value</h2>
              <p className="text-3xl font-bold text-green-500">
                ${totalValue.toFixed(2)}
              </p>
            </div>

            <div className="bg-white dark:bg-[#0A0F1C] rounded-xl p-6 border-4 border-yellow-400">
              <h2 className="text-lg font-semibold mb-4">Total Points</h2>
              <p className="text-3xl font-bold text-blue-500">
                {stakingInfo.ethPoints + stakingInfo.solPoints}
              </p>
            </div>

            <div className="bg-white dark:bg-[#0A0F1C] rounded-xl p-6 border-4 border-yellow-400">
              <h2 className="text-lg font-semibold mb-4">SOL Price</h2>
              <p className="text-3xl font-bold text-purple-500">
                ${solPrice.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#0A0F1C] rounded-xl p-6 border-4 border-blue-400">
              <h2 className="text-xl font-semibold mb-4">ETH Staking</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Staked Amount
                  </span>
                  <span className="font-bold">
                    {stakingInfo.ethStakeAmount.toFixed(4)} ETH
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Points Earned
                  </span>
                  <span className="font-bold text-green-500">
                    {stakingInfo.ethPoints}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Value
                  </span>
                  <span className="font-bold">
                    ${(stakingInfo.ethStakeAmount * solPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0A0F1C] rounded-xl p-6 border-4 border-green-400">
              <h2 className="text-xl font-semibold mb-4">SOL Staking</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Staked Amount
                  </span>
                  <span className="font-bold">
                    {stakingInfo.solStakeAmount.toFixed(4)} SOL
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Points Earned
                  </span>
                  <span className="font-bold text-green-500">
                    {stakingInfo.solPoints}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Value
                  </span>
                  <span className="font-bold">
                    ${(stakingInfo.solStakeAmount * solPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
