'use client';
import { Input } from "./Input";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface TokenDataProps {
  symbol: string;
  amount: number;
  setAmount: (amount: number) => void;
  value: number;
  setValue: (amount: number) => void;
  currentPrice: number;
  balance: number | null;
  selectedToken: { symbol: string; mint: string };
  setSelectedToken: (token: { symbol: string; mint: string }) => void;
  supportedTokens: { symbol: string; mint: string }[];
}

export default function TokenData({ 
  symbol, 
  amount, 
  setAmount, 
  value, 
  setValue, 
  currentPrice, 
  balance, 
  selectedToken, 
  setSelectedToken,
  supportedTokens
}: TokenDataProps) {
  useEffect(() => {
    setValue(amount * currentPrice);
  }, [amount, currentPrice, setValue]);

  const getTokenIcon = (symbol: string) => {
    switch (symbol) {
      case 'ETH':
        return 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png';
      case 'SOL':
        return '/solana.png';
      default:
        return '';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="relative">
          <select
            value={selectedToken.symbol}
            onChange={(e) => {
              const newToken = supportedTokens.find((t) => t.symbol === e.target.value)!;
              setSelectedToken(newToken);
            }}
            className="bg-gray-900 text-white pl-8 pr-4 py-2 rounded-lg border border-gray-600 min-w-[100px] appearance-none cursor-pointer"
          >
            {supportedTokens.map((token) => (
              <option key={token.symbol} value={token.symbol}>
                {token.symbol}
              </option>
            ))}
          </select>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <Image
              src={getTokenIcon(selectedToken.symbol)}
              alt={selectedToken.symbol}
              width={20}
              height={20}
              className=""
            />
          </div>
        </div>

        <div className="inline-flex text-right text-sm text-gray-500 dark:text-gray-400">
          Balance: 
          <span className="font-bold ml-1">{balance !== null ? balance.toFixed(4) : "Loading..."}</span>
          <span className="ml-1">{selectedToken.symbol}</span>
        </div>
      </div>      
      <div className="space-y-1">
        <Input
          id="stake-amount"
          placeholder="0.0"
          type="number"
          value={amount}
          onChange={(e) => {
            const newAmount = parseFloat(e.target.value);
            setAmount(isNaN(newAmount) ? 0 : newAmount);
          }}
          className="bg-gray-700 bg-opacity-50 border-none text-white placeholder-gray-400"
        />
        <div className="text-gray-600 dark:text-gray-400">
          {value.toFixed(2)} USDC
        </div>
      </div>
    </div>
  );
}