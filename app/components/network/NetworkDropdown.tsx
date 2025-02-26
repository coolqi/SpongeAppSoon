import { Network } from './types';
import { NetworkButton } from './NetworkButton';

interface NetworkDropdownProps {
  networks: Network[];
  selectedNetwork: string;
  onNetworkSelect: (network: Network) => void;
}

export function NetworkDropdown({ 
  networks, 
  selectedNetwork, 
  onNetworkSelect 
}: NetworkDropdownProps) {

  return (
    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1A1F2E] rounded-xl border-2 border-yellow-300 dark:border-yellow-600 shadow-lg z-50 overflow-hidden">
      {networks.length && networks.map((network) => (
        <NetworkButton
          key={network.id}
          network={network}
          isSelected={selectedNetwork === network.name}
          onClick={() => onNetworkSelect(network)}
        />
      ))}
    </div>
  );
}