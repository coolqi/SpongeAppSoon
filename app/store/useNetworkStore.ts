import { create } from "zustand";
import { IDL as soonIDL } from '@/program/soon_vault';

export interface Network {
  id: string;
  name: string;
  rpcUrl: string;
  contractAddress: string;
  authorityPublicKey: string;
  idl: any;
  icon: string;
}

interface NetworkStore {
  networks: Network[];
  currentNetwork: Network;
  setNetwork: (networkId: string) => void;
}

const NETWORKS: Network[] = [
  {
    id: "soon",
    name: "SOON Testnet",
    rpcUrl: "https://rpc.testnet.soo.network/rpc",
    contractAddress: "2h1ghABKLrkEPK9YengE7ZBEYep6Dj8BHVQUj3AMde9p",
    authorityPublicKey: "7mddywPSUdnsstKxEmVv54xk5ZcjAp7HsF7ExMUGJpWe",
    idl: soonIDL,
    icon: "/soon.png"
  }
];

const useNetworkStore = create<NetworkStore>((set) => ({
  networks: NETWORKS,
  currentNetwork: NETWORKS[0],
  setNetwork: (networkId: string) => {
    const network = NETWORKS.find(n => n.id === networkId);
    if (network) {
      set({ currentNetwork: network });
    }
  }
}));

export default useNetworkStore;