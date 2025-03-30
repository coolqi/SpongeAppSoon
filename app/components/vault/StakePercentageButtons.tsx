'use client';

import React, { Dispatch, SetStateAction } from 'react';

interface StakePercentageButtonsProps {
  balance: number;
  setStakeAmount: Dispatch<SetStateAction<number>>;
}

export default function StakePercentageButtons({ 
  balance, 
  setStakeAmount 
}: StakePercentageButtonsProps) {
  const percentages = [25, 50, 75, 100];
  
  const handleSetPercentage = (percentage: number) => {
    const amount = (balance * percentage) / 100;
    setStakeAmount(amount);
  };

  return (
    <div className="grid grid-cols-4 gap-2 mt-4">
      {percentages.map((percentage) => (
        <button
          key={percentage}
          onClick={() => handleSetPercentage(percentage)}
          className="rounded-lg py-1 px-2 text-sm bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          {percentage}%
        </button>
      ))}
    </div>
  );
}