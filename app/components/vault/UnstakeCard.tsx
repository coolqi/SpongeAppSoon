"use client";

import { MemeButton } from "../ui/MemeButton";
import StakePercentageButtons from "./StakePercentageButtons";
import TokenData from "./TokenData";
import {
  useWallet,
  useAnchorWallet,
  AnchorWallet,
} from "@solana/wallet-adapter-react";
import { useState, useEffect, useMemo } from "react";
import { unstakeSpl } from "@/lib/program";
import { Connection, PublicKey } from "@solana/web3.js";
import useNetworkStore from "@/store/useNetworkStore";
import useTokenStore from "@/store/useTokenStore";
import { SOL_MINT } from "@/core/setting";
import { idl, SoonVault } from "@/program/soon_vault";

interface UnstakeCardProps {
  tokenSymbol: string;
  currentPrice: number;
  selectedToken: { symbol: string; mint: string; decimals: number; isNative: boolean };
  setSelectedToken: (token: { symbol: string; mint: string; decimals: number; isNative: boolean }) => void;
  supportedTokens: { symbol: string; mint: string; decimals: number; isNative: boolean }[];
}

export default function UnstakeCard({
  tokenSymbol,
  currentPrice,
  selectedToken,
  setSelectedToken,
  supportedTokens,
}: UnstakeCardProps) {
  const { sendTransaction } = useWallet();
  const { currentNetwork } = useNetworkStore();
  const wallet = useAnchorWallet();
  const [unstakeAmount, setUnstakeAmount] = useState(0);
  const [unstakeValue, setUnstakeValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get staked amount from token store
  const { stakedAmount } = useTokenStore();

  // Create connection using useMemo to prevent recreation on every render
  const connection = useMemo(() => {
    return new Connection(currentNetwork.rpcUrl, "confirmed");
  }, [currentNetwork.rpcUrl]);

  // Reset amount when token changes
  useEffect(() => {
    setUnstakeAmount(0);
    setUnstakeValue(0);
  }, [selectedToken]);

  const handleUnstake = async () => {
    if (!wallet) {
      setError("Please connect your wallet");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (unstakeAmount <= 0) {
        setError("Please enter a valid amount");
        return;
      }

      // If it's a native token, we need to wrap it first
      const tokenMint = selectedToken.isNative ? SOL_MINT : new PublicKey(selectedToken.mint);
      const rawAmount = unstakeAmount * Math.pow(10, selectedToken.decimals);

      const tx = await unstakeSpl(
        connection,
        wallet as AnchorWallet,
        rawAmount,
        idl as SoonVault,
        idl.address,
        new PublicKey(currentNetwork.authorityPublicKey),
        tokenMint
      );
      
      const signature = await sendTransaction(tx, connection);
      console.log(`Transaction sent: ${signature}`);
      setError("Transaction sent successfully!");
    } catch (error) {
      console.error("Error unstaking:", error);
      setError(
        error instanceof Error ? error.message : "Failed to unstake tokens"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0A0F1C] rounded-2xl p-6 border-4 border-red-400">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <TokenData
        symbol={tokenSymbol}
        amount={unstakeAmount}
        setAmount={setUnstakeAmount}
        value={unstakeValue}
        setValue={setUnstakeValue}
        currentPrice={currentPrice}
        balance={stakedAmount}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        supportedTokens={supportedTokens}
      />

      <StakePercentageButtons
        balance={stakedAmount}
        setStakeAmount={setUnstakeAmount}
      />

      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Staked Amount
          </span>
          <span className="font-bold ml-1">
            {(stakedAmount / Math.pow(10, selectedToken.decimals)).toFixed(4)}{" "}
            {selectedToken.symbol}
          </span>
        </div>
      </div>

      <MemeButton
        className="w-full mt-6 bg-red-400 hover:bg-red-300 border-red-600"
        onClick={handleUnstake}
        disabled={loading}
      >
        {loading ? "Processing..." : "Unstake tokens"}
      </MemeButton>
    </div>
  );
}
