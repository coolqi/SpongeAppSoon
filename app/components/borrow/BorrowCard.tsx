"use client";

import { MemeButton } from "../ui/MemeButton";
import {
  useWallet,
  useAnchorWallet,
  AnchorWallet,
} from "@solana/wallet-adapter-react";
import { Separator } from "radix-ui";
import { useState, useEffect, useMemo } from "react";
import {
  stakeSpl,
  getUserNativeBalance,
  getUserSplBalance,
  getUserSplStaked,
} from "@/lib/program";
import {
  Connection,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
} from "@solana/web3.js";
import useNetworkStore from "@/store/useNetworkStore";
import useTokenStore from "@/store/useTokenStore";
import { idl, SoonVault } from "@/program/soon_vault";
import { token } from "@coral-xyz/anchor/dist/cjs/utils";
import { Transaction } from "@solana/web3.js";
import { stakeNative } from "@/lib/program";
import TokenData from "./TokenData";
import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";

interface BorrowCardProps {
  data: any;
  connected: boolean;
}

export default function BorrowCard({ data, connected }: BorrowCardProps) {
  console.log('BorrowCard data', data);
  const wallet = useAnchorWallet();
  const { sendTransaction } = useWallet();
  const { currentNetwork } = useNetworkStore();
  const [stakeAmount, setStakeAmount] = useState(0);
  const [stakeValue, setStakeValue] = useState(0);
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
    stakedAmount,
    setBalance,
    setStakedAmount,
    getTokenMint,
  } = useTokenStore();

  const tokenSymbol = selectedToken.symbol;
  const currentPrice = selectedToken.decimals;

  // Define fetchBalances as a function to be reused
  const fetchBalances = async (): Promise<void> => {
    // Return early if wallet is not connected
    console.log('fetchBalances called');
    if (!wallet) {
      setError("Wallet not connected");
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      // Fetch balance based on token type
      if (selectedToken.isNative) {
        // For native token (ETH)
        const nativeBalance = await getUserNativeBalance(connection, wallet);
        setBalance(nativeBalance || 0);
      } else {
        // For SPL tokens
        console.log("SPL Token Mint", selectedToken.mint);
        const splBalance = await getUserSplBalance(
          connection,
          wallet,
          selectedToken.mint
        );
        console.log("BALANCE", splBalance);
        setBalance(splBalance || 0);
      }

      // Fetch staked amount
      const tokenMint = getTokenMint(selectedToken.symbol);

      const staked = await getUserSplStaked(
        connection,
        wallet,
        idl as SoonVault,
        idl.address,
        new PublicKey(currentNetwork.authorityPublicKey),
        tokenMint
      );
      console.log("tokenMint", tokenMint.toBase58());
      setStakedAmount(staked || 0);
    } catch (error) {
      console.error("Error fetching balances:", error);
      setError("Failed to fetch balances. Check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!wallet) return;
    console.log("Wallet connected:", selectedToken);
    fetchBalances();
  }, [
    wallet,
    currentNetwork.rpcUrl,
    selectedToken,
    connection,
    setBalance,
    setStakedAmount,
    getTokenMint,
  ]);

  const handleBorrow = async () => {
    if (!wallet || !connection) {
      setError("Wallet not connected");
      return;
    }

    if (!stakeAmount || stakeAmount <= 0) {
      setError("Please enter a valid stake amount");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('selectedToken', selectedToken)
    } catch (error) {
      console.error("Error withdraw:", error);
      setError("Failed to borrow. Please try again.");
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
          isBorrow
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
      </div>
      <div className="-mt-1 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Available colleteral:
          </span>
          <span className="font-bold ml-1">
            --
            {/* {(stakedAmount / Math.pow(10, selectedToken.decimals)).toFixed(4)}{" "}
              {selectedToken.symbol} */}
          </span>
        </div>
      </div>
      <Separator.Root className="bg-green-dark w-full h-1" />
      {connected ? (
        <MemeButton
          className="mt-0 w-full bg-yellow-light hover:bg-yellow-dark border-black"
          onClick={handleBorrow}
          disabled={loading || stakeAmount <= 0}
        >
          {loading ? "Processing..." : "Borrow"}
        </MemeButton>
      ) : (
        <div className="rounded-full mt-0 w-full bg-yellow-light hover:bg-yellow-dark font-bold">
          <UnifiedWalletButton
            buttonClassName="!transform !hover:scale-105 !transition-all !border-4 !border-black !rounded-full !w-full !py-3 !px-6 !text-base !flex !items-center !justify-center !bg-yellow-light"
          />
        </div>
      )}
    </div>
  );
}
