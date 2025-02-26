export interface Network {
  id: string;
  name: string;
  rpc: string;
  rpcUrl: string;
  contractAddress: string;
  authorityPublicKey: any;
  idl: any;
  icon: any;
}

export interface NetworkIconProps {
  network: string;
  size?: number;
}

export interface NetworkButtonProps {
  network: Network;
  isSelected: boolean;
  onClick: () => void;
}
