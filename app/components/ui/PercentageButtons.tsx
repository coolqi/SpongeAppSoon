'use client';

interface PercentageButtonsProps {
  balance: number;
  setAmount: (val: number) => void;
  disabled?: boolean;
}

export default function PercentageButtons({ 
  balance, 
  setAmount,
  disabled,
}: PercentageButtonsProps) {
  
  const percentages = [{
    value: 50,
    label: 'Half',
  }, {
    value: 100,
    label: 'Max',
  }]
  
  const handleSetPercentage = (percentage: number) => {
    const amount = (balance * percentage) / 100;
    setAmount(amount);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {percentages.map((percentage) => (
        <button
          key={percentage.value}
          disabled={balance === 0 || disabled}
          onClick={() => handleSetPercentage(percentage.value)}
          className="rounded-lg py-1 px-2 text-sm bg-gray-800 text-white hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:text-gray-900"
        >
          {percentage.label}
        </button>
      ))}
    </div>
  );
}