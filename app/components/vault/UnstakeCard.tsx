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
import { ETH_MINT, SOL_MINT } from "@/core/setting";
import { idl, SoonVault } from "@/program/soon_vault";
import { Separator } from "radix-ui";
import useStakeStore from "@/store/useStakeStore";

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
  } = useStakeStore();
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
      useStakeStore.setState({ stakedAmount: staked || 0 });
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
      const actualUnstakeAmount =
        unstakeAmount * Math.pow(10, selectedToken.decimals);

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
  const displayStakedAmount =
    stakedAmount / Math.pow(10, selectedToken.decimals);

  return (
    <div className="bg-green-light dark:bg-[#0A0F1C] grid gap-4">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="bg-green-dark border-4 border-black p-3 rounded-3xl">
        <TokenData
          isUnstake
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
      </div>
      <div className="-mt-1 space-y-0">
        <div className="flex justify-between items-center text-gray-dark/70 font-medium">
          <span className=" dark:text-gray-400">Supply</span>
          <span className=" dark:text-gray-400">20M</span>
          </div>
        <div className="flex justify-between items-center text-gray-dark/70 font-medium">
          <span className="dark:text-gray-400">
            Current Price
          </span>
          <span className="font-bold ml-1">
            {/* {(stakedAmount / Math.pow(10, selectedToken.decimals)).toFixed(4)}{" "}
            {selectedToken.symbol} */}
            1 mvmUSD = 1 USD
          </span>
        </div>
      </div>
      <Separator.Root className="bg-green-dark w-full h-1" />
      <MemeButton
        className="w-full bg-yellow-light hover:bg-yellow-dark border-black"
        onClick={handleUnstake}
        disabled={
          loading ||
          unstakeAmount <= 0 ||
          unstakeAmount * Math.pow(10, selectedToken.decimals) > stakedAmount
        }
      >
        {loading ? "Processing..." : "Unstake"}
      </MemeButton>
    </div>
  );
}
