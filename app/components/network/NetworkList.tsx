"use client";

import { Network } from "@/store/useNetworkStore";
import { NetworkButton } from "./NetworkButton";

interface NetworkListProps {
  networks: Network[];
  selectedNetwork: Network;
  onNetworkSelect: (network: Network) => void;
}

export function NetworkList({
  networks,
  selectedNetwork,
  onNetworkSelect,
}: NetworkListProps) {
  return (
    <div className="w-full">
      {networks.map((network) => (
        <NetworkButton
          key={network.id}
          network={network}
          isSelected={selectedNetwork.id === network.id}
          onClick={() => onNetworkSelect(network)}
          className="w-full"
        />
      ))}
    </div>
  );
}
