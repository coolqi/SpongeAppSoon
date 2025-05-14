"use client";

import { MemeButton } from "../ui/MemeButton";
import {
  useWallet,
  useAnchorWallet,
} from "@solana/wallet-adapter-react";
import { Separator } from "radix-ui";
import { useState, useEffect, useMemo } from "react";
import {
  Connection,
} from "@solana/web3.js";
import useNetworkStore from "@/store/useNetworkStore";
import useTokenStore from "@/store/useTokenStore";
import TokenData from "./TokenData";
import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";

interface WithdrawCardProps {
  connected: boolean;
  maxAmount: number;
}

export default function WithdrawCard({ connected, maxAmount }: WithdrawCardProps) {
  const { sendTransaction } = useWallet();
  const { currentNetwork } = useNetworkStore();
  const wallet = useAnchorWallet();
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create connection using useMemo to prevent recreation on every render
  const connection = useMemo(() => {
    return new Connection(currentNetwork.rpcUrl, "confirmed");
  }, [currentNetwork.rpcUrl]);

  // Get token data from store
  const {
    selectedToken,
    supportedTokens,
    setSelectedToken,
    balance,
    setBalance,
    setStakedAmount,
    getTokenMint,
  } = useTokenStore();

  const tokenSymbol = selectedToken.symbol;
  const currentPrice = selectedToken.decimals;

  useEffect(() => {
    if (!wallet) return;

  }, [
    wallet,
    currentNetwork.rpcUrl,
    selectedToken,
    connection,
    setBalance,
    setStakedAmount,
    getTokenMint,
  ]);

  const handleWithdraw = async () => {
    if (!wallet || !connection) {
      setError("Wallet not connected");
      return;
    }

    if (!withdrawAmount || withdrawAmount <= 0) {
      setError("Please enter a valid withdraw amount");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // fetchBalances();
    } catch (error) {
      console.error("Error withdraw:", error);
      setError("Failed to withdraw. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-light dark:bg-[#0A0F1C] grid gap-4">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="bg-green-dark border-4 border-black p-3 rounded-3xl">
        <TokenData
          symbol={tokenSymbol}
          amount={withdrawAmount}
          setAmount={setWithdrawAmount}
          balance={balance}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
          supportedTokens={supportedTokens}
        />
      </div>
      <Separator.Root className="bg-green-dark w-full h-1" />
      {connected ? (
        <MemeButton
          className="mt-0 w-full bg-yellow-light hover:bg-yellow-dark border-black"
          onClick={handleWithdraw}
          disabled={loading || withdrawAmount <= 0}
        >
          {loading ? "Processing..." : "Withdraw"}
        </MemeButton>
      ) : (
        <div className="rounded-full mt-0 w-full bg-yellow-light hover:bg-yellow-dark font-bold">
          <UnifiedWalletButton buttonClassName="!transform !hover:scale-105 !transition-all !border-4 !border-black !rounded-full !w-full !py-3 !px-6 !text-base !flex !items-center !justify-center !bg-yellow-light" />
        </div>
      )}
    </div>
  );
}
