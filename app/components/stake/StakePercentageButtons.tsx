'use client';

import React from 'react';

interface StakePercentageButtonsProps {
  balance: number;
  setStakeAmount: (val: number) => void;
}

export default function StakePercentageButtons({ 
  balance, 
  setStakeAmount 
}: StakePercentageButtonsProps) {
  const percentages = [{
    value: 50,
    label: 'Half',
  }, {
    value: 100,
    label: 'Max',
  }]
  
  const handleSetPercentage = (percentage: number) => {
    const amount = (balance * percentage) / 100;
    setStakeAmount(amount);
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