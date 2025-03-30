import { create } from "zustand";
import { devnet, mainnet } from '@/config/networks';
import { idl } from '@/program/soon_vault';

export interface Network {
  id: string;
  name: string;
  rpcUrl: string;
  contractAddress: string;
  authorityPublicKey: string;
  idl: any;
  icon: string;
}

interface NetworkState {
  networks: Network[];
  currentNetwork: {
    name: string;
    rpcUrl: string;
    authorityPublicKey: string;
  };
  setCurrentNetwork: (network: string) => void;
}

const NETWORKS: Network[] = [
  {
    id: "soon",
    name: "SOON Testnet",
    // Original RPC URL (not used directly in browser)
    rpcUrl: "https://detailed-sharleen-fast-devnet.helius-rpc.com",
    // rpcUrl: "/api/rpc", // Using our proxy endpoint
    contractAddress: "9PCuUZGyahj9Akup3qJVrKVVpfhjeNnVnkbrdtJ1RcXm",
    authorityPublicKey: "5Z4M4kobAYCJ39QFSwP3AXacgngoqE18tYC1Ew32Vqgm",
    idl: idl,
    icon: "/soon.png"
  }
];

const useNetworkStore = create<NetworkState>((set) => ({
  networks: NETWORKS,
  currentNetwork: {
    name: NETWORKS[0].name,
    rpcUrl: NETWORKS[0].rpcUrl,
    authorityPublicKey: NETWORKS[0].authorityPublicKey,
  },
  setCurrentNetwork: (networkId) => {
    const network = NETWORKS.find(n => n.id === networkId) || NETWORKS[0];
    set(() => ({
      currentNetwork: {
        name: network.name,
        rpcUrl: network.rpcUrl,
        authorityPublicKey: network.authorityPublicKey,
      },
    }));
  },
}));

export default useNetworkStore;