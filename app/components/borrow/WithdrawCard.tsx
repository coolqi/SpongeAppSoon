"use client";

import { MemeButton } from "../ui/MemeButton";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Separator } from "radix-ui";
import { useState, useEffect, useMemo } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import useNetworkStore from "@/store/useNetworkStore";
import useTokenStore from "@/store/useTokenStore";
import TokenData from "./TokenData";
import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";
import { redeem } from "@/lib/borrow";
import toast, { Toaster } from "react-hot-toast";
import { BottomBtn } from "./BottomBtn";

interface WithdrawCardProps {
  connected: boolean;
  callback?: () => void;
}

export default function WithdrawCard({
  connected,
  callback,
}: WithdrawCardProps) {
  const { currentNetwork } = useNetworkStore();
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

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

  useEffect(() => {
    setWithdrawAmount(balance);
  }, [balance]);

  const handleWithdraw = async () => {
    if (!wallet || !connection) {
      toast.error("Wallet not connected");
      return;
    }

    if (!withdrawAmount || withdrawAmount <= 0) {
      toast.error("Please enter a valid withdraw amount");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await redeem(
        // withdraw
        wallet,
        connection,
        new PublicKey("fv1mcUWtZX3GVNvK55P3w36nd6r1wsQkPsb3TS2QTT6")
      );
      callback?.();
      toast.success("Withdraw successful!");
    } catch (error) {
      console.error("Error withdraw:", error);
      setError("Failed to withdraw. Please try again.");
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
          symbol={tokenSymbol}
          amount={withdrawAmount}
          setAmount={setWithdrawAmount}
          balance={balance}
          loading={loading || isLoading}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
          supportedTokens={supportedTokens}
        />
      </div>
      <Separator.Root className="bg-green-dark w-full h-1" />
      <BottomBtn
        text="Withdraw"
        loading={loading}
        connected={connected}
        handleClick={handleWithdraw}
        disabled={loading || withdrawAmount === 0 || !selectedToken.symbol}
      />
    </div>
  );
}
