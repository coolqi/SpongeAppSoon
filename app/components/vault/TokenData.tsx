'use client';
import { Input } from "./Input";
import React, { useEffect } from 'react';


interface TokenDataProps {
  symbol: string;
  amount: number;
  setAmount: (amount: number) => void;
  value: number;
  setValue: (amount: number) => void;
  currentPrice: number
}

export default function TokenData({ symbol, amount, setAmount, value, setValue, currentPrice }: TokenDataProps) {
  useEffect(() => {
    setValue(amount * currentPrice)
    setAmount(amount)
  }, [amount]);

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">◎</span>
          <span className="font-bold">{symbol}</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {/* Balance: {walletBalance !== null ? walletBalance.toFixed(2) : "Loading..."} SOL */}
          Balance: 30.0 SOL
        </div>
      </div>
      <div className="space-y-1">
        <Input
          id="stake-amount"
          placeholder="0.0"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="bg-gray-700 bg-opacity-50 border-none text-white placeholder-gray-400"
        />
        <div className="text-gray-600 dark:text-gray-400">
          {value.toFixed(2)} USDC
        </div>
      </div>
    </div>
  );
}