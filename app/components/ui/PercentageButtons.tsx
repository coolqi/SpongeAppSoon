'use client';

import { getMockQuote } from "@/lib/borrow";

interface StakePercentageButtonsProps {
  balance: number;
  setAmount: (val: number) => void;
}

export default function PercentageButtons({ 
  balance, 
  setAmount 
}: StakePercentageButtonsProps) {
  const percentages = [{
    value: 50,
    label: 'Half',
  }, {
    value: 100,
    label: 'Max',
  }]
  
  const handleSetPercentage = (percentage: number) => {
    const amount = (getMockQuote(balance) * percentage) / 100;
    setAmount(amount);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {percentages.map((percentage) => (
        <button
          key={percentage.value}
          onClick={() => handleSetPercentage(percentage.value)}
          className="rounded-lg py-1 px-2 text-sm bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          {percentage.label}
        </button>
      ))}
    </div>
  );
}