"use client";

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
  const percentages = [
    {
      value: 50,
      label: "Half",
    },
    {
      value: 100,
      label: "Max",
    },
  ];

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
          className="leading-none rounded-xl py-1.5 px-3 text-sm bg-green-light shadow-inner-green text-black hover:bg-green-dark transition-colors disabled:hover:bg-green-light"
        >
          {percentage.label}
        </button>
      ))}
    </div>
  );
}
