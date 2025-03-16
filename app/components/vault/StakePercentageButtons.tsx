'use client';

interface StakePercentageButtonsProps {
  balance: number | null;
  setStakeAmount: (amount: number) => void;
}

export default function StakePercentageButtons({ balance, setStakeAmount }: StakePercentageButtonsProps) {
  const percentages = [25, 50, 75, 100];

  const handleSetPercentage = (percentage: number) => {
    if (balance !== null) {
      const amount = (balance * percentage) / 100;
      setStakeAmount(parseFloat(amount.toFixed(4))); // 保留 4 位小數，確保顯示清晰
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      {percentages.map((percentage) => (
        <button
          key={percentage}
          className="flex-1 py-2 px-3 bg-yellow-200 hover:bg-yellow-300 rounded-xl text-sm font-bold text-black border-2 border-yellow-400 transform hover:scale-105 transition-all"
          onClick={() => handleSetPercentage(percentage)}
          disabled={balance === null}
        >
          {percentage}%
        </button>
      ))}
    </div>
  );
}
