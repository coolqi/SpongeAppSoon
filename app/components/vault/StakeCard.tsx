'use client';

import { MemeButton } from '../ui/MemeButton';
import StakePercentageButtons from './StakePercentageButtons';
import TokenData from './TokenData';
import {
  useWallet,
  useAnchorWallet,
  AnchorWallet,
} from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react"
import { stake, getUserNativeBalance, getUserSplBalance } from "@/lib/program";
import { Connection, PublicKey } from "@solana/web3.js";
import useNetworkStore from "@/store/useNetworkStore";

interface StakeCardProps {
  tokenSymbol: string;
  currentPrice: number;
  selectedToken: { symbol: string; mint: string };
  setSelectedToken: (token: { symbol: string; mint: string }) => void;
  supportedTokens: { symbol: string; mint: string }[];
}

export default function StakeCard({ tokenSymbol, currentPrice, selectedToken, setSelectedToken, supportedTokens }: StakeCardProps) {
  const { sendTransaction } = useWallet();
  const { currentNetwork } = useNetworkStore();
  const wallet = useAnchorWallet();
  const [stakeAmount, setStakeAmount] = useState(0);
  const [stakeValue, setStakeValue] = useState(0);
  const [balance, setBalance] = useState<number | null>(null);
  const connection = new Connection(currentNetwork.rpcUrl, "confirmed");
  
  useEffect(() => {
    if (!wallet) return;

    const connection = new Connection(currentNetwork.rpcUrl, "confirmed");

    if (selectedToken.symbol === "ETH") {
      getUserNativeBalance(connection, wallet)
      .then(setBalance);
    } else {
      getUserSplBalance(connection, wallet, selectedToken.mint)
      .then(setBalance);
    }
  }, [wallet, currentNetwork, selectedToken]);

  return (
    <div className="bg-white dark:bg-[#0A0F1C] rounded-2xl p-6 border-4 border-green-400">
      <TokenData
        symbol={tokenSymbol}
        amount={stakeAmount}
        setAmount={setStakeAmount}
        value={stakeValue}
        setValue={setStakeValue}
        currentPrice={currentPrice}
        balance={balance}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        supportedTokens={supportedTokens}
      />
      
      <StakePercentageButtons 
        balance={balance} 
        setStakeAmount={setStakeAmount} 
      />

      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Current Price</span>
          <span className="font-bold">1 {tokenSymbol} = {currentPrice.toLocaleString()} USDC</span>
        </div>
      </div>

      <MemeButton
        className="w-full mt-6 bg-green-400 hover:bg-green-300 border-green-600"
        onClick={async () => {
          if (!wallet) {
            return;
          }

          const tx = await stake(
              connection,
              wallet as AnchorWallet,
              stakeAmount,
              currentNetwork.idl,
              currentNetwork.contractAddress,
              new PublicKey(currentNetwork.authorityPublicKey)
          );
          await sendTransaction(tx, connection)
            .then((e: unknown) => {
                // showSnackbar(`your tx hash is ${e}`, "success");
            })
            .catch((e: unknown) => {
                // showSnackbar(`${e}`, "error");
            })
            .finally(() => {
                // setLoading(false);
            });
      }}
      >
        Stake tokens
      </MemeButton>
    </div>
  );
}