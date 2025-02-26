'use client';

import { NetworkIcon } from './NetworkIcon';
import { cn } from '@/lib/utils';
import { Network } from '@/store/useNetworkStore';

interface NetworkButtonProps {
  network: Network;
  isSelected?: boolean;
  onClick?: () => void;
  showChevron?: boolean;
  className?: string;
}

export function NetworkButton({ 
  network, 
  isSelected, 
  onClick, 
  showChevron,
  className 
}: NetworkButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 px-4 py-2 hover:bg-yellow-100 dark:hover:bg-[#242B3D] transition-colors",
        isSelected && "bg-yellow-200 dark:bg-[#242B3D]",
        className
      )}
    >
      <NetworkIcon src={network.icon} alt={network.name} />
      <span className="font-medium">{network.name}</span>
      {showChevron && (
        <svg
          className="w-4 h-4 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </button>
  );
}