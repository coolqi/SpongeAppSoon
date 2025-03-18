'use client';

import { useState, useRef } from 'react';
import useNetworkStore from '@/store/useNetworkStore';
import { useClickOutside } from '@/hooks/useClickOutside';
import { NetworkButton } from './NetworkButton';
import { NetworkList } from './NetworkList';
import { cn } from '@/lib/utils';

export function NetworkSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { networks, currentNetwork, setNetwork } = useNetworkStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  // If there's only one network, we don't need to show the switcher
  if (networks.length <= 1) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <NetworkButton
        network={currentNetwork}
        onClick={() => setIsOpen(!isOpen)}
        showChevron
        className={cn(
          "bg-yellow-100 dark:bg-[#1A1F2E] rounded-xl border-2 border-yellow-300 dark:border-yellow-600",
          "hover:bg-yellow-200 dark:hover:bg-[#242B3D]"
        )}
      />

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1A1F2E] rounded-xl border-2 border-yellow-300 dark:border-yellow-600 shadow-lg z-50 overflow-hidden">
          <NetworkList
            networks={networks}
            selectedNetwork={currentNetwork}
            onNetworkSelect={(network) => {
              setNetwork(network.id);
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}