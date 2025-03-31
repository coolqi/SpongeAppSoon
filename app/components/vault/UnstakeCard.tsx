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
import { unstakeSpl, unstakeNative, getUserSplStaked } from "@/lib/program";
import { Connection, PublicKey } from "@solana/web3.js";
import useNetworkStore from "@/store/useNetworkStore";
import useTokenStore from "@/store/useTokenStore";
import { ETH_MINT, SOL_MINT } from "@/core/setting";
import { idl, SoonVault } from "@/program/soon_vault";

export default function UnstakeCard() {
  const {
    selectedToken,
    supportedTokens,
    setSelectedToken,
    balance,
    stakedAmount,
    setBalance,
    setStakedAmount,
    getTokenMint,
  } = useTokenStore();
  const { sendTransaction } = useWallet();
  const { currentNetwork } = useNetworkStore();
  const wallet = useAnchorWallet();
  const [unstakeAmount, setUnstakeAmount] = useState(0);
  const [unstakeValue, setUnstakeValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentPrice = selectedToken.decimals;

  // Create connection using useMemo to prevent recreation on every render
  const connection = useMemo(() => {
    return new Connection(currentNetwork.rpcUrl, "confirmed");
  }, [currentNetwork.rpcUrl]);

  // Fetch staked amount when token changes
  const fetchStakedAmount = async () => {
    if (!wallet) return;

    try {
      const tokenMint = getTokenMint(selectedToken.symbol);

      const staked = await getUserSplStaked(
        connection,
        wallet,
        idl as SoonVault,
        idl.address,
        new PublicKey(currentNetwork.authorityPublicKey),
        tokenMint
      );
      useTokenStore.setState({ stakedAmount: staked || 0 });
    } catch (error) {
      console.error("Error fetching staked amount:", error);
    }
  };

  // Reset amount when token changes and fetch updated staked amount
  useEffect(() => {
    setUnstakeAmount(0);
    setUnstakeValue(0);
    fetchStakedAmount();
  }, [selectedToken, wallet, connection]);

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

      // Convert UI amount to actual amount with decimals
      const actualUnstakeAmount = unstakeAmount * Math.pow(10, selectedToken.decimals);

      if (actualUnstakeAmount > stakedAmount) {
        setError("Unstake amount cannot exceed staked amount");
        return;
      }

      let tx;
      if (selectedToken.isNative) {
        // Use native token unstaking method for ETH
        console.log("Unstaking native token:", selectedToken.symbol);
        tx = await unstakeNative(
          connection,
          wallet as AnchorWallet,
          actualUnstakeAmount,
          idl as SoonVault,
          idl.address,
          new PublicKey(currentNetwork.authorityPublicKey)
        );
      } else {
        // Use SPL token unstaking method
        console.log("Unstaking SPL token:", selectedToken.symbol);
        tx = await unstakeSpl(
          connection,
          wallet as AnchorWallet,
          actualUnstakeAmount,
          idl as SoonVault,
          idl.address,
          new PublicKey(currentNetwork.authorityPublicKey),
          new PublicKey(selectedToken.mint)
        );
      }

      const signature = await sendTransaction(tx, connection, {
        skipPreflight: true,
      });
      console.log(`Transaction sent: ${signature}`);

      // Show success message temporarily
      setError("Transaction sent successfully!");

      // Refresh staked amount after a delay to allow transaction to process
      setTimeout(() => {
        fetchStakedAmount();
        setError(null);
      }, 2000);

      // Reset unstake amount
      setUnstakeAmount(0);
    } catch (error) {
      console.error("Error unstaking:", error);
      setError(
        error instanceof Error ? error.message : "Failed to unstake tokens"
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate displayed staked amount based on token decimals
  const displayStakedAmount = stakedAmount / Math.pow(10, selectedToken.decimals);

  return (
    <div className="bg-white dark:bg-[#0A0F1C] rounded-2xl p-6 border-4 border-red-400">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <TokenData
        symbol={selectedToken.symbol}
        amount={unstakeAmount}
        setAmount={setUnstakeAmount}
        value={unstakeValue}
        setValue={setUnstakeValue}
        currentPrice={currentPrice}
        balance={balance}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        supportedTokens={supportedTokens}
      />

      <StakePercentageButtons
        balance={stakedAmount / Math.pow(10, selectedToken.decimals)}
        setStakeAmount={setUnstakeAmount}
      />

      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Staked Amount
          </span>
          <span className="font-bold ml-1">
            {(stakedAmount / Math.pow(10, selectedToken.decimals)).toFixed(4)} {selectedToken.symbol}
          </span>
        </div>
      </div>

      <MemeButton
        className="w-full mt-6 bg-red-400 hover:bg-red-300 border-red-600"
        onClick={handleUnstake}
        disabled={loading || unstakeAmount <= 0 || (unstakeAmount * Math.pow(10, selectedToken.decimals)) > stakedAmount}
      >
        {loading ? "Processing..." : "Unstake tokens"}
      </MemeButton>
    </div>
  );
}
