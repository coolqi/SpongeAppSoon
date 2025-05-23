"use client";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Separator } from "radix-ui";
import { useState, useMemo } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import useNetworkStore from "@/store/useNetworkStore";
import useTokenStore from "@/store/useTokenStore";
import TokenData from "./TokenData";
import { borrow } from "@/lib/borrow";
import toast, { Toaster } from "react-hot-toast";
import { BottomBtn } from "./BottomBtn";

interface BorrowCardProps {
  connected: boolean;
  callback?: () => void;
}

export default function BorrowCard({ connected, callback }: BorrowCardProps) {
  const wallet = useAnchorWallet();
  const { currentNetwork } = useNetworkStore();
  const [borrowAmount, setBorrowAmount] = useState(0);
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
    isLoading,
  } = useTokenStore();

  const tokenSymbol = selectedToken.symbol;

  const handleBorrow = async () => {
    if (!wallet || !connection) {
      setError("Wallet not connected");
      return;
    }

    if (!borrowAmount || borrowAmount <= 0) {
      setError("Please enter a valid stake amount");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await borrow(
        wallet,
        connection,
        new PublicKey("fv1mcUWtZX3GVNvK55P3w36nd6r1wsQkPsb3TS2QTT6"),
        borrowAmount,
      );
      toast.success("Borrow successful!");
      callback?.();
      setBorrowAmount(0);
    } catch (error) {
      console.error("Error withdraw:", error);
      setError("Failed to borrow. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-light dark:bg-[#0A0F1C] grid gap-4">
      <Toaster position="top-right" />
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="bg-green-dark border-4 border-black p-3 rounded-3xl">
        <TokenData
          isBorrow
          symbol={tokenSymbol}
          amount={borrowAmount}
          setAmount={setBorrowAmount}
          balance={balance}
          loading={loading || isLoading}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
          supportedTokens={supportedTokens}
        />
      </div>
      <Separator.Root className="bg-green-dark w-full h-1" />
      <BottomBtn
        text="Borrow"
        loading={loading}
        connected={connected}
        handleClick={handleBorrow}
        disabled={loading || borrowAmount === 0}
      />
    </div>
  );
}
